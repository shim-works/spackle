export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.toSpliced === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.tospliced
 * Inspired by: es-shims array.prototype.tospliced (lean ES5 rewrite)
 */

const MAX_SAFE_LENGTH = 9007199254740991; // 2^53 - 1

// One descriptor for CreateDataPropertyOrThrow, reused by every call; value is
// cleared after each run so it never pins an element.
const dataDesc: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };
// CreateDataPropertyOrThrow, the fast way when it is the same thing: on an array
// this call created, with nothing at that index up the prototype chain, a plain
// write cannot hit a setter or a read-only slot. Anything else (a @@species or
// `this` constructor's object, an index defined on Array.prototype) goes through
// defineProperty, as the spec requires. core-js always pays for defineProperty.
const ArrayProto = Array.prototype;

// Declared (start, skipCount) for the spec length of 2; the items come from
// `arguments`, not a rest parameter (no array per call).
export const arrayToSpliced = function toSpliced(this: any, start?: any, skipCount?: any): any[] {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.toSpliced called on null or undefined');
  }
  // box it so strings / array-likes behave like real arrays
  const object = Object(this);
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  const argCount = arguments.length;

  // Relative start, clamped to [0, length].
  // inlined: toInteger(start)
  let relativeStart = +(start as any);
  relativeStart = relativeStart !== relativeStart ? 0 : relativeStart < 0 ? Math.ceil(relativeStart) : Math.floor(relativeStart);
  let actualStart: number;
  if (relativeStart === -Infinity) {
    actualStart = 0;
  } else if (relativeStart < 0) {
    actualStart = Math.max(length + relativeStart, 0);
  } else {
    actualStart = Math.min(relativeStart, length);
  }

  // Skip count: absent start -> 0; absent skipCount -> rest of array; else clamp.
  let actualSkipCount: number;
  if (argCount === 0) {
    actualSkipCount = 0;
  } else if (argCount === 1) {
    actualSkipCount = length - actualStart;
  } else {
    // inlined: toInteger(skipCount)
    let skip = +(skipCount as any);
    skip = skip !== skip ? 0 : skip < 0 ? Math.ceil(skip) : Math.floor(skip);
    actualSkipCount = Math.min(Math.max(skip, 0), length - actualStart);
  }

  const insertCount = argCount > 2 ? argCount - 2 : 0;
  const newLength = length - actualSkipCount + insertCount;
  if (newLength > MAX_SAFE_LENGTH) {
    throw new TypeError('Array length exceeded');
  }

  const result: any[] = new Array(newLength);
  let writeIndex = 0;
  // copy the kept head
  while (writeIndex < actualStart) {
    if (!(writeIndex in ArrayProto)) result[writeIndex] = object[writeIndex];
    else {
      dataDesc.value = object[writeIndex];
      Object.defineProperty(result, writeIndex, dataDesc);
    }
    writeIndex++;
  }
  // drop in the new items
  for (let i = 0; i < insertCount; i++) {
    if (!(writeIndex in ArrayProto)) result[writeIndex] = arguments[i + 2];
    else {
      dataDesc.value = arguments[i + 2];
      Object.defineProperty(result, writeIndex, dataDesc);
    }
    writeIndex++;
  }
  // copy the kept tail, skipping over the removed chunk
  let readFrom = actualStart + actualSkipCount;
  while (writeIndex < newLength) {
    if (!(writeIndex in ArrayProto)) result[writeIndex] = object[readFrom];
    else {
      dataDesc.value = object[readFrom];
      Object.defineProperty(result, writeIndex, dataDesc);
    }
    writeIndex++;
    readFrom++;
  }
  dataDesc.value = undefined;
  return result;
};

