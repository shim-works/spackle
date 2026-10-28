export const isSupported = (): boolean => {
  try {
    if (typeof Array.prototype.splice !== 'function') return false;
    // @@species, decided like filter/map: a native Array[@@species] getter ships
    // with species-aware array methods (core-js arrayMethodHasSpeciesSupport)
    const species = typeof Symbol !== 'undefined' ? (Symbol as any).species : undefined;
    if (!species) return false;
    const speciesDescriptor = Object.getOwnPropertyDescriptor(Array, species);
    if (!speciesDescriptor || typeof speciesDescriptor.get !== 'function' || (speciesDescriptor.get as any).__polyfilled === true) return false;
    // ToLength, not ToUint32 (Chrome < 45). Length -1: ToLength reads 0 and
    // removes nothing; ToUint32 reads 2^32-1 and removes the one 'x'. Never a
    // walk, whatever the engine does with the length (see lastIndexOf).
    const o: any = { length: -1, 4294967294: 'x' };
    return (Array.prototype.splice as any).call(o, 4294967294, 1).length === 0;
  } catch {
    return false;
  }
};

// Safari < 13 lets a write to a read-only array length pass silently, even in
// strict code (core-js's array-set-length). Probed once; elsewhere this is false
// and the length write below costs nothing extra.
const SILENT_LENGTH_SET = (function () {
  try {
    (Object.defineProperty([], 'length', { writable: false }) as any).length = 1;
    return true;
  } catch (e) {
    return false;
  }
})();

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.splice
 */

// One descriptor for CreateDataPropertyOrThrow, reused by every call; value is
// cleared after each run so it never pins a removed element.
const dataDesc: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };
// CreateDataPropertyOrThrow, the fast way when it is the same thing: on an array
// this call created, with nothing at that index up the prototype chain, a plain
// write cannot hit a setter or a read-only slot. Anything else (a @@species or
// `this` constructor's object, an index defined on Array.prototype) goes through
// defineProperty, as the spec requires. core-js always pays for defineProperty.
const ArrayProto = Array.prototype;

// Declared (start, deleteCount) for the spec length of 2; arguments drives the logic.
export const arraySplice = function (this: any, _start?: any, _deleteCount?: any): any[] {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.splice called on null or undefined');
  }
  const object = Object(this);
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  const argCount = arguments.length;
  // inlined: toInteger(arguments[0]) -- an absent start coerces to 0 the same way
  let relativeStart = argCount > 0 ? +arguments[0] : 0;
  relativeStart = relativeStart !== relativeStart ? 0 : relativeStart < 0 ? Math.ceil(relativeStart) : Math.floor(relativeStart);
  const actualStart =
    relativeStart < 0 ? Math.max(length + relativeStart, 0) : Math.min(relativeStart, length);
  let insertCount: number;
  let actualDeleteCount: number;
  if (argCount === 0) {
    insertCount = 0;
    actualDeleteCount = 0;
  } else if (argCount === 1) {
    insertCount = 0;
    actualDeleteCount = length - actualStart;
  } else {
    insertCount = argCount - 2;
    // inlined: toInteger(arguments[1])
    let deleteCount = +arguments[1];
    deleteCount = deleteCount !== deleteCount ? 0 : deleteCount < 0 ? Math.ceil(deleteCount) : Math.floor(deleteCount);
    actualDeleteCount = Math.min(Math.max(deleteCount, 0), length - actualStart);
  }
  // Before any allocation or shifting: a result past 2^53-1 is a TypeError, and
  // checking late would walk ~2^53 indices first.
  if (length + insertCount - actualDeleteCount > 9007199254740991) {
    throw new TypeError('Array.prototype.splice: resulting length exceeds 2^53-1');
  }
  // inlined: ArraySpeciesCreate(object, actualDeleteCount)
  let removed: any;
  let plain = true; // false once a @@species constructor builds the result
  if (!Array.isArray(object)) {
    removed = new Array(actualDeleteCount);
  } else {
    let ctor: any = object.constructor;
    if (ctor !== null && (typeof ctor === 'object' || typeof ctor === 'function')) {
      if (typeof Symbol !== 'undefined' && (Symbol as any).species) {
        ctor = ctor[(Symbol as any).species];
        if (ctor === null) ctor = undefined;
      }
    } else if (ctor !== undefined) {
      throw new TypeError('Array.prototype.splice: constructor is not an object');
    }
    if (ctor === undefined || ctor === Array) {
      removed = new Array(actualDeleteCount);
    } else {
      if (typeof ctor !== 'function') throw new TypeError('Array.prototype.splice: @@species is not a constructor');
      removed = new ctor(actualDeleteCount);
      plain = false;
    }
  }
  for (let i = 0; i < actualDeleteCount; i++) {
    const from = actualStart + i;
    if (from in object) {
      if (plain && !(i in ArrayProto)) removed[i] = object[from];
      else {
        dataDesc.value = object[from];
        Object.defineProperty(removed, i, dataDesc);
      }
    }
  }
  dataDesc.value = undefined;
  removed.length = actualDeleteCount;
  const countDelta = insertCount - actualDeleteCount;
  if (countDelta < 0) {
    // shrinking: shift the tail left, then chop the leftovers
    for (let i = actualStart; i < length - actualDeleteCount; i++) {
      const from = i + actualDeleteCount;
      const to = i + insertCount;
      if (from in object) {
        object[to] = object[from];
      } else {
        delete object[to];
      }
    }
    for (let i = length; i > length + countDelta; i--) {
      delete object[i - 1];
    }
  } else if (countDelta > 0) {
    // growing: shift the tail right, back to front so nothing gets stomped
    for (let i = length - actualDeleteCount; i > actualStart; i--) {
      const from = i + actualDeleteCount - 1;
      const to = i + insertCount - 1;
      if (from in object) {
        object[to] = object[from];
      } else {
        delete object[to];
      }
    }
  }
  for (let i = 0; i < insertCount; i++) {
    object[actualStart + i] = arguments[i + 2];
  }
  // inlined: setArrayLength(object, ...) -- the TypeError Safari < 13 swallows
  if (SILENT_LENGTH_SET && Array.isArray(object) && !(Object.getOwnPropertyDescriptor(object, 'length') as any).writable) {
    throw new TypeError('Cannot set read only .length');
  }
  object.length = length + countDelta;
  return removed;
};

