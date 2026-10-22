/*
 * core-js's arrayMethodHasSpeciesSupport: the native must build its result
 * through @@species, or it is replaced (Chrome < 51, Safari < 10). Decided
 * without core-js's probe: setting `constructor` on a real array invalidates
 * V8's species protector (Chrome 51+) and slows every array method on the page,
 * which is why core-js skips the probe there. Every engine whose map honours
 * @@species ships a native Array[@@species] in the same release, so that decides,
 * read before es.array.species installs spackle's getter (install-polyfills order).
 */
export const isSupported = (): boolean => {
  try {
    if (typeof Array.prototype.map !== 'function') return false;
    const species = typeof Symbol !== 'undefined' ? (Symbol as any).species : undefined;
    if (!species) return false;
    const descriptor = Object.getOwnPropertyDescriptor(Array, species);
    return !!descriptor && typeof descriptor.get === 'function' && (descriptor.get as any).__polyfilled !== true;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.map
 *
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

// Declared (callbackfn) only, for the spec length of 1; thisArg comes from arguments.
export const arrayMap = function map(this: any, callbackfn: any): any[] {
  // inlined: ToObject(this)
  if (this === null || this === undefined) throw new TypeError('Array.prototype.map called on null or undefined');
  const O = Object(this);
  // inlined: ToLength(Get(O, "length")) -- before the callback check, as the spec orders it
  let length = +O.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  if (typeof callbackfn !== 'function') throw new TypeError('Array.prototype.map: callback is not a function');
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  // inlined: ArraySpeciesCreate(O, length)
  let A: any;
  let plain = true; // false once a @@species constructor builds the result
  if (!Array.isArray(O)) {
    A = new Array(length);
  } else {
    let C: any = O.constructor;
    if (C !== null && (typeof C === 'object' || typeof C === 'function')) {
      if (typeof Symbol !== 'undefined' && (Symbol as any).species) {
        C = C[(Symbol as any).species];
        if (C === null) C = undefined;
      }
    } else if (C !== undefined) {
      throw new TypeError('Array.prototype.map: constructor is not an object');
    }
    if (C === undefined || C === Array) {
      A = new Array(length);
    } else {
      if (typeof C !== 'function') throw new TypeError('Array.prototype.map: @@species is not a constructor');
      A = new C(length);
      plain = false;
    }
  }
  for (let k = 0; k < length; k++) {
    // holes stay holes -- the callback never sees them
    if (k in O) {
      if (plain && !(k in ArrayProto)) A[k] = (thisArg === undefined ? callbackfn(O[k], k, O) : callbackfn.call(thisArg, O[k], k, O));
      else {
        dataDesc.value = (thisArg === undefined ? callbackfn(O[k], k, O) : callbackfn.call(thisArg, O[k], k, O));
        Object.defineProperty(A, k, dataDesc);
      }
    }
  }
  dataDesc.value = undefined;
  return A;
};
