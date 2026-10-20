// Behavioural: relative resolution, path %-encoding, and a `searchParams` that is
// identity-stable and live (Chrome 49-55's returned a detached copy each time).
import { define } from '../define.js';

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

/**
 * Spec: https://url.spec.whatwg.org/#url-class
 * Based on url-polyfill@1.1.13.
 *
 * `search` and `href` are prototype getters that re-serialize from the params,
 * so the params never hold the URL (no url -> params -> closure -> url cycle),
 * and constructing a URL allocates no closures.
 *
 * Known limitations:
 * - [incomplete] `href` is recomposed as protocol + '//' + host + pathname +
 *   search + hash, so non-hierarchical URLs (mailto:, data:) don't round-trip.
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

  // One reusable resolver document, not one per construction.
  let resolverDoc: Document | null = null;
  let resolverBase: HTMLBaseElement | null = null;
  let resolverAnchor: HTMLAnchorElement | null = null;

  // Resolve against a base with the anchor trick.
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

    // No base: require a scheme, since anchor.href would resolve a relative string
    // against the document's base URL.
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
        // Refill the same URLSearchParams in place (the spec keeps its identity), via
        // the public API since it may be native.
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
  Object.defineProperty(URLPolyfill.prototype, 'toString', {
    writable: true, enumerable: false, configurable: true,
    value: function (this: any) {
      return this.href;
    },
  });

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

  define((window as any), 'URL', URLPolyfill);

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

export const install = (): void => {
  applyURLPolyfill();
};
