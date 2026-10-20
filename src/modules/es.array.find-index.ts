export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.findIndex === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.findindex */

export const arrayFindIndex = function <T>(
  this: ArrayLike<T>,
  predicate: (value: T, index: number, array: any) => boolean,
  thisArg?: any
): number {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.findIndex called on null or undefined');
  }
  if (typeof predicate !== 'function') {
    throw new TypeError('predicate must be a function');
  }
  // box it so strings / array-likes behave like real arrays
  const object = Object(this);
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  for (let i = 0; i < length; i++) {
    // note: hits holes too (predicate sees undefined), unlike forEach
    if (predicate.call(thisArg, object[i], i, object)) {
      return i;
    }
  }
  return -1;
};

