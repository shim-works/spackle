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

export const arrayWith = function <T>(this: ArrayLike<T>, index: number, value: T): T[] {
  // box it so strings / array-likes behave like real arrays
  const object = Object(this);
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  // negative index counts from the end
  // inlined: toInteger(index)
  let relativeIndex = +index;
  relativeIndex = relativeIndex !== relativeIndex ? 0 : relativeIndex < 0 ? Math.ceil(relativeIndex) : Math.floor(relativeIndex);
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

