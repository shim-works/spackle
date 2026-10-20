export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.filter === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.filter
 *
 * Known limitations:
 * - [scope] gated existence-only: the native stays in place on engines that
 *   merely lack Symbol.species awareness — swapping a hot method for that
 *   delta would cost more than it buys.
 */

export const arrayFilter = function (this: any, callback: any, thisArg?: any): any[] {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.filter called on null or undefined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('callback is not a function');
  }
  const object = Object(this);
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  // inlined: speciesCreate(object, 0)
  let result: any;
  if (!Array.isArray(object)) {
    result = new Array(0);
  } else {
    let ctor: any = object.constructor;
    if (typeof Symbol !== 'undefined' && (Symbol as any).species && ctor != null) {
      const species = ctor[(Symbol as any).species];
      ctor = species == null ? undefined : species;
    }
    if (ctor === undefined || ctor === Array) {
      result = new Array(0);
    } else {
      if (typeof ctor !== 'function') throw new TypeError('constructor property is not a constructor');
      result = new ctor(0);
    }
  }
  let out = 0;
  for (let i = 0; i < length; i++) {
    if (i in object) {
      const value = object[i];
      if (callback.call(thisArg, value, i, object)) {
        result[out++] = value;
      }
    }
  }
  return result;
};

