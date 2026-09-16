// Ported from: the prior implementation (array-with.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.with === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.with
 * Inspired by: es-shims array.prototype.with (lean ES5 rewrite)
 */

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

// ToIntegerOrInfinity: NaN -> 0; infinities preserved; else truncate to zero.
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

export const arrayWith = function <T>(this: ArrayLike<T>, index: number, value: T): T[] {
  // box it so strings / array-likes behave like real arrays
  const object = Object(this);
  const length = toLength(object.length);
  // negative index counts from the end
  const relativeIndex = toInteger(index);
  let actualIndex = relativeIndex;
  if (relativeIndex < 0) {
    actualIndex = length + relativeIndex;
  }
  if (actualIndex < 0 || actualIndex >= length) {
    throw new RangeError('Invalid index : ' + index);
  }
  const result: T[] = new Array(length);
  // copy everything, swapping in the new value at the one spot
  for (let i = 0; i < length; i++) {
    if (i === actualIndex) {
      result[i] = value;
    } else {
      result[i] = object[i];
    }
  }
  return result;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'with', { value: arrayWith as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.with, 'name', { value: 'with', configurable: true });
  Object.defineProperty((Array.prototype.with as any), '__polyfilled', { value: true });
}
