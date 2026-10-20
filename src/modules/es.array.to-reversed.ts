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

export const arrayToReversed = function <T>(this: ArrayLike<T>): T[] {
  // box it so strings / array-likes behave like real arrays
  const object = Object(this);
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  const result: T[] = new Array(length);
  // copy back-to-front into the fresh array, original stays put
  for (let i = 0; i < length; i++) {
    result[i] = object[length - 1 - i];
  }
  return result;
};

