export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.slice === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.slice
 *
 * Known limitations:
 * - [scope] gated existence-only: the native stays in place on engines that
 *   merely lack Symbol.species awareness.
 */

export const arraySlice = function (this: any, start?: any, end?: any): any[] {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.slice called on null or undefined');
  }
  const object = Object(this);
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  // inlined: toInteger(start)
  let from = +start;
  from = from !== from ? 0 : from < 0 ? Math.ceil(from) : Math.floor(from);
  from = from < 0 ? Math.max(length + from, 0) : Math.min(from, length);
  let to = length;
  if (end !== undefined) {
    // inlined: toInteger(end)
    to = +end;
    to = to !== to ? 0 : to < 0 ? Math.ceil(to) : Math.floor(to);
  }
  to = to < 0 ? Math.max(length + to, 0) : Math.min(to, length);
  const count = Math.max(to - from, 0);
  // inlined: speciesCreate(object, count)
  let result: any;
  if (!Array.isArray(object)) {
    result = new Array(count);
  } else {
    let ctor: any = object.constructor;
    if (typeof Symbol !== 'undefined' && (Symbol as any).species && ctor != null) {
      const species = ctor[(Symbol as any).species];
      ctor = species == null ? undefined : species;
    }
    if (ctor === undefined || ctor === Array) {
      result = new Array(count);
    } else {
      if (typeof ctor !== 'function') throw new TypeError('constructor property is not a constructor');
      result = new ctor(count);
    }
  }
  let out = 0;
  for (let i = from; i < to; i++) {
    // holes stay holes in the copy
    if (i in object) {
      result[out] = object[i];
    }
    out++;
  }
  result.length = count;
  return result;
};

