export const isSupported = (): boolean => {
  try {
    if (typeof Array.prototype.slice !== 'function') return false;
    // ToLength, not ToUint32 (Chrome < 45): a 32-bit native reads this length
    // as 1 and answers at once, where on a huge real length it would walk ~2^32
    // indices (the Chrome 38 hang / OOM)
    const o: any = { length: 4294967297, 4294967296: 'x' };
    const r = (Array.prototype.slice as any).call(o, 4294967296);
    return r.length === 1 && r[0] === 'x';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.slice
 *
 * Known limitations:
 * - [scope] gated on ToLength only: a native that applies ToLength stays in place on engines that
 *   merely lack Symbol.species awareness.
 */

// One descriptor for CreateDataPropertyOrThrow, reused by every call; value is
// cleared after each run so it never pins an element.
const dataDesc: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };
// CreateDataPropertyOrThrow, the fast way when it is the same thing: on an array
// this call created, with nothing at that index up the prototype chain, a plain
// write cannot hit a setter or a read-only slot. Anything else (a @@species or
// `this` constructor's object, an index defined on Array.prototype) goes through
// defineProperty, as the spec requires. core-js always pays for defineProperty.
const ArrayProto = Array.prototype;

export const arraySlice = function slice(this: any, start?: any, end?: any): any[] {
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
  // inlined: ArraySpeciesCreate(object, count)
  let result: any;
  let plain = true; // false once a @@species constructor builds the result
  if (!Array.isArray(object)) {
    result = new Array(count);
  } else {
    let ctor: any = object.constructor;
    if (ctor !== null && (typeof ctor === 'object' || typeof ctor === 'function')) {
      if (typeof Symbol !== 'undefined' && (Symbol as any).species) {
        ctor = ctor[(Symbol as any).species];
        if (ctor === null) ctor = undefined;
      }
    } else if (ctor !== undefined) {
      throw new TypeError('Array.prototype.slice: constructor is not an object');
    }
    if (ctor === undefined || ctor === Array) {
      result = new Array(count);
    } else {
      if (typeof ctor !== 'function') throw new TypeError('Array.prototype.slice: @@species is not a constructor');
      result = new ctor(count);
      plain = false;
    }
  }
  let out = 0;
  for (let i = from; i < to; i++) {
    // holes stay holes in the copy
    if (i in object) {
      if (plain && !(out in ArrayProto)) result[out] = object[i];
      else {
        dataDesc.value = object[i];
        Object.defineProperty(result, out, dataDesc);
      }
    }
    out++;
  }
  dataDesc.value = undefined;
  result.length = count;
  return result;
};

