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
 */

// Bottom-up merge sort, inlined: stable (V8's sort wasn't until Chrome 70), one
// aux buffer, no recursion.
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
        // `<= 0` keeps equal items in first-seen order
        // inlined: sortCompare(compareFn, a, b)
        const a = source[left];
        const b = source[right];
        let order: number;
        if (a === undefined) {
          order = b === undefined ? 0 : 1;
        } else if (b === undefined) {
          order = -1;
        } else if (compareFn) {
          order = +compareFn(a, b) || 0; // +x, not Number(x)
        } else {
          // inlined: defaultCompare(a, b)
          const sa = String(a);
          const sb = String(b);
          order = sa < sb ? -1 : sa > sb ? 1 : 0;
        }
        if (order <= 0) {
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
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  // dense copy first so the original is never mutated (holes read as undefined)
  const items: T[] = new Array(length);
  for (let i = 0; i < length; i++) {
    items[i] = object[i];
  }
  stableSort(items, compareFn);
  return items;
};

