/** Spec: https://tc39.es/ecma262/#sec-array.prototype.flat */

export const isArrayFlatSupported = (): boolean => isSupported();

export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.flat === 'function';
  } catch {
    return false;
  }
};

// the genuine native Array.isArray, captured before any polyfill could install
const nativeIsArray = Array.isArray;

interface Frame {
  array: any[];
  index: number;
  length: number;
  depth: number;
}

// One descriptor for CreateDataPropertyOrThrow, reused by every call; value is
// cleared after each run so it never pins an element.
const dataDesc: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };
// CreateDataPropertyOrThrow, the fast way when it is the same thing: on an array
// this call created, with nothing at that index up the prototype chain, a plain
// write cannot hit a setter or a read-only slot. Anything else (a @@species or
// `this` constructor's object, an index defined on Array.prototype) goes through
// defineProperty, as the spec requires. core-js always pays for defineProperty.
const ArrayProto = Array.prototype;

// Declared with no parameters for the spec length of 0; depth comes from arguments.
export const arrayFlat = function flat(this: any): any {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.flat called on null or undefined');
  }
  const O = Object(this);
  // inlined: toLength(O.length)
  let rootLength = +O.length;
  rootLength = rootLength !== rootLength || rootLength <= 0 ? 0 : rootLength > 9007199254740991 ? 9007199254740991 : Math.floor(rootLength);
  let startDepth = 1;
  const depth = arguments.length > 0 ? arguments[0] : undefined;
  if (depth !== undefined) {
    // inlined: ToIntegerOrInfinity(depth)
    startDepth = +depth;
    startDepth = startDepth !== startDepth ? 0 : startDepth < 0 ? Math.ceil(startDepth) : Math.floor(startDepth);
  }
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
      throw new TypeError('Array.prototype.flat: constructor is not an object');
    }
    if (C === undefined || C === Array) {
      A = [];
    } else {
      if (typeof C !== 'function') throw new TypeError('Array.prototype.flat: @@species is not a constructor');
      A = new C(0);
      plain = false;
    }
  }
  let targetIndex = 0;
  const stack: Frame[] = [{ array: O, index: 0, length: rootLength, depth: startDepth }];

  while (stack.length > 0) {
    const frame = stack[stack.length - 1]!;
    if (frame.index >= frame.length) {
      stack.pop();
      continue;
    }

    const currentIndex = frame.index++;
    if (!(currentIndex in frame.array)) {
      continue;
    }

    const value = frame.array[currentIndex];
    if (frame.depth > 0 && nativeIsArray(value)) {
      // inlined: toLength(value.length)
      let innerLength = +value.length;
      innerLength = innerLength !== innerLength || innerLength <= 0 ? 0 : innerLength > 9007199254740991 ? 9007199254740991 : Math.floor(innerLength);
      stack.push({ array: value, index: 0, length: innerLength, depth: frame.depth - 1 });
    } else {
      if (targetIndex >= 9007199254740991) throw new TypeError('Array.prototype.flat: result too long');
      if (plain && !(targetIndex in ArrayProto)) A[targetIndex++] = value;
      else {
        dataDesc.value = value;
        Object.defineProperty(A, targetIndex++, dataDesc);
      }
    }
  }
  dataDesc.value = undefined;
  return A;
};
