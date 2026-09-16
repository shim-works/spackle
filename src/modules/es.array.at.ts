// Ported from: the prior implementation (array-at.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.at === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.at
 */
const MAX_SAFE_LENGTH = 9007199254740991; // 2^53 - 1

// clamp whatever .length gives us into a sane 0..MAX integer
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

// turn the index arg into a whole number, rounding toward zero
const toInteger = (value: any): number => {
  const numeric = Number(value);
  if (isNaN(numeric)) {
    return 0;
  }
  if (numeric === Infinity || numeric === -Infinity) {
    return numeric;
  }
  if (numeric < 0) {
    return Math.ceil(numeric);
  }
  return Math.floor(numeric);
};

export const arrayAt = function <T>(this: ArrayLike<T>, index: number): T | undefined {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.at called on null or undefined');
  }
  // box it so strings / array-likes behave like real arrays
  const object = Object(this);
  const length = toLength(object.length);
  const relativeIndex = toInteger(index);
  // negative index? walk back from the end
  let actualIndex = relativeIndex;
  if (relativeIndex < 0) {
    actualIndex = length + relativeIndex;
  }
  if (actualIndex < 0 || actualIndex >= length) {
    return undefined;
  }
  return object[actualIndex];
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'at', { value: arrayAt as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.at, 'name', { value: 'at', configurable: true });
  Object.defineProperty((Array.prototype.at as any), '__polyfilled', { value: true });
}
