// Ported from: the prior implementation (url.ts + is-url-supported.ts)

// URL — behavioral: old/partial natives fumbled relative-URL resolution, path
// %-encoding, or didn't expose searchParams. We resolve a relative URL against a
// base, set a path with a space, and confirm it encoded to %20.
//
// The last two checks cover the Chrome 49-55 era, where `searchParams` existed
// but was neither identity-stable nor live: the spec (and Chrome from ~56)
// requires `url.searchParams` to return the SAME object every access, and
// mutations to it to write through to `url.search`. A native that hands back a
// fresh detached copy each time passes a naive typeof check and then silently
// drops every param mutation.
export const isSupported = (): boolean => {
  try {
    const url = new URL('b', 'http://a');
    url.pathname = 'c d';
    if (url.href !== 'http://a/c%20d' || url.searchParams === undefined) {
      return false;
    }
    if (url.searchParams !== url.searchParams) {
      return false;
    }
    const live = new URL('http://a/?x=1');
    live.searchParams.set('x', '2');
    return live.search === '?x=2';
  } catch {
    return false;
  }
};

export const isURLSupported = isSupported;

/**
 * Spec: https://url.spec.whatwg.org/#url-class
 * Based on url-polyfill@1.1.13.
 *
 * GC: the URL holds its URLSearchParams, and the params hold nothing back.
 * Liveness runs the other way — `search` and `href` are prototype getters that
 * re-serialize from the params on read, rather than the params pushing updates
 * into the URL through wrapper methods that close over it. That earlier shape
 * made every URL instance part of a reference cycle
 * (url → searchParams → patched append → closure → url), which the collectors
 * on this floor do not reliably reclaim.
 *
 * Accessors live on the prototype, and per-instance state in `_rawSearch` /
 * `_params`, so constructing a URL allocates no closures.
 *
 * Known limitations:
 * - [incomplete] `href` is recomposed as protocol + '//' + host + pathname +
 *   search + hash, so non-hierarchical URLs (mailto:, data:) don't round-trip.
 *   Same formula the previous implementation used when re-serializing.
 */

// install-once guard: applyURLPolyfill may be called more than once
let alreadyInstalled = false;

