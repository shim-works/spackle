/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.flat
 * Ported from: the prior implementation (array-flat.ts + is-array-flat-supported.ts)
 */

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

interface Frame {
  array: any[];
  index: number;
  length: number;
  depth: number;
}

export const arrayFlat = function <T>(this: T[], depth?: number): any[] {
  let startDepth = 1;
  if (depth !== undefined) {
    startDepth = toInteger(depth);
  }
  const result: any[] = [];
  const stack: Frame[] = [
    { array: this, index: 0, length: toLength(this.length), depth: startDepth },
  ];

  while (stack.length > 0) {
    // guaranteed defined — the while condition just checked stack.length > 0
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
      stack.push({
        array: value,
        index: 0,
        length: toLength(value.length),
        depth: frame.depth - 1,
      });
    } else {
      result[result.length] = value;
    }
  }

  return result;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'flat', { value: arrayFlat as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.flat, 'name', { value: 'flat', configurable: true });
  Object.defineProperty((Array.prototype.flat as any), '__polyfilled', { value: true });
}
