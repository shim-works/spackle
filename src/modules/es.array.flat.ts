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

export const arrayFlat = function <T>(this: T[], depth?: number): any[] {
  let startDepth = 1;
  if (depth !== undefined) {
    // inlined: toInteger(depth)
    startDepth = +depth;
    startDepth = startDepth !== startDepth ? 0 : startDepth < 0 ? Math.ceil(startDepth) : Math.floor(startDepth);
  }
  const result: any[] = [];
  // inlined: toLength(this.length)
  let rootLength = +this.length;
  rootLength = rootLength !== rootLength || rootLength <= 0 ? 0 : rootLength > 9007199254740991 ? 9007199254740991 : Math.floor(rootLength);
  const stack: Frame[] = [
    { array: this, index: 0, length: rootLength, depth: startDepth },
  ];

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
      stack.push({
        array: value,
        index: 0,
        length: innerLength,
        depth: frame.depth - 1,
      });
    } else {
      result[result.length] = value;
    }
  }

  return result;
};

