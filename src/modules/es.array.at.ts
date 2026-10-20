export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.at === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.at */
const MAX_SAFE_LENGTH = 9007199254740991; // 2^53 - 1
const min = Math.min;
const ceil = Math.ceil;
const floor = Math.floor;

export const arrayAt = function <T>(this: ArrayLike<T>, index: number): T | undefined {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.at called on null or undefined');
  }
  // box it so strings / array-likes behave like real arrays
  const object: any = Object(this);

  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length === 0 ? 0 : length < 0 ? ceil(length) : floor(length);
  length = length > 0 ? min(length, MAX_SAFE_LENGTH) : 0;

  // inlined: toIntegerOrInfinity(index)
  let k = +index;
  k = k !== k || k === 0 ? 0 : k < 0 ? ceil(k) : floor(k);

  // negative index? walk back from the end
  if (k < 0) k = length + k;
  if (k < 0 || k >= length) {
    return undefined;
  }
  return object[k];
};
