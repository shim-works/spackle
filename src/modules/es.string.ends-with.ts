// String.prototype.endsWith: existence-only (no half-broken native in range).
// core-js's correctIsRegExpLogic: the native must reject a RegExp, yet accept
// one whose @@match is false, because IsRegExp reads @@match. Chrome 41 and
// Safari 9 have no Symbol.match of their own, so they reject both and are
// replaced.
export const isSupported = (): boolean => {
  try {
    if (typeof String.prototype.endsWith !== 'function') return false;
    const matchKey = typeof Symbol !== 'undefined' ? (Symbol as any).match : undefined;
    if (!matchKey) return true; // nothing for IsRegExp to read
    const regexp: any = /./;
    try {
      ('/./' as any).endsWith(regexp);
      return false;
    } catch (e) {
      /* a RegExp is refused, as it should be */
    }
    regexp[matchKey] = false;
    return ('/./' as any).endsWith(regexp) === true;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.endswith */

// IsRegExp: @@match decides when present, else the RegExp brand (not instanceof).
// ToString: String(symbol) returns "Symbol(...)"; the spec throws a TypeError.
const toStr = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return typeof value === 'string' ? value : String(value);
};

const objectToString = Object.prototype.toString;

// Declared (searchString) for the spec length of 1; the position comes from arguments.
export const stringEndsWith = function endsWith(this: any, search: any): boolean {
  const endPosition = arguments.length > 1 ? arguments[1] : undefined;
  // RequireObjectCoercible + ToString(this) first: `this` can be any value.
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.endsWith called on null or undefined');
  }
  const s = toStr(this);
  // inlined: isRegExp(search) -- primitives skip straight past
  let isRegExpValue = false;
  if (search !== null && (typeof search === 'object' || typeof search === 'function')) {
    const matchKey = typeof Symbol !== 'undefined' ? (Symbol as any).match : undefined;
    const matcher = matchKey ? search[matchKey] : undefined;
    isRegExpValue = matcher !== undefined ? !!matcher : objectToString.call(search) === '[object RegExp]';
  }
  if (isRegExpValue) {
    throw new TypeError(
      'First argument to String.prototype.endsWith must not be a regular expression',
    );
  }

  const searchString = toStr(search);
  const length = s.length;
  let endIndex = length;
  if (endPosition !== undefined) {
    // inlined: toInteger(endPosition)
    endIndex = +endPosition;
    endIndex = endIndex !== endIndex ? 0 : endIndex < 0 ? Math.ceil(endIndex) : Math.floor(endIndex);
  }
  if (endIndex < 0) {
    endIndex = 0;
  } else if (endIndex > length) {
    endIndex = length;
  }

  const startIndex = endIndex - searchString.length;
  if (startIndex < 0) {
    return false;
  }

  for (let i = 0; i < searchString.length; i++) {
    if (s.charCodeAt(startIndex + i) !== searchString.charCodeAt(i)) {
      return false;
    }
  }
  return true;
};

