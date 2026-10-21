// Array.prototype.includes: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.includes === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.includes */

// 2^53 - 1: the largest valid array length.
const MAX_SAFE_LENGTH = 9007199254740991;
const floor = Math.floor;

// Declared (searchElement) only, for the spec length of 1; fromIndex comes from arguments.
export const arrayIncludes = function includes(this: any, searchElement: any): boolean {
  // inlined: ToObject(this)
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.includes called on null or undefined');
  }
  const O = Object(this);
  // inlined: toLength(O.length) -- NaN and negatives become 0, fractions
  // are floored, clamped to 2^53 - 1
  let length = +O.length;
  length = length !== length || length <= 0 ? 0 : length > MAX_SAFE_LENGTH ? MAX_SAFE_LENGTH : floor(length);
  if (length === 0) {
    return false;
  }

  // ToIntegerOrInfinity(fromIndex): NaN -> 0; otherwise truncate toward zero.
  let position = arguments.length > 1 ? +arguments[1] : 0; // +x, not Number(x)
  if (position !== position) {
    // NaN, so reset to the start
    position = 0;
  }
  if (position >= 0) {
    position = Math.floor(position);
  } else {
    position = Math.ceil(position);
  }

  // A negative start counts from the end and clamps to 0.
  let start = position;
  if (position < 0) {
    start = length + position;
  }
  if (start < 0) {
    start = 0;
  }

  for (let i = start; i < length; i++) {
    const element = O[i];
    if (
      element === searchElement ||
      // SameValueZero: NaN matches NaN.
      (element !== element && searchElement !== searchElement)
    ) {
      return true;
    }
  }
  return false;
};
