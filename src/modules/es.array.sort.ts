// Ported from: the prior implementation (array-sort.ts + is-array-sort-supported.ts)

// Array.prototype.sort — behavioral: V8 used an unstable quicksort for arrays
// longer than 10 until Chrome 70, reordering equal-compare items. ES2019
// mandates a stable sort, so we sort 16 equal-keyed items and check the
// original order survived.
export const isSupported = (): boolean => {
  try {
    if (typeof Array.prototype.sort !== 'function') {
      return false;
    }
    // two interleaved key groups, tags record the original order
    const items: { key: number; tag: number }[] = [];
    for (let i = 0; i < 16; i++) {
      items.push({ key: i % 2, tag: i });
    }
    items.sort(function (a, b) {
      return a.key - b.key;
    });
    // within each key group the tags must still be ascending
    for (let i = 1; i < items.length; i++) {
      if (items[i].key === items[i - 1].key && items[i].tag < items[i - 1].tag) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
};

export const isArraySortSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.sort
 * GC: one aux buffer per sort (bottom-up merge, no recursion).
 */

const MAX_SAFE_LENGTH = 9007199254740991; // 2^53 - 1

// clamp whatever .length gives us into a sane 0..MAX integer
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

// spec default SortCompare: compare the ToString of both values
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

// bottom-up merge sort: stable, one aux buffer, iterative so deep arrays
// can't blow the stack. `<= 0` on the left keeps equal items in first-seen
// order — the stability guarantee V8 didn't give until Chrome 70.
const stableSort = (items: any[], compare: (a: any, b: any) => number): void => {
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
        if (compare(source[left], source[right]) <= 0) {
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

export const arraySort = function <T>(this: any, compareFn?: (a: T, b: T) => number): T[] {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.sort called on null or undefined');
  }
  if (compareFn !== undefined && typeof compareFn !== 'function') {
    throw new TypeError('The comparison function must be either a function or undefined');
  }
  const object = Object(this);
  const length = toLength(object.length);
  // pull out the present values; per spec undefineds sort after everything
  // and holes pack after the undefineds
  const items: any[] = [];
  let undefinedCount = 0;
  let holeCount = 0;
  for (let i = 0; i < length; i++) {
    if (!(i in object)) {
      holeCount++;
    } else if (object[i] === undefined) {
      undefinedCount++;
    } else {
      items.push(object[i]);
    }
  }
  // spec coerces the comparator result with ToNumber and treats NaN as 0
  const compare = compareFn
    ? function (a: any, b: any): number {
      const numeric = Number(compareFn(a, b));
      return numeric === numeric ? numeric : 0;
    }
    : defaultCompare;
  stableSort(items, compare);
  // write back: sorted values, then undefineds, then delete the hole tail
  let index = 0;
  for (let i = 0; i < items.length; i++) {
    object[index++] = items[i];
  }
  for (let u = 0; u < undefinedCount; u++) {
    object[index++] = undefined;
  }
  for (let h = 0; h < holeCount; h++) {
    delete object[index++];
  }
  return object;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'sort', { value: arraySort as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.sort, 'name', { value: 'sort', configurable: true });
  Object.defineProperty((Array.prototype.sort as any), '__polyfilled', { value: true });
}
