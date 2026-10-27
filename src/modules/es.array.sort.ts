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

// bottom-up merge sort: stable, one aux buffer, iterative so deep arrays
// can't blow the stack. `<= 0` on the left keeps equal items in first-seen
// order — the stability guarantee V8 didn't give until Chrome 70.
// The user's comparefn rides along as an argument -- no per-call closure, and no
// module state to restore, so arraySort needs no try/finally and a comparator
// that sorts again (re-entrancy) still sees its own. Both comparisons are
// inlined: through a function pointer, the call site saw two targets and the
// engine could not inline either.

/*
 * Merge sort over spec-internal lists: no index write on them may reach a setter
 * on Array.prototype or Object.prototype. Plain arrays when nothing sits at those
 * indices up the chain, null-prototype objects otherwise.
 */
const stableSort = (items: any, length: number, plain: boolean, comparefn: any): any => {
  if (length < 2) {
    return items;
  }
  // Small lists: insertion sort in place, stable (strict > keeps equal items in
  // order), no second buffer and no merge passes.
  if (length <= 10) {
    for (let i = 1; i < length; i++) {
      const value = items[i];
      let j = i - 1;
      while (j >= 0) {
        const a = items[j];
        let order: number;
        if (comparefn !== undefined) {
          // inlined: userCompare(a, value, comparefn)
          order = +comparefn(a, value); // +x, not Number(x)
          if (order !== order) order = 0;
        } else {
          // inlined: defaultCompare(a, value) -- the ToString of both values
          const left = String(a);
          const right = String(value);
          order = left < right ? -1 : left > right ? 1 : 0;
        }
        if (order <= 0) break;
        items[j + 1] = a;
        j--;
      }
      items[j + 1] = value;
    }
    return items;
  }
  let source = items;
  let target: any = plain ? [] : Object.create(null);
  for (let width = 1; width < length; width *= 2) {
    for (let start = 0; start < length; start += width * 2) {
      let left = start;
      const middle = start + width < length ? start + width : length;
      let right = middle;
      const end = start + width * 2 < length ? start + width * 2 : length;
      let out = start;
      while (left < middle && right < end) {
        const a = source[left];
        const b = source[right];
        let order: number;
        if (comparefn !== undefined) {
          // inlined: userCompare(a, b, comparefn)
          order = +comparefn(a, b); // +x, not Number(x)
          if (order !== order) order = 0;
        } else {
          // inlined: defaultCompare(a, b) -- the ToString of both values
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
  // Plain arrays keep fast elements on old V8, a null-prototype object does not.
  // They are only safe when no index up the prototype chain could catch a write.
  let plain = true;
  for (let i = 0; i < length; i++) {
    if (i in Array.prototype) {
      plain = false;
      break;
    }
  }
  let items: any = plain ? [] : Object.create(null);
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
  items = stableSort(items, itemCount, plain, comparefn);
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
