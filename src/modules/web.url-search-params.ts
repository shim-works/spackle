// Ported from: the prior implementation (url-search-params.ts + is-url-search-params-supported.ts)

// URLSearchParams — behavioral: run the common construction forms an app relies
// on. Object init serializes to a=1, a leading "?" is stripped, get() reads a
// value back, and repeated keys keep their original interleaved order (a
// dict-of-arrays implementation gets that last one wrong). A partial native that
// flubs any of these is rejected.
export const isSupported = (): boolean => {
  try {
    if (typeof URLSearchParams === 'undefined') {
      return false;
    }

    // object init should serialize to "a=1"
    if (new URLSearchParams({ a: '1' }).toString() !== 'a=1') {
      return false;
    }

    // the leading "?" should be stripped
    if (new URLSearchParams('?a=1').toString() !== 'a=1') {
      return false;
    }

    // insertion order is preserved across repeated keys, not grouped by key
    if (new URLSearchParams('a=1&b=2&a=3').toString() !== 'a=1&b=2&a=3') {
      return false;
    }

    // and get() should read the value back
    return new URLSearchParams('a=1').get('a') === '1';
  } catch {
    return false;
  }
};

export const isURLSearchParamsSupported = isSupported;

/**
 * Spec: https://url.spec.whatwg.org/#interface-urlsearchparams
 *
 * Storage is a flat list of [name, value] pairs, in insertion order — the
 * structure the spec describes. A plain object keyed by name (the previous
 * shape) grouped repeated keys together, so `a=1&b=2&a=3` round-tripped as
 * `a=1&a=3&b=2`, and a key of `__proto__` corrupted the backing object.
 *
 * GC: one array per instance, holding only strings. Deliberately not backed by
 * Map — that would nest this polyfill on another one (see DESIGN.md).
 *
 * Known limitations:
 * - [incomplete] Missing entries(), keys(), values() iterators.
 * - [incomplete] Missing [Symbol.iterator].
 * - [incomplete] Missing sort() method.
 */

const decode = (str: string): string => {
  return decodeURIComponent(str.replace(/\+/g, ' '));
};

const encode = (str: string): string => {
  return encodeURIComponent(str).replace(/%20/g, '+');
};

const parseString = (search: string): [string, string][] => {
  const pairs: [string, string][] = [];
  // drop a leading '?' if the caller passed the whole search string
  const query = search.indexOf('?') === 0 ? search.substring(1) : search;
  if (!query) {
    return pairs;
  }
  // split into key=value chunks on '&', then split each chunk on its first '='
  const chunks = query.split('&');
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (chunk === '') {
      continue;
    }
    const equalsAt = chunk.indexOf('=');
    if (equalsAt > -1) {
      pairs.push([decode(chunk.substring(0, equalsAt)), decode(chunk.substring(equalsAt + 1))]);
    } else {
      pairs.push([decode(chunk), '']); // bare key with no '=' → empty value
    }
  }
  return pairs;
};

export const URLSearchParams = function (
  this: any,
  search?: string | Record<string, string> | [string, string][]
) {
  this._pairs = [];

  if (search === null || search === undefined || search === '') {
    return;
  }

  if (typeof search === 'string') {
    this._pairs = parseString(search);
    return;
  }

  // sequence of [name, value] pairs
  if (Array.isArray(search)) {
    for (let i = 0; i < search.length; i++) {
      const entry = search[i];
      if (!entry || entry.length !== 2) {
        throw new TypeError(
          "Failed to construct 'URLSearchParams': Each sequence element must contain exactly two items"
        );
      }
      this._pairs.push([String(entry[0]), String(entry[1])]);
    }
    return;
  }

  // record<string, string>
  for (const key in search as Record<string, string>) {
    if (Object.prototype.hasOwnProperty.call(search, key)) {
      this._pairs.push([key, String((search as Record<string, string>)[key])]);
    }
  }
} as any;

URLSearchParams.prototype.get = function (name: string): string | null {
  const key = String(name);
  for (let i = 0; i < this._pairs.length; i++) {
    if (this._pairs[i][0] === key) {
      return this._pairs[i][1];
    }
  }
  return null;
};

URLSearchParams.prototype.getAll = function (name: string): string[] {
  const key = String(name);
  const values: string[] = [];
  for (let i = 0; i < this._pairs.length; i++) {
    if (this._pairs[i][0] === key) {
      values.push(this._pairs[i][1]);
    }
  }
  return values;
};

URLSearchParams.prototype.has = function (name: string): boolean {
  const key = String(name);
  for (let i = 0; i < this._pairs.length; i++) {
    if (this._pairs[i][0] === key) {
      return true;
    }
  }
  return false;
};

URLSearchParams.prototype.set = function (name: string, value: string): void {
  const key = String(name);
  const next = String(value);
  let replaced = false;
  // spec: overwrite the FIRST match in place (keeping its position), drop the rest
  const kept: [string, string][] = [];
  for (let i = 0; i < this._pairs.length; i++) {
    if (this._pairs[i][0] !== key) {
      kept.push(this._pairs[i]);
    } else if (!replaced) {
      kept.push([key, next]);
      replaced = true;
    }
  }
  if (!replaced) {
    kept.push([key, next]);
  }
  this._pairs = kept;
};

URLSearchParams.prototype.append = function (name: string, value: string): void {
  this._pairs.push([String(name), String(value)]);
};

URLSearchParams.prototype['delete'] = function (name: string): void {
  const key = String(name);
  const kept: [string, string][] = [];
  for (let i = 0; i < this._pairs.length; i++) {
    if (this._pairs[i][0] !== key) {
      kept.push(this._pairs[i]);
    }
  }
  this._pairs = kept;
};

URLSearchParams.prototype.toString = function (): string {
  const parts: string[] = [];
  for (let i = 0; i < this._pairs.length; i++) {
    parts.push(encode(this._pairs[i][0]) + '=' + encode(this._pairs[i][1]));
  }
  return parts.join('&');
};

URLSearchParams.prototype.forEach = function (
  callback: (value: string, key: string, parent: any) => void,
  thisArg?: any
): void {
  // snapshot the length up front so an append during iteration can't loop
  // forever, matching how the spec's ordered-list iteration behaves
  for (let i = 0; i < this._pairs.length; i++) {
    callback.call(thisArg, this._pairs[i][1], this._pairs[i][0], this);
  }
};

if (!isSupported()) {
  Object.defineProperty((window as any), 'URLSearchParams', { value: URLSearchParams, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).URLSearchParams, 'name', { value: 'URLSearchParams', configurable: true });
  Object.defineProperty((window as any).URLSearchParams, '__polyfilled', { value: true });
}
