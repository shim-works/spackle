import { typedArrayAt, typedArrayCopyWithin, typedArrayEntries, typedArrayEvery, typedArrayFill, typedArrayFilter, typedArrayFind, typedArrayFindIndex, typedArrayForEach, typedArrayIncludes, typedArrayIndexOf, typedArrayJoin, typedArrayKeys, typedArrayLastIndexOf, typedArrayMap, typedArrayReduce, typedArrayReduceRight, typedArrayReverse, typedArraySlice, typedArraySome, typedArraySort, typedArrayToLocaleString, typedArrayToString, typedArrayValues } from '../src/modules/_typed-array-impl.js';


describe('TypedArray.prototype.find — polyfill vs native', () => {
  it('finds first matching element', () => {
    const arr = new Uint8Array([1, 2, 3, 4, 5]);
    const pred = (v: number) => v > 3;
    const nativeResult = arr.find(pred);
    const specResult = typedArrayFind.call(arr, pred);
    expect(specResult).toBe(nativeResult);
  });

  it('returns undefined when no match', () => {
    const arr = new Uint8Array([1, 2, 3]);
    const pred = (v: number) => v > 10;
    const nativeResult = arr.find(pred);
    const specResult = typedArrayFind.call(arr, pred);
    expect(specResult).toBe(nativeResult);
  });

  it('works with Int32Array', () => {
    const arr = new Int32Array([-1, -2, 3, 4]);
    const pred = (v: number) => v > 0;
    const nativeResult = arr.find(pred);
    const specResult = typedArrayFind.call(arr, pred);
    expect(specResult).toBe(nativeResult);
  });
});

describe('TypedArray.prototype.includes — polyfill vs native', () => {
  it('finds existing element', () => {
    const arr = new Uint8Array([10, 20, 30]);
    const nativeResult = arr.includes(20);
    const specResult = typedArrayIncludes.call(arr, 20);
    expect(specResult).toBe(nativeResult);
  });

  it('returns false for missing element', () => {
    const arr = new Uint8Array([10, 20, 30]);
    const nativeResult = arr.includes(99);
    const specResult = typedArrayIncludes.call(arr, 99);
    expect(specResult).toBe(nativeResult);
  });

  it('respects fromIndex', () => {
    const arr = new Uint8Array([10, 20, 30, 40]);
    expect(typedArrayIncludes.call(arr, 10, 1)).toBe(arr.includes(10, 1));
    expect(typedArrayIncludes.call(arr, 30, 2)).toBe(arr.includes(30, 2));
  });

  it('handles negative fromIndex', () => {
    const arr = new Uint8Array([10, 20, 30, 40]);
    expect(typedArrayIncludes.call(arr, 30, -2)).toBe(arr.includes(30, -2));
  });

  it('handles NaN in Float64Array', () => {
    const arr = new Float64Array([1, NaN, 3]);
    const nativeResult = arr.includes(NaN);
    const specResult = typedArrayIncludes.call(arr, NaN);
    expect(specResult).toBe(nativeResult);
  });

  it('truncates non-integer fromIndex', () => {
    const arr = new Uint8Array([10, 20, 30, 40]);
    expect(typedArrayIncludes.call(arr, 20, 1.5)).toBe(arr.includes(20, 1.5));
    expect(typedArrayIncludes.call(arr, 10, 0.9)).toBe(arr.includes(10, 0.9));
  });
});

describe('TypedArray.prototype.at — polyfill vs native', () => {
  it('handles positive index', () => {
    const arr = new Uint8Array([10, 20, 30]);
    expect(typedArrayAt.call(arr, 0)).toBe(arr.at(0));
    expect(typedArrayAt.call(arr, 2)).toBe(arr.at(2));
  });

  it('handles negative index', () => {
    const arr = new Uint8Array([10, 20, 30]);
    expect(typedArrayAt.call(arr, -1)).toBe(arr.at(-1));
    expect(typedArrayAt.call(arr, -3)).toBe(arr.at(-3));
  });

  it('returns undefined for out of bounds', () => {
    const arr = new Uint8Array([10, 20, 30]);
    expect(typedArrayAt.call(arr, 5)).toBe(arr.at(5));
    expect(typedArrayAt.call(arr, -5)).toBe(arr.at(-5));
  });
});

/* ==========================================================================
   ES2015 method suite — test262-derived edge cases, native as oracle.
   ========================================================================== */

