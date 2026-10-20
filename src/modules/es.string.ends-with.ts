// String.prototype.endsWith: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.endsWith === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.endswith */

// IsRegExp: @@match decides when present, else the RegExp brand (not instanceof).
const objectToString = Object.prototype.toString;

export const stringEndsWith = function (
  this: string,
  search: any,
  endPosition?: number,
): boolean {
  // RequireObjectCoercible + ToString(this) first: `this` can be any value.
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.endsWith called on null or undefined');
  }
  const s = typeof this === 'string' ? this : String(this); // String() is a call Chrome 41 won't inline; skip it on the primitive path
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

  const searchString = String(search);
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

