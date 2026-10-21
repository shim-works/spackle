/*
 * core-js's arrayMethodHasSpeciesSupport: the native must build its result
 * through @@species, or it is replaced (Chrome < 51, Safari < 10). Decided
 * without core-js's probe: setting `constructor` on a real array invalidates
 * V8's species protector (Chrome 51+) and slows every array method on the page,
 * which is why core-js skips the probe there. Every engine whose filter honours
 * @@species ships a native Array[@@species] in the same release, so that decides,
 * read before es.array.species installs spackle's getter (install-polyfills order).
 */
export const isSupported = (): boolean => {
  try {
    if (typeof Array.prototype.filter !== 'function') return false;
    const species = typeof Symbol !== 'undefined' ? (Symbol as any).species : undefined;
    if (!species) return false;
    const descriptor = Object.getOwnPropertyDescriptor(Array, species);
    return !!descriptor && typeof descriptor.get === 'function' && (descriptor.get as any).__polyfilled !== true;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.filter
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
export const arrayFilter = function filter(this: any, callbackfn: any): any[] {
  // inlined: ToObject(this)
  if (this === null || this === undefined) throw new TypeError('Array.prototype.filter called on null or undefined');
  const O = Object(this);
  // inlined: ToLength(Get(O, "length")) -- before the callback check, as the spec orders it
  let length = +O.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  if (typeof callbackfn !== 'function') throw new TypeError('Array.prototype.filter: callback is not a function');
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  // inlined: ArraySpeciesCreate(O, 0)
  let A: any;
  let plain = true; // false once a @@species constructor builds the result
  if (!Array.isArray(O)) {
    A = new Array(0);
  } else {
    let C: any = O.constructor;
    if (C !== null && (typeof C === 'object' || typeof C === 'function')) {
      if (typeof Symbol !== 'undefined' && (Symbol as any).species) {
        C = C[(Symbol as any).species];
        if (C === null) C = undefined;
      }
    } else if (C !== undefined) {
      throw new TypeError('Array.prototype.filter: constructor is not an object');
    }
    if (C === undefined || C === Array) {
      A = new Array(0);
    } else {
      if (typeof C !== 'function') throw new TypeError('Array.prototype.filter: @@species is not a constructor');
      A = new C(0);
      plain = false;
    }
  }
  let to = 0;
  for (let k = 0; k < length; k++) {
    if (k in O) {
      const kValue = O[k];
      if (callbackfn.call(thisArg, kValue, k, O)) {
        if (plain && !(to in ArrayProto)) A[to++] = kValue;
        else {
          dataDesc.value = kValue;
          Object.defineProperty(A, to++, dataDesc);
        }
      }
    }
  }
  dataDesc.value = undefined;
  return A;
};
