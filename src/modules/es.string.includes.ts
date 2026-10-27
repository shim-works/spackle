// String.prototype.includes: existence-only (no half-broken native in range).
// core-js's correctIsRegExpLogic: the native must reject a RegExp, yet accept
// one whose @@match is false, because IsRegExp reads @@match. Chrome 41 and
// Safari 9 have no Symbol.match of their own, so they reject both and are
// replaced.
export const isSupported = (): boolean => {
  try {
    if (typeof String.prototype.includes !== 'function') return false;
    const matchKey = typeof Symbol !== 'undefined' ? (Symbol as any).match : undefined;
    if (!matchKey) return true; // nothing for IsRegExp to read
    const regexp: any = /./;
    try {
      ('/./' as any).includes(regexp);
      return false;
    } catch (e) {
      /* a RegExp is refused, as it should be */
    }
    regexp[matchKey] = false;
    return ('/./' as any).includes(regexp) === true;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.includes */
// IsRegExp: @@match decides when present, else the RegExp brand (not instanceof).
const objectToString = Object.prototype.toString;

// Declared (searchString) for the spec length of 1; the position comes from arguments.
export const stringIncludes = function includes(this: any, search: any): boolean {
  const start = arguments.length > 1 ? arguments[1] : undefined;
  // RequireObjectCoercible + ToString(this) first: `this` can be any value.
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.includes called on null or undefined');
  }
  // inlined: toStr(this) -- String(symbol) returns "Symbol(...)"; the spec throws
  if (typeof this === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const s = typeof this === 'string' ? this : String(this);
  // the spec explicitly rejects a regex here — includes is for plain strings
  // inlined: isRegExp(search) -- primitives skip straight past
  let isRegExpValue = false;
  if (search !== null && (typeof search === 'object' || typeof search === 'function')) {
    const matchKey = typeof Symbol !== 'undefined' ? (Symbol as any).match : undefined;
    const matcher = matchKey ? search[matchKey] : undefined;
    isRegExpValue = matcher !== undefined ? !!matcher : objectToString.call(search) === '[object RegExp]';
  }
  if (isRegExpValue) {
    throw new TypeError(
      'First argument to String.prototype.includes must not be a regular expression',
    );
  }
  // inlined: toStr(search)
  if (typeof search === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return s.indexOf(typeof search === 'string' ? search : String(search), start) !== -1;
};

