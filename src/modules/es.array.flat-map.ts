// Ported from: the prior implementation (array-flat-map.ts + is-array-flat-map-supported.ts)

// Array.prototype.flatMap — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken flatMap, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.flatMap === 'function';
  } catch {
    return false;
  }
};

export const isArrayFlatMapSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.flatmap
 */

// the genuine native Array.isArray, captured before any polyfill could install
const nativeIsArray = Array.isArray;

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

export const arrayFlatMap = function <T, U>(
  this: T[],
  callback: (value: T, index: number, array: T[]) => U | U[],
  thisArg?: any,
): U[] {
  if (typeof callback !== 'function') {
    throw new TypeError('Array.prototype.flatMap: callback must be a function');
  }

  const length = toLength(this.length);
  const result: U[] = [];
  for (let i = 0; i < length; i++) {
    // Skip holes in the source — like map, the callback is not invoked.
    if (!(i in this)) {
      continue;
    }

    // run the callback, then see if it handed us back an array to flatten
    const mapped = callback.call(thisArg, this[i], i, this);
    if (nativeIsArray(mapped)) {
      // Flatten one level, skipping holes in the returned array.
      for (let j = 0, mappedLength = mapped.length; j < mappedLength; j++) {
        if (j in mapped) {
          result[result.length] = mapped[j];
        }
      }
    } else {
      result[result.length] = mapped as U;
    }
  }
  return result;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'flatMap', { value: arrayFlatMap as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.flatMap, 'name', { value: 'flatMap', configurable: true });
  Object.defineProperty((Array.prototype.flatMap as any), '__polyfilled', { value: true });
}
