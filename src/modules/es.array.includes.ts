// Ported from: the prior implementation (array-includes.ts + is-array-includes-supported.ts)

// Array.prototype.includes — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken includes, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.includes === 'function';
  } catch {
    return false;
  }
};

export const isArrayIncludesSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.includes
 */

// ToLength: clamp a .length value to a valid array length [0, 2^53 - 1].
// Non-numbers and NaN become 0; negatives become 0; fractions are floored.
const MAX_SAFE_LENGTH = 9007199254740991; // 2^53 - 1
const toLength = (value: any): number => {
  const numeric = Number(value);
  if (isNaN(numeric) || numeric <= 0) {
    return 0;
  }
  if (numeric > MAX_SAFE_LENGTH) {
    return MAX_SAFE_LENGTH;
  }
  return Math.floor(numeric);
};

export const arrayIncludes = function (
  this: any[],
  searchElement: any,
  fromIndex?: number,
): boolean {
  const length = toLength(this.length);
  if (length === 0) {
    return false;
  }

  // ToInteger(fromIndex): NaN -> 0; otherwise truncate toward zero.
  let position = 0;
  if (fromIndex !== undefined) {
    position = Number(fromIndex);
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

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'includes', { value: arrayIncludes as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.includes, 'name', { value: 'includes', configurable: true });
  Object.defineProperty((Array.prototype.includes as any), '__polyfilled', { value: true });
}
