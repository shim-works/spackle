export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.indexOf === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.indexof */

export const arrayIndexOf = function (this: any, searchElement: any, fromIndex?: any): number {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.indexOf called on null or undefined');
  }
  const object = Object(this);
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  if (length === 0) {
    return -1;
  }
  // inlined: toInteger(fromIndex)
  let start = +fromIndex;
  start = start !== start ? 0 : start < 0 ? Math.ceil(start) : Math.floor(start);
  if (start >= length) {
    return -1;
  }
  if (start < 0) {
    start = Math.max(length + start, 0);
  }
  for (let i = start; i < length; i++) {
    // strict equality, holes skipped — NaN is never found, matching native
    if (i in object && object[i] === searchElement) {
      return i;
    }
  }
  return -1;
};

