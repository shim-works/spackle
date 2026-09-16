// Ported from: the prior implementation (array-reduce.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.reduce === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.reduce
 */

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

export const arrayReduce = function (this: any, callback: any, initialValue?: any): any {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.reduce called on null or undefined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('callback is not a function');
  }
  const object = Object(this);
  const length = toLength(object.length);
  let accumulator: any;
  let index = 0;
  if (arguments.length > 1) {
    accumulator = initialValue;
  } else {
    // no seed — the first present element becomes the accumulator
    let found = false;
    while (index < length) {
      if (index in object) {
        accumulator = object[index++];
        found = true;
        break;
      }
      index++;
    }
    if (!found) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
  }
  for (; index < length; index++) {
    if (index in object) {
      accumulator = callback(accumulator, object[index], index, object);
    }
  }
  return accumulator;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'reduce', { value: arrayReduce as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.reduce, 'name', { value: 'reduce', configurable: true });
  Object.defineProperty((Array.prototype.reduce as any), '__polyfilled', { value: true });
}
