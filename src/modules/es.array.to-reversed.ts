// Ported from: the prior implementation (array-to-reversed.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.toReversed === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.toreversed
 * Inspired by: es-shims array.prototype.toreversed (lean ES5 rewrite)
 */

// ToLength: clamp a .length value to a valid array length [0, 2^53 - 1].
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

export const arrayToReversed = function <T>(this: ArrayLike<T>): T[] {
  // box it so strings / array-likes behave like real arrays
  const object = Object(this);
  const length = toLength(object.length);
  const result: T[] = new Array(length);
  // copy back-to-front into the fresh array, original stays put
  for (let i = 0; i < length; i++) {
    result[i] = object[length - 1 - i];
  }
  return result;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'toReversed', { value: arrayToReversed as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.toReversed, 'name', { value: 'toReversed', configurable: true });
  Object.defineProperty((Array.prototype.toReversed as any), '__polyfilled', { value: true });
}
