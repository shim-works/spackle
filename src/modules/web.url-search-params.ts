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
 * Arguments go through WebIDL's conversions: USVString (lone surrogates become
 * U+FFFD), sequence<sequence<USVString>> for iterables, record<USVString,
 * USVString> for other objects.
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
const hasOwn = Object.prototype.hasOwnProperty;
const isEnumerable = Object.prototype.propertyIsEnumerable;
const iteratorKey: any = typeof Symbol !== 'undefined' ? (Symbol as any).iterator : undefined;

// WebIDL USVString: ToString (a Symbol throws), then lone surrogates -> U+FFFD.
const toUSVString = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const str = typeof value === 'string' ? value : String(value);
  let out: string | null = null;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdfff) {
      const next = i + 1 < str.length ? str.charCodeAt(i + 1) : 0;
      if (c <= 0xdbff && next >= 0xdc00 && next <= 0xdfff) {
        if (out !== null) out += str.charAt(i) + str.charAt(i + 1);
        i++;
        continue;
      }
      if (out === null) out = str.substring(0, i);
      out += '�';
    } else if (out !== null) {
      out += str.charAt(i);
    }
  }
  return out === null ? str : out;
};

const requireParams = (self: any, method: string): void => {
  if (self === null || typeof self !== 'object' || !hasOwn.call(self, '_pairs')) {
    throw new TypeError("Failed to execute '" + method + "' on 'URLSearchParams': Illegal invocation");
  }
};
const requireArgs = (count: number, needed: number, method: string): void => {
  if (count < needed) {
    throw new TypeError("Failed to execute '" + method + "' on 'URLSearchParams': " + needed + ' argument' + (needed > 1 ? 's' : '') + ' required, but only ' + count + ' present.');
  }
};

// WebIDL sequence<USVString> for one init entry: the inner value's own
// iterator (arrays included), exactly two items.
const toPair = (entry: any): [string, string] => {
  if (entry === null || (typeof entry !== 'object' && typeof entry !== 'function')) {
    throw new TypeError("Failed to construct 'URLSearchParams': The provided value cannot be converted to a sequence.");
  }
  const items: any[] = [];
  const method = iteratorKey ? entry[iteratorKey] : undefined;
  if (typeof method === 'function') {
    const iterator = method.call(entry);
    const next = iterator.next;
    for (let step = next.call(iterator); !step.done; step = next.call(iterator)) items.push(step.value);
  } else if (!iteratorKey && typeof entry.length === 'number') {
    for (let i = 0; i < entry.length; i++) items.push(entry[i]);
  } else {
    throw new TypeError("Failed to construct 'URLSearchParams': The provided value cannot be converted to a sequence.");
  }
  if (items.length !== 2) {
    throw new TypeError("Failed to construct 'URLSearchParams': Each sequence element must contain exactly two items");
  }
  return [toUSVString(items[0]), toUSVString(items[1])];
};

export const URLSearchParams = function (this: any) {
  if (!(this instanceof (URLSearchParams as any))) {
    throw new TypeError("Failed to construct 'URLSearchParams': Please use the 'new' operator.");
  }
  // Non-enumerable, like a native slot.
  SLOT.value = [];
  Object.defineProperty(this, '_pairs', SLOT);
  SLOT.value = undefined; // never pin the last value

  const init = arguments.length > 0 ? arguments[0] : undefined;
  if (init === undefined || init === null) {
    if (init === null) this._pairs = parseString('null');
    return;
  }
  const pairs = this._pairs;

  if (typeof init === 'object' || typeof init === 'function') {
    // Another URLSearchParams from this module: copy its list.
    if (hasOwn.call(init, '_pairs') && init instanceof (URLSearchParams as any) && init[iteratorKey] === (URLSearchParams as any).prototype.entries) {
      const source = init._pairs;
      for (let i = 0; i < source.length; i++) pairs.push([source[i][0], source[i][1]]);
      return;
    }
    // sequence<sequence<USVString>>: any object with an @@iterator method
    const method = iteratorKey ? init[iteratorKey] : undefined;
    if (method !== undefined && method !== null) {
      if (typeof method !== 'function') throw new TypeError("Failed to construct 'URLSearchParams': @@iterator is not callable");
      const iterator = method.call(init);
      const next = iterator.next;
      for (let step = next.call(iterator); !step.done; step = next.call(iterator)) pairs.push(toPair(step.value));
      return;
    }
    if (!iteratorKey && Array.isArray(init)) {
      for (let i = 0; i < init.length; i++) pairs.push(toPair(init[i]));
      return;
    }
    // record<USVString, USVString>: own enumerable keys in order; a converted
    // key seen twice keeps its first position and takes the later value
    const keys = Object.getOwnPropertyNames(init);
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k];
      if (!isEnumerable.call(init, key)) continue;
      const name = toUSVString(key);
      const value = toUSVString(init[key]);
      let replaced = false;
      for (let i = 0; i < pairs.length; i++) {
        if (pairs[i][0] === name) {
          pairs[i][1] = value;
          replaced = true;
          break;
        }
      }
      if (!replaced) pairs.push([name, value]);
    }
    if (typeof Object.getOwnPropertySymbols === 'function') {
      const symbols = Object.getOwnPropertySymbols(init);
      for (let k = 0; k < symbols.length; k++) {
        // a Symbol key cannot become a USVString
        if (isEnumerable.call(init, symbols[k])) toUSVString(symbols[k]);
      }
    }
    return;
  }
  // USVString init: an optional leading '?' is dropped, then parsed
  this._pairs = parseString(toUSVString(init));
} as any;

