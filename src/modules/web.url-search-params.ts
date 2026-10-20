// Behavioural: object init, a leading "?", get(), and interleaved order for
// repeated keys.
import { define } from '../define.js';

export const isSupported = (): boolean => {
  try {
    // Read the native off window: the bare name resolves to this module's own export.
    const Native = (window as any).URLSearchParams;
    if (typeof Native === 'undefined') {
      return false;
    }

    if (new Native({ a: '1' }).toString() !== 'a=1') {
      return false;
    }

    if (new Native('?a=1').toString() !== 'a=1') {
      return false;
    }

    if (new Native('a=1&b=2&a=3').toString() !== 'a=1&b=2&a=3') {
      return false;
    }

    return new Native('a=1').get('a') === '1';
  } catch {
    return false;
  }
};

/**
 * Spec: https://url.spec.whatwg.org/#interface-urlsearchparams
 *
 * Storage is a flat list of [name, value] pairs in insertion order, as the spec
 * describes: repeated keys stay interleaved, and `__proto__` is just a name.
 *
 * Known limitations:
 * - [incomplete] Missing entries(), keys(), values() iterators.
 * - [incomplete] Missing [Symbol.iterator].
 * - [incomplete] Missing sort() method.
 */

// Only text that contains a '%' comes here -- the '+' and no-'%' fast path is
// inlined at each call site, so the try below is off the common path.
const decodePercent = (str: string): string => {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return decodeLenient(str);
  }
};

// The WHATWG UTF-8 decoder, run over percent-decoded bytes. Raw (unescaped)
// characters end any pending byte sequence and pass through as themselves.
const decodeLenient = (str: string): string => {
  let out = '';
  let needed = 0;
  let seen = 0;
  let cp = 0;
  let lower = 0x80;
  let upper = 0xbf;
  const flush = (): void => {
    if (needed !== 0) {
      out += '\ufffd';
      needed = seen = cp = 0;
      lower = 0x80;
      upper = 0xbf;
    }
  };
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    let byte = -1;
    if (ch === 37 && i + 2 < str.length) {
      // inlined: hexValue(str.charCodeAt(i + 1))
      const hiCode = str.charCodeAt(i + 1);
      const hi =
        hiCode >= 48 && hiCode <= 57 ? hiCode - 48 : // 0-9
        hiCode >= 65 && hiCode <= 70 ? hiCode - 55 : // A-F
        hiCode >= 97 && hiCode <= 102 ? hiCode - 87 : // a-f
        -1;
      // inlined: hexValue(str.charCodeAt(i + 2))
      const loCode = str.charCodeAt(i + 2);
      const lo =
        loCode >= 48 && loCode <= 57 ? loCode - 48 : // 0-9
        loCode >= 65 && loCode <= 70 ? loCode - 55 : // A-F
        loCode >= 97 && loCode <= 102 ? loCode - 87 : // a-f
        -1;
      if (hi !== -1 && lo !== -1) {
        byte = hi * 16 + lo;
        i += 2;
      }
    }
    if (byte === -1) {
      flush();
      out += str.charAt(i);
      continue;
    }
    for (;;) {
      if (needed === 0) {
        if (byte <= 0x7f) out += String.fromCharCode(byte);
        else if (byte >= 0xc2 && byte <= 0xdf) { needed = 1; cp = byte & 0x1f; }
        else if (byte >= 0xe0 && byte <= 0xef) {
          if (byte === 0xe0) lower = 0xa0;
          if (byte === 0xed) upper = 0x9f;
          needed = 2;
          cp = byte & 0xf;
        } else if (byte >= 0xf0 && byte <= 0xf4) {
          if (byte === 0xf0) lower = 0x90;
          if (byte === 0xf4) upper = 0x8f;
          needed = 3;
          cp = byte & 0x7;
        } else out += '\ufffd';
        break;
      }
      if (byte < lower || byte > upper) {
        // spec: emit U+FFFD and reprocess this byte as a fresh lead byte
        flush();
        continue;
      }
      lower = 0x80;
      upper = 0xbf;
      cp = (cp << 6) | (byte & 0x3f);
      if (++seen === needed) {
        // inlined: fromCodePoint(cp) -- a surrogate pair above the BMP
        if (cp <= 0xffff) {
          out += String.fromCharCode(cp);
        } else {
          const offset = cp - 0x10000;
          out += String.fromCharCode(0xd800 + (offset >> 10), 0xdc00 + (offset & 0x3ff));
        }
        needed = seen = cp = 0;
      }
      break;
    }
  }
  flush();
  return out;
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
    // inlined: decode(name), decode(value) -- only escaped text reaches decodePercent
    let name = equalsAt > -1 ? chunk.substring(0, equalsAt) : chunk;
    if (name.indexOf('+') !== -1) name = name.replace(/\+/g, ' ');
    if (name.indexOf('%') !== -1) name = decodePercent(name);
    let value = '';
    if (equalsAt > -1) {
      value = chunk.substring(equalsAt + 1);
      if (value.indexOf('+') !== -1) value = value.replace(/\+/g, ' ');
      if (value.indexOf('%') !== -1) value = decodePercent(value);
    }
    pairs.push([name, value]); // a bare key with no '=' gets an empty value
  }
  return pairs;
};

