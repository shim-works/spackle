export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.reduceRight === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.reduceright */

export const arrayReduceRight = function (this: any, callback: any, initialValue?: any): any {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.reduceRight called on null or undefined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('callback is not a function');
  }
  const object = Object(this);
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  let accumulator: any;
  let index = length - 1;
  if (arguments.length > 1) {
    accumulator = initialValue;
  } else {
    // no seed — the last present element becomes the accumulator
    let found = false;
    while (index >= 0) {
      if (index in object) {
        accumulator = object[index--];
        found = true;
        break;
      }
      index--;
    }
    if (!found) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
  }
  for (; index >= 0; index--) {
    if (index in object) {
      accumulator = callback(accumulator, object[index], index, object);
    }
  }
  return accumulator;
};

