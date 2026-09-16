// Ported from: the prior implementation (array-to-sorted.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.toSorted === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.tosorted
 * Inspired by: es-shims array.prototype.tosorted (lean ES5 rewrite)
 * GC: one result array + one aux buffer.
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

// spec default SortCompare: undefined sorts last, everything else compares
// by ToString
const defaultCompare = (a: any, b: any): number => {
  const left = String(a);
  const right = String(b);
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
};

// undefined-last wrapper the spec applies around any comparator
const sortCompare = (compareFn: ((a: any, b: any) => number) | undefined, a: any, b: any): number => {
  if (a === undefined) {
    return b === undefined ? 0 : 1;
  }
  if (b === undefined) {
    return -1;
  }
  return compareFn ? Number(compareFn(a, b)) || 0 : defaultCompare(a, b);
};

// bottom-up merge sort, inlined (islands never import islands): stable, one
// aux buffer, no recursion. Native .sort is off the table here — V8 used an
// unstable quicksort until Chrome 70 and toSorted mandates stable order.
const stableSort = (items: any[], compareFn: ((a: any, b: any) => number) | undefined): void => {
  const length = items.length;
  if (length < 2) {
    return;
  }
  let source = items;
  let target = new Array(length);
  for (let width = 1; width < length; width *= 2) {
    for (let start = 0; start < length; start += width * 2) {
      let left = start;
      const middle = start + width < length ? start + width : length;
      let right = middle;
      const end = start + width * 2 < length ? start + width * 2 : length;
      let out = start;
      while (left < middle && right < end) {
        // `<= 0` keeps equal items in first-seen order — the stability guarantee
        if (sortCompare(compareFn, source[left], source[right]) <= 0) {
          target[out++] = source[left++];
        } else {
          target[out++] = source[right++];
        }
      }
      while (left < middle) {
        target[out++] = source[left++];
      }
      while (right < end) {
        target[out++] = source[right++];
      }
    }
    const swap = source;
    source = target;
    target = swap;
  }
  // after an odd number of passes the result lives in the buffer — copy home
  if (source !== items) {
    for (let i = 0; i < length; i++) {
      items[i] = source[i];
    }
  }
};

export const arrayToSorted = function <T>(
  this: ArrayLike<T>,
  compareFn?: (a: T, b: T) => number
): T[] {
  if (compareFn !== undefined && typeof compareFn !== 'function') {
    throw new TypeError('The comparison function must be either a function or undefined');
  }
  // box it so strings / array-likes behave like real arrays
  const object = Object(this);
  const length = toLength(object.length);
  // dense copy first so the original is never mutated (holes read as undefined)
  const items: T[] = new Array(length);
  for (let i = 0; i < length; i++) {
    items[i] = object[i];
  }
  stableSort(items, compareFn);
  return items;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'toSorted', { value: arrayToSorted as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.toSorted, 'name', { value: 'toSorted', configurable: true });
  Object.defineProperty((Array.prototype.toSorted as any), '__polyfilled', { value: true });
}