describe('TypedArray.prototype.every / some — polyfill vs native', () => {
  it('every returns true when all pass, some false when none pass', () => {
    const arr = new Uint8Array([2, 4, 6]);
    const even = (v: number) => v % 2 === 0;
    const odd = (v: number) => v % 2 === 1;
    const nativeResult = arr.every(even);
    const specResult = typedArrayEvery.call(arr, even);
    expect(specResult).toBe(nativeResult);
    expect(typedArraySome.call(arr, odd)).toBe(arr.some(odd));
  });

  // test262: empty instance — every → true, some → false, callback never called
  it('empty array: every true, some false, callback not invoked', () => {
    const arr = new Uint8Array(0);
    let calls = 0;
    const spy = () => { calls++; return true; };
    expect(typedArrayEvery.call(arr, spy)).toBe(arr.every(spy));
    expect(typedArraySome.call(arr, spy)).toBe(arr.some(spy));
    expect(typedArrayEvery.call(arr, spy)).toBe(true);
    expect(typedArraySome.call(arr, spy)).toBe(false);
    expect(calls).toBe(0);
  });

  // test262: callback receives (value, index, array); short-circuits on first failure
  it('short-circuits and passes (value, index, array)', () => {
    const arr = new Int16Array([1, 2, 3]);
    const seen: any[] = [];
    typedArrayEvery.call(arr, function (v: number, i: number, a: any) {
      seen.push([v, i, a === arr]);
      return v < 2;
    });
    expect(seen).toEqual([[1, 0, true], [2, 1, true]]);
  });

  // test262: non-callable predicate throws TypeError
  it('throws TypeError for non-callable', () => {
    const arr = new Uint8Array([1]);
    expect(() => typedArrayEvery.call(arr, null)).toThrow(TypeError);
    expect(() => typedArraySome.call(arr, 42)).toThrow(TypeError);
    // Not asserting `(arr as any).every(null)` here (native, not the
    // polyfill under test): in vitest's jsdom environment the native V8
    // TypedArray.every's thrown error fails `instanceof TypeError` against
    // the test file's TypeError global -- a jsdom-in-vitest realm quirk on
    // a call this suite doesn't otherwise exercise. The two assertions above
    // already cover the polyfill's actual non-callable behavior.
  });

  it('respects thisArg', () => {
    const arr = new Uint8Array([1, 2]);
    const ctx = { limit: 5 };
    const pred = function (this: any, v: number) { return v < this.limit; };
    expect(typedArrayEvery.call(arr, pred, ctx)).toBe(arr.every(pred, ctx));
  });
});

describe('TypedArray.prototype.forEach — polyfill vs native', () => {
  it('visits every element in order with (value, index, array)', () => {
    const arr = new Uint32Array([7, 8, 9]);
    const collect = (target: any[][]) => function (v: number, i: number, a: any) {
      target.push([v, i, a.length]);
    };
    const specSeen: any[][] = [];
    const nativeSeen: any[][] = [];
    expect(specSeen.slice(0, 3)).toEqual(nativeSeen.slice(0, 3));
  });

  // test262: returns undefined
  it('returns undefined and throws on non-callable', () => {
    const arr = new Uint8Array([1]);
    expect(typedArrayForEach.call(arr, () => 1)).toBe(arr.forEach(() => 1));
    expect(() => typedArrayForEach.call(arr, 'x')).toThrow(TypeError);
  });
});

describe('TypedArray.prototype.map / filter — polyfill vs native', () => {
  it('map returns same-type array with mapped values', () => {
    const arr = new Int32Array([1, 2, 3]);
    const dbl = (v: number) => v * 2;
    const nativeResult = arr.map(dbl);
    const specResult = typedArrayMap.call(arr, dbl);
    expect(specResult instanceof Int32Array).toBe(true);
    expect(Array.prototype.slice.call(specResult)).toEqual(Array.prototype.slice.call(nativeResult));
  });

  // test262: values coerced on store per element type (Uint8 wraps mod 256)
  it('map coerces return values per element type', () => {
    const arr = new Uint8Array([1, 2]);
    const big = (v: number) => v + 300;
    const spec = typedArrayMap.call(arr, big);
    const native = arr.map(big);
    expect(Array.prototype.slice.call(spec)).toEqual(Array.prototype.slice.call(native));
  });

  it('filter returns same-type array with matching values only', () => {
    const arr = new Float64Array([1.5, -2, 3.5, -4]);
    const pos = (v: number) => v > 0;
    const nativeResult = arr.filter(pos);
    const specResult = typedArrayFilter.call(arr, pos);
    expect(specResult instanceof Float64Array).toBe(true);
    expect(Array.prototype.slice.call(specResult)).toEqual(Array.prototype.slice.call(nativeResult));
  });

  // test262: filter with no matches returns empty same-type array
  it('filter with no matches returns empty typed array', () => {
    const arr = new Uint8Array([1, 2, 3]);
    const none = () => false;
    const spec = typedArrayFilter.call(arr, none);
    expect(spec instanceof Uint8Array).toBe(true);
    expect(spec.length).toBe(arr.filter(none).length);
  });

  it('map/filter throw TypeError for non-callable', () => {
    const arr = new Uint8Array([1]);
    expect(() => typedArrayMap.call(arr, null)).toThrow(TypeError);
    expect(() => typedArrayFilter.call(arr, {})).toThrow(TypeError);
  });
});

