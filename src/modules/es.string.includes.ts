// String.prototype.includes: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.includes === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.includes */
// IsRegExp: @@match decides when present, else the RegExp brand (not instanceof).
const objectToString = Object.prototype.toString;

export const stringIncludes = function (
  this: string,
  search: any,
  start?: number,
): boolean {
  // RequireObjectCoercible + ToString(this) first: `this` can be any value.
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.includes called on null or undefined');
  }
  const s = typeof this === 'string' ? this : String(this); // String() is a call Chrome 41 won't inline; skip it on the primitive path
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
  return s.indexOf(String(search), start) !== -1;
};