// One reused descriptor per island: no allocation per construction.
const SLOT: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: true };

export const URLSearchParams = function (
  this: any,
  search?: string | Record<string, string> | [string, string][]
) {
  // Non-enumerable, like a native slot.
  // inlined: slot(this, '_pairs', ...)
  SLOT.value = [];
  Object.defineProperty(this, '_pairs', SLOT);
  SLOT.value = undefined; // never pin the last value

  if (search === null || search === undefined || search === '') {
    return;
  }

  if (typeof search === 'string') {
    this._pairs = parseString(search);
    return;
  }

  // Another URLSearchParams (this polyfill): copy its list. Its state is
  // non-enumerable, so the record branch below would copy nothing.
  if (search instanceof (URLSearchParams as any)) {
    const source = (search as any)._pairs;
    for (let i = 0; i < source.length; i++) {
      this._pairs.push([source[i][0], source[i][1]]);
    }
    return;
  }

  // Any other iterable (spec: an object with @@iterator is a sequence of
  // pairs) -- a native URLSearchParams, a Map, a generator. Each pair must be
  // exactly two items.
  const iteratorKey = typeof Symbol !== 'undefined' ? (Symbol as any).iterator : undefined;
  if (iteratorKey && !Array.isArray(search) && typeof (search as any)[iteratorKey] === 'function') {
    const iterator = (search as any)[iteratorKey]();
    for (let step = iterator.next(); !step.done; step = iterator.next()) {
      const entry = step.value;
      if (entry === null || typeof entry !== 'object' || Math.floor(+entry.length) !== 2 /* inlined: toLength; only 2 passes */) {
        throw new TypeError(
          "Failed to construct 'URLSearchParams': Each sequence element must contain exactly two items"
        );
      }
      this._pairs.push([String(entry[0]), String(entry[1])]);
    }
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

Object.defineProperty(URLSearchParams.prototype, 'toString', {
  writable: true, enumerable: false, configurable: true,
  value: function (): string {
    // inlined: encode(name), encode(value) -- built as one string
    let out = '';
    for (let i = 0; i < this._pairs.length; i++) {
      if (i > 0) out += '&';
      out +=
        encodeURIComponent(this._pairs[i][0]).replace(/%20/g, '+') + '=' +
        encodeURIComponent(this._pairs[i][1]).replace(/%20/g, '+');
    }
    return out;
  },
});

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

// Self-installs on import: other islands capture this constructor at module scope.
export const install = (): void => {
  define(window, 'URLSearchParams', URLSearchParams);
};
