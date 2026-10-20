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

export const arrayToSpliced = function <T>(
  this: ArrayLike<T>,
  start?: number,
  skipCount?: number,
  // `arguments`, not a rest parameter (an array per call); `_items` keeps
  // toSpliced.length at 2.
  _items?: T
): T[] {
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

  const result: T[] = new Array(newLength);
  let writeIndex = 0;
  // copy the kept head
  while (writeIndex < actualStart) {
    result[writeIndex] = object[writeIndex];
    writeIndex++;
  }
  // drop in the new items
  for (let i = 0; i < insertCount; i++) {
    result[writeIndex] = arguments[i + 2];
    writeIndex++;
  }
  // copy the kept tail, skipping over the removed chunk
  let readFrom = actualStart + actualSkipCount;
  while (writeIndex < newLength) {
    result[writeIndex] = object[readFrom];
    writeIndex++;
    readFrom++;
  }
  return result;
};

