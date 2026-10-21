// Array.prototype.flatMap: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.flatMap === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.flatmap */

// the genuine native Array.isArray, captured before any polyfill could install
const nativeIsArray = Array.isArray;

// One descriptor for CreateDataPropertyOrThrow, reused by every call; value is
// cleared after each run so it never pins an element.
const dataDesc: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };
// CreateDataPropertyOrThrow, the fast way when it is the same thing: on an array
// this call created, with nothing at that index up the prototype chain, a plain
// write cannot hit a setter or a read-only slot. Anything else (a @@species or
// `this` constructor's object, an index defined on Array.prototype) goes through
// defineProperty, as the spec requires. core-js always pays for defineProperty.
const ArrayProto = Array.prototype;

// Declared (mapper) for the spec length of 1; thisArg comes from arguments.
export const arrayFlatMap = function flatMap(this: any, mapper: any): any {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.flatMap called on null or undefined');
  }
  const O = Object(this);
  // inlined: toLength(O.length)
  let length = +O.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  if (typeof mapper !== 'function') {
    throw new TypeError('Array.prototype.flatMap: callback must be a function');
  }
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  // inlined: ArraySpeciesCreate(O, 0)
  let A: any;
  let plain = true; // false once a @@species constructor builds the result
  if (!nativeIsArray(O)) {
    A = [];
  } else {
    let C: any = O.constructor;
    if (C !== null && (typeof C === 'object' || typeof C === 'function')) {
      if (typeof Symbol !== 'undefined' && (Symbol as any).species) {
        C = C[(Symbol as any).species];
        if (C === null) C = undefined;
      }
    } else if (C !== undefined) {
      throw new TypeError('Array.prototype.flatMap: constructor is not an object');
    }
    if (C === undefined || C === Array) {
      A = [];
    } else {
      if (typeof C !== 'function') throw new TypeError('Array.prototype.flatMap: @@species is not a constructor');
      A = new C(0);
      plain = false;
    }
  }
  let targetIndex = 0;
  for (let i = 0; i < length; i++) {
    // holes in the source are skipped -- like map, the mapper is not invoked
    if (!(i in O)) {
      continue;
    }
    const mapped = mapper.call(thisArg, O[i], i, O);
    if (nativeIsArray(mapped)) {
      // flatten one level, skipping holes in the returned array
      let mappedLength = +mapped.length;
      mappedLength = mappedLength !== mappedLength || mappedLength <= 0 ? 0 : mappedLength > 9007199254740991 ? 9007199254740991 : Math.floor(mappedLength);
      for (let j = 0; j < mappedLength; j++) {
        if (j in mapped) {
          if (targetIndex >= 9007199254740991) throw new TypeError('Array.prototype.flatMap: result too long');
          if (plain && !(targetIndex in ArrayProto)) A[targetIndex++] = mapped[j];
          else {
            dataDesc.value = mapped[j];
            Object.defineProperty(A, targetIndex++, dataDesc);
          }
        }
      }
    } else {
      if (targetIndex >= 9007199254740991) throw new TypeError('Array.prototype.flatMap: result too long');
      if (plain && !(targetIndex in ArrayProto)) A[targetIndex++] = mapped;
      else {
        dataDesc.value = mapped;
        Object.defineProperty(A, targetIndex++, dataDesc);
      }
    }
  }
  dataDesc.value = undefined;
  return A;
};