const P: any = URLSearchParams.prototype;

P.append = function append(this: any, name: any, value: any): void {
  requireParams(this, 'append');
  requireArgs(arguments.length, 2, 'append');
  this._pairs.push([toUSVString(name), toUSVString(value)]);
  updateSteps(this);
};

P['delete'] = function (this: any, name: any): void {
  requireParams(this, 'delete');
  requireArgs(arguments.length, 1, 'delete');
  const key = toUSVString(name);
  const value = arguments.length > 1 && arguments[1] !== undefined ? toUSVString(arguments[1]) : undefined;
  const kept: [string, string][] = [];
  for (let i = 0; i < this._pairs.length; i++) {
    const pair = this._pairs[i];
    if (pair[0] !== key || (value !== undefined && pair[1] !== value)) kept.push(pair);
  }
  // in place, so a live iterator keeps walking the same list
  this._pairs.length = 0;
  for (let i = 0; i < kept.length; i++) this._pairs.push(kept[i]);
  updateSteps(this);
};

P.get = function get(this: any, name: any): string | null {
  requireParams(this, 'get');
  requireArgs(arguments.length, 1, 'get');
  const key = toUSVString(name);
  for (let i = 0; i < this._pairs.length; i++) {
    if (this._pairs[i][0] === key) return this._pairs[i][1];
  }
  return null;
};

P.getAll = function getAll(this: any, name: any): string[] {
  requireParams(this, 'getAll');
  requireArgs(arguments.length, 1, 'getAll');
  const key = toUSVString(name);
  const values: string[] = [];
  for (let i = 0; i < this._pairs.length; i++) {
    if (this._pairs[i][0] === key) values.push(this._pairs[i][1]);
  }
  return values;
};

P.has = function has(this: any, name: any): boolean {
  requireParams(this, 'has');
  requireArgs(arguments.length, 1, 'has');
  const key = toUSVString(name);
  const value = arguments.length > 1 && arguments[1] !== undefined ? toUSVString(arguments[1]) : undefined;
  for (let i = 0; i < this._pairs.length; i++) {
    if (this._pairs[i][0] === key && (value === undefined || this._pairs[i][1] === value)) return true;
  }
  return false;
};

P.set = function set(this: any, name: any, value: any): void {
  requireParams(this, 'set');
  requireArgs(arguments.length, 2, 'set');
  const key = toUSVString(name);
  const next = toUSVString(value);
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
  if (!replaced) kept.push([key, next]);
  this._pairs.length = 0;
  for (let i = 0; i < kept.length; i++) this._pairs.push(kept[i]);
  updateSteps(this);
};

// Stable sort by name, comparing UTF-16 code units (the spec's order).
P.sort = function sort(this: any): void {
  requireParams(this, 'sort');
  const list = this._pairs;
  for (let i = 1; i < list.length; i++) {
    const pair = list[i];
    let j = i - 1;
    while (j >= 0 && list[j][0] > pair[0]) {
      list[j + 1] = list[j];
      j--;
    }
    list[j + 1] = pair;
  }
  updateSteps(this);
};

// application/x-www-form-urlencoded serializer: everything but ASCII
// alphanumerics and *-._ is percent-encoded (UTF-8), and space becomes '+'.
const formEncode = (value: string): string =>
  encodeURIComponent(value)
    // \x27 is the apostrophe (a literal one confuses the ES5 bundle checker)
    .replace(/[!\x27()~]/g, function (c: string) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    })
    .replace(/%20/g, '+');

const serializePairs = (pairs: [string, string][]): string => {
  let out = '';
  for (let i = 0; i < pairs.length; i++) {
    if (i > 0) out += '&';
    out += formEncode(pairs[i][0]) + '=' + formEncode(pairs[i][1]);
  }
  return out;
};

/*
 * URLSearchParams update steps. web.url hangs its URL record on `_url` (a hidden
 * slot, set only on a URL's own params): every mutation writes the query back,
 * with an empty list meaning no query at all.
 */
const updateSteps = (self: any): void => {
  const record = self._url;
  if (record === undefined || record === null) return;
  const query = serializePairs(self._pairs);
  record.query = query === '' ? null : query;
  // potentially strip trailing spaces from an opaque path
  if (record.query === null && record.fragment === null && typeof record.path === 'string') {
    record.path = record.path.replace(/ +$/, '');
  }
};

