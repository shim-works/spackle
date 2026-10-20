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

export const arrayIncludes = function (
  this: any[],
  searchElement: any,
  fromIndex?: number,
): boolean {
  // inlined: toLength(this.length) -- NaN and negatives become 0, fractions
  // are floored, clamped to 2^53 - 1
  let length = +this.length;
  length = length !== length || length <= 0 ? 0 : length > MAX_SAFE_LENGTH ? MAX_SAFE_LENGTH : floor(length);
  if (length === 0) {
    return false;
  }

  // ToInteger(fromIndex): NaN -> 0; otherwise truncate toward zero.
  let position = 0;
  if (fromIndex !== undefined) {
    position = +(fromIndex as any); // +x, not Number(x)
  }
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
    const element = this[i];
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

