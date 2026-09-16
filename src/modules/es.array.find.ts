// Ported from: the prior implementation (array-find.ts + is-array-find-supported.ts)

// Array.prototype.find — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken find, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.find === 'function';
  } catch {
    return false;
  }
};

export const isArrayFindSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.find
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

export const arrayFind = function <T>(
  this: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
  thisArg?: any,
): T | undefined {
  if (typeof predicate !== 'function') {
    throw new TypeError('Array.prototype.find: predicate must be a function');
  }

  // Capture length once: elements appended during iteration are not visited.
  const length = toLength(this.length);
  for (let i = 0; i < length; i++) {
    const value = this[i];
    if (predicate.call(thisArg, value, i, this)) {
      return value;
    }
  }
  return undefined;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'find', { value: arrayFind as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.find, 'name', { value: 'find', configurable: true });
  Object.defineProperty((Array.prototype.find as any), '__polyfilled', { value: true });
}