Object.defineProperty(P, 'toString', {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function toString(this: any): string {
    requireParams(this, 'toString');
    return serializePairs(this._pairs);
  },
});

P.forEach = function forEach(this: any, callback: any): void {
  requireParams(this, 'forEach');
  requireArgs(arguments.length, 1, 'forEach');
  if (typeof callback !== 'function') {
    throw new TypeError("Failed to execute 'forEach' on 'URLSearchParams': The callback provided as parameter 1 is not a function.");
  }
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  // the list is live: entries added or removed during iteration are seen
  for (let i = 0; i < this._pairs.length; i++) {
    const pair = this._pairs[i];
    callback.call(thisArg, pair[1], pair[0], this);
  }
};

Object.defineProperty(P, 'size', {
  enumerable: true,
  configurable: true,
  get: function (this: any): number {
    requireParams(this, 'size');
    return this._pairs.length;
  },
});
try {
  Object.defineProperty(Object.getOwnPropertyDescriptor(P, 'size')!.get!, 'name', { value: 'get size', configurable: true });
} catch (e) { /* Function#name non-configurable pre-ES6 */ }

// WebIDL pair iterator: walks the live list by index.
const IteratorPrototype: any = (function () {
  try {
    return iteratorKey ? Object.getPrototypeOf(Object.getPrototypeOf(([] as any)[iteratorKey]())) : Object.prototype;
  } catch (e) {
    return Object.prototype;
  }
})();
const ParamsIteratorPrototype: any = Object.create(IteratorPrototype);
const ITER_SLOT: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: false };
Object.defineProperty(ParamsIteratorPrototype, 'next', {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function next(this: any): any {
    if (this === null || typeof this !== 'object' || !hasOwn.call(this, '_params')) {
      throw new TypeError("Failed to execute 'next' on 'URLSearchParams Iterator': Illegal invocation");
    }
    const params = this._params;
    if (params === null || this._index >= params._pairs.length) {
      this._params = null;
      return { value: undefined, done: true };
    }
    const pair = params._pairs[this._index++];
    const kind = this._kind;
    return { value: kind === 0 ? pair[0] : kind === 1 ? pair[1] : [pair[0], pair[1]], done: false };
  },
});
if (typeof Symbol !== 'undefined' && (Symbol as any).toStringTag) {
  Object.defineProperty(ParamsIteratorPrototype, (Symbol as any).toStringTag, { value: 'URLSearchParams Iterator', writable: false, enumerable: false, configurable: true });
}
// Iterable itself, so [...params.entries()] and Array.from(params.keys()) work.
// Chrome 38/41 have no %IteratorPrototype% to inherit this from (until
// _iterator-impl splices one in), so add it unless it is already inherited.
if (iteratorKey && typeof ParamsIteratorPrototype[iteratorKey] !== 'function') {
  Object.defineProperty(ParamsIteratorPrototype, iteratorKey, {
    value: function (this: any) {
      return this;
    },
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
const makeIterator = (params: any, kind: number): any => {
  const iterator = Object.create(ParamsIteratorPrototype);
  ITER_SLOT.value = params;
  Object.defineProperty(iterator, '_params', ITER_SLOT);
  ITER_SLOT.value = 0;
  Object.defineProperty(iterator, '_index', ITER_SLOT);
  ITER_SLOT.value = kind;
  Object.defineProperty(iterator, '_kind', ITER_SLOT);
  ITER_SLOT.value = undefined;
  return iterator;
};

P.keys = function keys(this: any): any {
  requireParams(this, 'keys');
  return makeIterator(this, 0);
};
P.values = function values(this: any): any {
  requireParams(this, 'values');
  return makeIterator(this, 1);
};
P.entries = function entries(this: any): any {
  requireParams(this, 'entries');
  return makeIterator(this, 2);
};
// spec names (the bundler may rename function expressions; delete is anonymous)
const paramMethods = ['append', 'delete', 'get', 'getAll', 'has', 'set', 'sort', 'toString', 'forEach', 'keys', 'values', 'entries'];
for (let i = 0; i < paramMethods.length; i++) {
  try {
    Object.defineProperty(P[paramMethods[i]], 'name', { value: paramMethods[i], configurable: true });
  } catch (e) { /* Function#name non-configurable pre-ES6 */ }
}

if (iteratorKey) {
  Object.defineProperty(P, iteratorKey, { value: P.entries, writable: true, enumerable: false, configurable: true });
}
if (typeof Symbol !== 'undefined' && (Symbol as any).toStringTag) {
  Object.defineProperty(P, (Symbol as any).toStringTag, { value: 'URLSearchParams', writable: false, enumerable: false, configurable: true });
}

// Self-installs on import: other islands capture this constructor at module scope.
export const install = (): void => {
  define(window, 'URLSearchParams', URLSearchParams);
};