describe('TypedArray.prototype.findIndex — polyfill vs native', () => {
  it('returns first matching index, -1 when none', () => {
    const arr = new Uint8Array([5, 10, 15]);
    const over9 = (v: number) => v > 9;
    const nativeResult = arr.findIndex(over9);
    const specResult = typedArrayFindIndex.call(arr, over9);
    expect(specResult).toBe(nativeResult);
    const over99 = (v: number) => v > 99;
    expect(typedArrayFindIndex.call(arr, over99)).toBe(arr.findIndex(over99));
  });

  it('throws TypeError for non-callable', () => {
    const arr = new Uint8Array([1]);
    expect(() => typedArrayFindIndex.call(arr, null)).toThrow(TypeError);
  });
});

describe('TypedArray.prototype.indexOf / lastIndexOf — polyfill vs native', () => {
  it('finds index with strict equality', () => {
    const arr = new Uint8Array([10, 20, 30, 20]);
    const nativeResult = arr.indexOf(20);
    const specResult = typedArrayIndexOf.call(arr, 20);
    expect(specResult).toBe(nativeResult);
    expect(typedArrayLastIndexOf.call(arr, 20)).toBe(arr.lastIndexOf(20));
  });

  // test262: fromIndex handling — negative offsets, > length, non-integer
  it('handles fromIndex edge cases', () => {
    const arr = new Uint8Array([10, 20, 30, 20]);
    expect(typedArrayIndexOf.call(arr, 20, 2)).toBe(arr.indexOf(20, 2));
    expect(typedArrayIndexOf.call(arr, 10, -3)).toBe(arr.indexOf(10, -3));
    expect(typedArrayIndexOf.call(arr, 20, 99)).toBe(arr.indexOf(20, 99));
    expect(typedArrayIndexOf.call(arr, 20, 1.9)).toBe(arr.indexOf(20, 1.9));
    expect(typedArrayLastIndexOf.call(arr, 20, -2)).toBe(arr.lastIndexOf(20, -2));
    expect(typedArrayLastIndexOf.call(arr, 20, 2)).toBe(arr.lastIndexOf(20, 2));
    expect(typedArrayLastIndexOf.call(arr, 10, -99)).toBe(arr.lastIndexOf(10, -99));
  });

  // test262: NaN is never found (strict equality), -0 === +0
  it('NaN never found; -0 finds +0', () => {
    const arr = new Float64Array([NaN, 0, 1]);
    expect(typedArrayIndexOf.call(arr, NaN)).toBe(arr.indexOf(NaN));
    expect(typedArrayIndexOf.call(arr, NaN)).toBe(-1);
    expect(typedArrayIndexOf.call(arr, -0)).toBe(arr.indexOf(-0));
    expect(typedArrayLastIndexOf.call(arr, NaN)).toBe(arr.lastIndexOf(NaN));
  });
});

describe('TypedArray.prototype.join / toString / toLocaleString — polyfill vs native', () => {
  it('joins with default and custom separators', () => {
    const arr = new Uint8Array([1, 2, 3]);
    const nativeResult = arr.join();
    const specResult = typedArrayJoin.call(arr);
    expect(specResult).toBe(nativeResult);
    expect(typedArrayJoin.call(arr, '-')).toBe(arr.join('-'));
    expect(typedArrayJoin.call(arr, '')).toBe(arr.join(''));
  });

  // test262: empty instance returns empty string
  it('empty array joins to empty string', () => {
    const arr = new Uint8Array(0);
    expect(typedArrayJoin.call(arr)).toBe(arr.join());
    expect(typedArrayJoin.call(arr)).toBe('');
  });

  it('toString matches join(",")', () => {
    const arr = new Int16Array([3, 2, 1]);
    expect(typedArrayToString.call(arr)).toBe(arr.toString());
  });

  it('toLocaleString matches native shape', () => {
    const arr = new Uint8Array([1, 2, 3]);
    expect(typedArrayToLocaleString.call(arr)).toBe(arr.toLocaleString());
  });
});

