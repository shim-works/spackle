// String.prototype.startsWith: existence-only (no half-broken native in range).
// core-js's correctIsRegExpLogic: the native must reject a RegExp, yet accept
// one whose @@match is false, because IsRegExp reads @@match. Chrome 41 and
// Safari 9 have no Symbol.match of their own, so they reject both and are
// replaced.
export const isSupported = (): boolean => {
  try {
    if (typeof String.prototype.startsWith !== 'function') return false;
    const matchKey = typeof Symbol !== 'undefined' ? (Symbol as any).match : undefined;
    if (!matchKey) return true; // nothing for IsRegExp to read
    const regexp: any = /./;
    try {
      ('/./' as any).startsWith(regexp);
      return false;
    } catch (e) {
      /* a RegExp is refused, as it should be */
    }
    regexp[matchKey] = false;
    return ('/./' as any).startsWith(regexp) === true;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.startswith */

// IsRegExp: @@match decides when present, else the RegExp brand (not instanceof).
const objectToString = Object.prototype.toString;

// Declared (searchString) for the spec length of 1; the position comes from arguments.
export const stringStartsWith = function startsWith(this: any, search: any): boolean {
  const start = arguments.length > 1 ? arguments[1] : undefined;
  // RequireObjectCoercible + ToString(this) first: `this` can be any value
  // (`String.prototype.startsWith.call(12345, '12')`), not only a string.
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.startsWith called on null or undefined');
  }
  // inlined: toStr(this) -- String(symbol) returns "Symbol(...)"; the spec throws
  if (typeof this === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const s = typeof this === 'string' ? this : String(this);
  // inlined: isRegExp(search) -- primitives skip straight past
  let isRegExpValue = false;
  if (search !== null && (typeof search === 'object' || typeof search === 'function')) {
    const matchKey = typeof Symbol !== 'undefined' ? (Symbol as any).match : undefined;
    const matcher = matchKey ? search[matchKey] : undefined;
    isRegExpValue = matcher !== undefined ? !!matcher : objectToString.call(search) === '[object RegExp]';
  }
  if (isRegExpValue) {
    throw new TypeError(
      'First argument to String.prototype.startsWith must not be a regular expression',
    );
  }

  // inlined: toStr(search)
  if (typeof search === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const searchString = typeof search === 'string' ? search : String(search);
  let position = 0;
  if (start !== undefined) {
    // inlined: toInteger(start)
    position = +start;
    position = position !== position ? 0 : position < 0 ? Math.ceil(position) : Math.floor(position);
  }
  if (position < 0) {
    position = 0;
  } else if (position > s.length) {
    position = s.length;
  }
  if (position + searchString.length > s.length) {
    return false;
  }

  for (let i = 0; i < searchString.length; i++) {
    if (s.charCodeAt(position + i) !== searchString.charCodeAt(i)) {
      return false;
    }
  }
  return true;
};

