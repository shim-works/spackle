// String.prototype.startsWith: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.startsWith === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.startswith */

// IsRegExp: @@match decides when present, else the RegExp brand (not instanceof).
const objectToString = Object.prototype.toString;

export const stringStartsWith = function (
  this: string,
  search: any,
  start?: number,
): boolean {
  // RequireObjectCoercible + ToString(this) first: `this` can be any value
  // (`String.prototype.startsWith.call(12345, '12')`), not only a string.
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.startsWith called on null or undefined');
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
      'First argument to String.prototype.startsWith must not be a regular expression',
    );
  }

  const searchString = String(search);
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