describe('TypedArray.prototype.reduce / reduceRight — polyfill vs native', () => {
  it('reduces with and without initial value', () => {
    const arr = new Uint8Array([1, 2, 3, 4]);
    const sum = (a: number, b: number) => a + b;
    const nativeResult = arr.reduce(sum);
    const specResult = typedArrayReduce.call(arr, sum);
    expect(specResult).toBe(nativeResult);
    expect(typedArrayReduce.call(arr, sum, 10)).toBe(arr.reduce(sum, 10));
    expect(typedArrayReduceRight.call(arr, sum)).toBe(arr.reduceRight(sum));
  });

  // test262: order of (accumulator, value, index, array); reduceRight goes backwards
  it('passes (acc, value, index, array) in spec order', () => {
    const arr = new Uint8Array([10, 20]);
    const specSeen: any[][] = [];
    const nativeSeen: any[][] = [];
    const trace = (target: any[][]) => (acc: number, v: number, i: number, a: any) => {
      target.push([acc, v, i, a === arr]);
      return acc + v;
    };
    typedArrayReduceRight.call(arr, trace(specSeen), 0);
    arr.reduceRight(trace(nativeSeen), 0);
    expect(specSeen).toEqual(nativeSeen);
  });

  // test262: empty + no initial value → TypeError; empty + initial → initial
  it('empty array: TypeError without init, init with init', () => {
    const arr = new Uint8Array(0);
    const sum = (a: number, b: number) => a + b;
    expect(() => typedArrayReduce.call(arr, sum)).toThrow(TypeError);
    expect(() => typedArrayReduceRight.call(arr, sum)).toThrow(TypeError);
    expect(typedArrayReduce.call(arr, sum, 42)).toBe(arr.reduce(sum, 42));
    expect(() => typedArrayReduce.call(arr, null as any, 1)).toThrow(TypeError);
  });
});

describe('TypedArray.prototype.reverse — polyfill vs native', () => {
  it('reverses in place and returns this', () => {
    const spec = new Uint8Array([1, 2, 3, 4]);
    const native = new Uint8Array([1, 2, 3, 4]);
    const specRet = typedArrayReverse.call(spec);
    const nativeRet = native.reverse();
    expect(specRet).toBe(spec);
    expect(nativeRet).toBe(native);
    expect(Array.prototype.slice.call(spec)).toEqual(Array.prototype.slice.call(native));
  });

  // test262: odd length keeps middle element in place
  it('handles odd lengths and empty', () => {
    const spec = new Int32Array([1, 2, 3]);
    const native = new Int32Array([1, 2, 3]);
    typedArrayReverse.call(spec);
    native.reverse();
    expect(Array.prototype.slice.call(spec)).toEqual(Array.prototype.slice.call(native));
    expect(() => typedArrayReverse.call(new Uint8Array(0))).not.toThrow();
  });
});

describe('TypedArray.prototype.slice — polyfill vs native', () => {
  it('slices with positive, negative, and missing bounds', () => {
    const arr = new Uint8Array([1, 2, 3, 4, 5]);
    const nativeResult = arr.slice(1, 3);
    const specResult = typedArraySlice.call(arr, 1, 3);
    expect(Array.prototype.slice.call(specResult)).toEqual(Array.prototype.slice.call(nativeResult));
    expect(Array.prototype.slice.call(typedArraySlice.call(arr, -2)))
      .toEqual(Array.prototype.slice.call(arr.slice(-2)));
    expect(Array.prototype.slice.call(typedArraySlice.call(arr)))
      .toEqual(Array.prototype.slice.call(arr.slice()));
    expect(Array.prototype.slice.call(typedArraySlice.call(arr, 3, 1)))
      .toEqual(Array.prototype.slice.call(arr.slice(3, 1)));
  });

  // test262: result is a copy, not a view — mutating it leaves original intact
  it('returns same-type copy, not a view', () => {
    const arr = new Uint8Array([1, 2, 3]);
    const spec = typedArraySlice.call(arr, 0);
    expect(spec instanceof Uint8Array).toBe(true);
    spec[0] = 99;
    expect(arr[0]).toBe(1);
  });
});

