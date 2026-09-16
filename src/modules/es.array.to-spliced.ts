// Ported from: the prior implementation (array-to-spliced.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
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
const toLength = (value: any): number => {
  const numeric = Number(value);
  if (isNaN(numeric) || numeric <= 0) {
    return 0;
  }
  if (numeric > MAX_SAFE_LENGTH) {
    return MAX_SAFE_LENGTH;
  }
  return Math.floor(numeric);
};

// ToIntegerOrInfinity: NaN -> 0; infinities preserved; else truncate to zero.
const toInteger = (value: any): number => {
  const numeric = Number(value);
  if (isNaN(numeric)) {
    return 0;
  }
  if (numeric === Infinity || numeric === -Infinity) {
    return numeric;
  }
  if (numeric < 0) {
    return Math.ceil(numeric);
  }
  return Math.floor(numeric);
};

export const arrayToSpliced = function <T>(
  this: ArrayLike<T>,
  start?: number,
  skipCount?: number,
  ...items: T[]
): T[] {
  // box it so strings / array-likes behave like real arrays
  const object = Object(this);
  const length = toLength(object.length);
  const argCount = arguments.length;

  // Relative start, clamped to [0, length].
  const relativeStart = toInteger(start);
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
    actualSkipCount = Math.min(Math.max(toInteger(skipCount), 0), length - actualStart);
  }

  const insertCount = items.length;
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
    result[writeIndex] = items[i];
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

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'toSpliced', { value: arrayToSpliced as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.toSpliced, 'name', { value: 'toSpliced', configurable: true });
  Object.defineProperty((Array.prototype.toSpliced as any), '__polyfilled', { value: true });
}
