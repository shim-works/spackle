// Behavioural: V8's sort was unstable for arrays over 10 until Chrome 70.
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
    // core-js's es.array.sort probes: undefined is accepted, null is refused
    // (V8), and a null receiver throws (old WebKit's sort was not strict)
    const test = [1, 2, 3];
    test.sort(undefined);
    try {
      test.sort(null as any);
      return false;
    } catch (e) { /* good: null is not a comparator */ }
    try {
      (Array.prototype.sort as any).call(null, function () { return 1; });
      return false;
    } catch (e) { /* good */ }
    // core-js's STABLE_SORT behavioural fallback: 517 items in 11 runs (old WebKit
    // and V8 only fail past ~10 or ~512 elements; Safari 7.1 fails at 11)
    const big: { k: string; v: number }[] = [];
    for (let code = 65; code < 76; code++) {
      const chr = String.fromCharCode(code);
      const v = code === 66 || code === 69 || code === 70 || code === 72 ? 3 : code === 68 || code === 71 ? 4 : 2;
      for (let index = 0; index < 47; index++) big.push({ k: chr + index, v: v });
    }
    big.sort(function (a, b) { return b.v - a.v; });
    let order = '';
    for (let index = 0; index < big.length; index++) {
      const chr = big[index].k.charAt(0);
      if (order.charAt(order.length - 1) !== chr) order += chr;
    }
    return order === 'DGBEFHACIJK';
  } catch {
    return false;
  }
};

export const isArraySortSupported = isSupported;

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.sort */

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
// Comparator for the call in progress. Module-level instead of a per-call
// closure; arraySort saves and restores it, so a comparator that sorts again
// (re-entrancy) still sees its own.
let activeCompareFn: any;
const userCompare = (a: any, b: any): number => {
  const numeric = +activeCompareFn(a, b); // +x, not Number(x)
  return numeric === numeric ? numeric : 0;
};

/*
 * Merge sort over null-prototype lists: they are spec-internal, so no index
 * write on them may reach a setter on Array.prototype or Object.prototype.
 */
const stableSort = (items: any, length: number, compare: (a: any, b: any) => number): any => {
  if (length < 2) {
    return items;
  }
  let source = items;
  let target: any = Object.create(null);
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
  return source;
};

// Declared (comparefn) for the spec length of 1.
export const arraySort = function sort(this: any, comparefn?: any): any {
  if (comparefn !== undefined && typeof comparefn !== 'function') {
    throw new TypeError('The comparison function must be either a function or undefined');
  }
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.sort called on null or undefined');
  }
  const object = Object(this);
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  // SortIndexedProperties: read each present element exactly once. undefineds
  // sort after everything (the comparator never sees them), holes after those.
  let items: any = Object.create(null);
  let itemCount = 0;
  let undefinedCount = 0;
  for (let i = 0; i < length; i++) {
    if (i in object) {
      const value = object[i];
      if (value === undefined) {
        undefinedCount++;
      } else {
        items[itemCount++] = value;
      }
    }
  }
  if (comparefn === undefined) {
    items = stableSort(items, itemCount, defaultCompare);
  } else {
    const saved = activeCompareFn;
    activeCompareFn = comparefn;
    try {
      items = stableSort(items, itemCount, userCompare);
    } finally {
      activeCompareFn = saved;
    }
  }
  // write back only after sorting: values, then undefineds, then delete the rest
  let index = 0;
  for (let i = 0; i < itemCount; i++) {
    object[index++] = items[i];
  }
  for (let u = 0; u < undefinedCount; u++) {
    object[index++] = undefined;
  }
  for (; index < length; index++) {
    delete object[index];
  }
  return object;
};