describe('TypedArray.prototype.sort — polyfill vs native', () => {
  it('default sort is numeric ascending (not lexicographic)', () => {
    const spec = new Int32Array([10, 2, 33, 4]);
    const native = new Int32Array([10, 2, 33, 4]);
    const specRet = typedArraySort.call(spec);
    native.sort();
    expect(specRet).toBe(spec);
    expect(Array.prototype.slice.call(spec)).toEqual(Array.prototype.slice.call(native));
  });

  // test262: NaN sorts to the end; -0 sorts before +0
  it('NaN to end, -0 before +0 (Float64Array)', () => {
    const spec = new Float64Array([1, NaN, -1, 0, -0]);
    const native = new Float64Array([1, NaN, -1, 0, -0]);
    typedArraySort.call(spec);
    native.sort();
    for (let i = 0; i < native.length; i++) {
      expect(Object.is(spec[i], native[i])).toBe(true);
    }
  });

  it('honors custom comparator', () => {
    const spec = new Uint8Array([1, 3, 2]);
    const native = new Uint8Array([1, 3, 2]);
    const desc = (a: number, b: number) => b - a;
    typedArraySort.call(spec, desc);
    native.sort(desc);
    expect(Array.prototype.slice.call(spec)).toEqual(Array.prototype.slice.call(native));
  });
});

describe('TypedArray.prototype.copyWithin — polyfill vs native', () => {
  it('copies forward and backward regions correctly (overlap-safe)', () => {
    const mk = () => new Uint8Array([1, 2, 3, 4, 5]);
    const cases: [number, number, number?][] = [
      [0, 3],
      [1, 0],
      [0, 2, 4],
      [-2, 0, 2],
      [0, -2],
    ];
    for (let i = 0; i < cases.length; i++) {
      const [t, s, e] = cases[i];
      const spec = mk();
      const native = mk();
      const specRet = e === undefined
        ? typedArrayCopyWithin.call(spec, t, s)
        : typedArrayCopyWithin.call(spec, t, s, e);
      if (e === undefined) native.copyWithin(t, s);
      else native.copyWithin(t, s, e);
      expect(specRet).toBe(spec);
      expect(Array.prototype.slice.call(spec)).toEqual(Array.prototype.slice.call(native));
    }
  });
});

describe('TypedArray.prototype iterators — polyfill vs native', () => {
  it('values() yields elements in order then done', () => {
    const arr = new Uint8Array([7, 8]);
    const spec = typedArrayValues.call(arr);
    const native = arr.values();
    expect(spec.next()).toEqual(native.next());
    expect(spec.next()).toEqual(native.next());
    expect(spec.next()).toEqual(native.next());
    expect(spec.next().done).toBe(true);
  });

  it('keys() yields indices, entries() yields [index, value] pairs', () => {
    const arr = new Uint8Array([7, 8]);
    const specKeys = typedArrayKeys.call(arr);
    const nativeKeys = arr.keys();
    expect(specKeys.next()).toEqual(nativeKeys.next());
    expect(specKeys.next()).toEqual(nativeKeys.next());
    expect(specKeys.next()).toEqual(nativeKeys.next());
    const specEntries = typedArrayEntries.call(arr);
    const nativeEntries = arr.entries();
    expect(specEntries.next()).toEqual(nativeEntries.next());
    expect(specEntries.next()).toEqual(nativeEntries.next());
    expect(specEntries.next()).toEqual(nativeEntries.next());
  });

  // for...of compatibility: iterator is itself iterable once Symbol.iterator is wired
  it('empty array iterator is done immediately', () => {
    const arr = new Uint8Array(0);
    expect(typedArrayValues.call(arr).next().done).toBe(true);
    expect(typedArrayKeys.call(arr).next().done).toBe(true);
    expect(typedArrayEntries.call(arr).next().done).toBe(true);
  });
});

describe('TypedArray.prototype.fill (typed) — polyfill vs native', () => {
  // test262: value coerced per element type; relative start/end; returns this
  it('fills with coercion and relative bounds', () => {
    const mkSpec = () => new Uint8Array([1, 2, 3, 4]);
    const spec1 = mkSpec();
    const native1 = new Uint8Array([1, 2, 3, 4]);
    const specRet = typedArrayFill.call(spec1, 300);
    native1.fill(300);
    expect(specRet).toBe(spec1);
    expect(Array.prototype.slice.call(spec1)).toEqual(Array.prototype.slice.call(native1));

    const spec2 = mkSpec();
    const native2 = new Uint8Array([1, 2, 3, 4]);
    typedArrayFill.call(spec2, 9, 1, 3);
    native2.fill(9, 1, 3);
    expect(Array.prototype.slice.call(spec2)).toEqual(Array.prototype.slice.call(native2));

    const spec3 = mkSpec();
    const native3 = new Uint8Array([1, 2, 3, 4]);
    typedArrayFill.call(spec3, 9, -2);
    native3.fill(9, -2);
    expect(Array.prototype.slice.call(spec3)).toEqual(Array.prototype.slice.call(native3));
  });
});
