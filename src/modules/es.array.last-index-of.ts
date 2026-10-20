export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.lastIndexOf === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.lastindexof */

export const arrayLastIndexOf = function (this: any, searchElement: any): number {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.lastIndexOf called on null or undefined');
  }
  const object = Object(this);
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  if (length === 0) {
    return -1;
  }
  let start = length - 1;
  if (arguments.length > 1) {
    // inlined: toInteger(arguments[1])
    start = +arguments[1];
    start = start !== start ? 0 : start < 0 ? Math.ceil(start) : Math.floor(start);
  }
  if (start >= 0) {
    start = Math.min(start, length - 1);
  } else {
    start = length + start;
  }
  for (let i = start; i >= 0; i--) {
    // strict equality, holes skipped — NaN is never found, matching native
    if (i in object && object[i] === searchElement) {
      return i;
    }
  }
  return -1;
};