export const applyURLPolyfill = (): void => {
  if (alreadyInstalled) return;
  alreadyInstalled = true;

  if (typeof window === 'undefined') return;

  // hang onto the native URL if there is one — we still want its
  // createObjectURL / revokeObjectURL statics
  const nativeURL = (window as any).URL || (window as any).webkitURL || null;

  const anchor = document.createElement('a');

  // One reusable resolver document instead of one per construction. The old
  // code built a whole createHTMLDocument('') on EVERY `new URL(x, base)`,
  // which is a document, a head, a body and two elements per URL.
  let resolverDoc: Document | null = null;
  let resolverBase: HTMLBaseElement | null = null;
  let resolverAnchor: HTMLAnchorElement | null = null;

  /**
   * Resolve a relative URL against a base using the anchor trick.
   */
  const resolveUrl = (base: string, relative: string): string => {
    if (resolverDoc === null) {
      resolverDoc = document.implementation.createHTMLDocument('');
      resolverBase = resolverDoc.createElement('base');
      resolverDoc.head.appendChild(resolverBase);
      resolverAnchor = resolverDoc.createElement('a');
      resolverDoc.body.appendChild(resolverAnchor);
    }
    resolverBase!.href = base;
    resolverAnchor!.href = relative;
    return resolverAnchor!.href;
  };

  const normalizeSearch = (value: string): string => {
    if (value === '' || value === '?') return '';
    return value.charAt(0) === '?' ? value : '?' + value;
  };

  const URLPolyfill = function (this: any, url: string, base?: string) {
    if (typeof url !== 'string') {
      url = String(url);
    }

    url = url.trim();

    // With no base, the spec requires an absolute URL. The anchor trick can't
    // tell us that on its own -- assigning a relative string to anchor.href
    // silently resolves it against the *document's* base URL and reports a
    // perfectly good protocol -- so check for a scheme before parsing.
    if (base === undefined && !/^[a-zA-Z][a-zA-Z0-9+.\-]*:/.test(url)) {
      throw new TypeError("Invalid URL: '" + url + "'");
    }

    const resolvedUrl: string = base !== undefined ? resolveUrl(String(base), url) : url;

    anchor.href = resolvedUrl;

    // IE doesn't set pathname for opaque URLs
    if (anchor.host === '') {
      anchor.href = anchor.href;
    }

    if (!anchor.protocol || anchor.protocol === ':') {
      throw new TypeError("Invalid URL: '" + url + "'");
    }

    this.protocol = anchor.protocol;
    this.hostname = anchor.hostname;
    this.port = anchor.port;
    this.host = anchor.host;
    this.hash = anchor.hash;
    this.username = '';
    this.password = '';

    // Normalize pathname — some browsers omit the leading /
    this.pathname = anchor.pathname;
    if (this.pathname.charAt(0) !== '/') {
      this.pathname = '/' + this.pathname;
    }

    this.origin =
      this.protocol + '//' + this.hostname + (this.port ? ':' + this.port : '');

    // Query state. _params stays null until someone actually asks for
    // searchParams, so a URL that never touches the query allocates nothing.
    this._rawSearch = normalizeSearch(anchor.search);
    this._params = null;
  } as any;

  Object.defineProperty(URLPolyfill.prototype, 'searchParams', {
    configurable: true,
    enumerable: true,
    get: function (this: any) {
      if (this._params === null) {
        this._params = new URLSearchParams(this._rawSearch);
      }
      return this._params;
    },
  });

  Object.defineProperty(URLPolyfill.prototype, 'search', {
    configurable: true,
    enumerable: true,
    // Read through to the params when they exist, so mutations made via
    // searchParams show up here with no write-back wiring at all.
    get: function (this: any) {
      if (this._params !== null) {
        const query = this._params.toString();
        return query ? '?' + query : '';
      }
      return this._rawSearch;
    },
    set: function (this: any, value: any) {
      const next = normalizeSearch(String(value));
      this._rawSearch = next;
      if (this._params !== null) {
        // The spec keeps the same URLSearchParams object across a `search`
        // assignment, so refill it in place rather than replacing it. Done
        // through the public API only — URLSearchParams here may be a native
        // one, whose internals we can't touch.
        const params = this._params;
        const names: string[] = [];
        params.forEach(function (_value: string, name: string) {
          if (names.indexOf(name) === -1) names.push(name);
        });
        for (let i = 0; i < names.length; i++) {
          params.delete(names[i]);
        }
        new URLSearchParams(next).forEach(function (v: string, name: string) {
          params.append(name, v);
        });
      }
    },
  });

  Object.defineProperty(URLPolyfill.prototype, 'href', {
    configurable: true,
    enumerable: true,
    get: function (this: any) {
      return this.protocol + '//' + this.host + this.pathname + this.search + this.hash;
    },
  });

  // Prototype methods, allocated once — not per instance.
  URLPolyfill.prototype.toString = function (this: any) {
    return this.href;
  };

  URLPolyfill.prototype.toJSON = function (this: any) {
    return this.href;
  };

  // Delegate the object-URL statics straight to native (we can't fake blob URLs)
  if (nativeURL) {
    if (nativeURL.createObjectURL) {
      URLPolyfill.createObjectURL = (blob: any) => nativeURL.createObjectURL(blob);
    }
    if (nativeURL.revokeObjectURL) {
      URLPolyfill.revokeObjectURL = (url: string) => nativeURL.revokeObjectURL(url);
    }
  }

  Object.defineProperty((window as any), 'URL', { value: URLPolyfill, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).URL, 'name', { value: 'URL', configurable: true });
  Object.defineProperty((window as any).URL, '__polyfilled', { value: true });

  // Polyfill window.location.origin if missing
  if (typeof window.location !== 'undefined' && !('origin' in window.location)) {
    const getOrigin = () =>
      window.location.protocol +
      '//' +
      window.location.hostname +
      (window.location.port ? ':' + window.location.port : '');
    try {
      Object.defineProperty(window.location, 'origin', {
        get: getOrigin,
        enumerable: true,
      });
    } catch {
      // If defineProperty fails (IE), set directly — static snapshot, not live
      (window.location as any).origin = getOrigin();
    }
  }
};

if (!isSupported()) {
  applyURLPolyfill();
}
