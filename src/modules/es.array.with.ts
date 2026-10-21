export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.with === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.with
 * Inspired by: es-shims array.prototype.with (lean ES5 rewrite)
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

export const arrayWith = function (this: any, index: any, value: any): any[] {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.with called on null or undefined');
  }
  // box it so strings / array-likes behave like real arrays
  const object = Object(this);
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  // negative index counts from the end
  // inlined: toInteger(index)
  let relativeIndex = +index;
  relativeIndex = relativeIndex !== relativeIndex ? 0 : relativeIndex < 0 ? Math.ceil(relativeIndex) : Math.floor(relativeIndex);
  let actualIndex = relativeIndex;
  if (relativeIndex < 0) {
    actualIndex = length + relativeIndex;
  }
  if (actualIndex < 0 || actualIndex >= length) {
    throw new RangeError('Array.prototype.with: index out of range');
  }
  const result: any[] = new Array(length);
  // copy everything, swapping in the new value at the one spot
  for (let i = 0; i < length; i++) {
    if (!(i in ArrayProto)) result[i] = i === actualIndex ? value : object[i];
    else {
      dataDesc.value = i === actualIndex ? value : object[i];
      Object.defineProperty(result, i, dataDesc);
    }
  }
  dataDesc.value = undefined;
  return result;
};
