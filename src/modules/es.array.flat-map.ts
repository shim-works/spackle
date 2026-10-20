// Array.prototype.flatMap: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.flatMap === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.flatmap */

// the genuine native Array.isArray, captured before any polyfill could install
const nativeIsArray = Array.isArray;

export const arrayFlatMap = function <T, U>(
  this: T[],
  callback: (value: T, index: number, array: T[]) => U | U[],
  thisArg?: any,
): U[] {
  if (typeof callback !== 'function') {
    throw new TypeError('Array.prototype.flatMap: callback must be a function');
  }

  // inlined: toLength(this.length)
  let length = +this.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
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

