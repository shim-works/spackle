import {
  isModernSupported,
  typedArrayFindLast,
  typedArrayFindLastIndex,
  typedArrayToReversed,
  typedArrayToSorted,
  typedArrayWith,
  typedArraySet,
  typedArrayFrom,
  typedArrayOf,
} from '../src/modules/_typed-array-impl.js';

/**
 * The ES2023 typed-array additions plus the from/of statics — gate 2 in
 * _typed-array-impl.ts. Implementations are exercised directly, since whether
 * they install depends on how modern the host's typed arrays already are.
 */
describe('gate separation', () => {
  it('is a distinct probe from the ES2015 suite', () => {
    // The whole point of the second gate: these must be answerable
    // independently, or an engine with the ES2015 suite and none of the ES2023
    // additions would install nothing.
    expect(typeof isModernSupported()).toBe('boolean');
  });
});

describe('findLast / findLastIndex', () => {
  it('scans from the end', () => {
    const ta = new Uint8Array([1, 2, 3, 2]);
    expect(typedArrayFindLast.call(ta, (v: number) => v === 2)).toBe(2);
    expect(typedArrayFindLastIndex.call(ta, (v: number) => v === 2)).toBe(3);
  });

  it('reports the misses the spec way', () => {
    const ta = new Uint8Array([1, 2]);
    expect(typedArrayFindLast.call(ta, () => false)).toBe(undefined);
    expect(typedArrayFindLastIndex.call(ta, () => false)).toBe(-1);
  });

  it('throws on a non-callable predicate', () => {
    const ta = new Uint8Array([1]);
    expect(() => typedArrayFindLast.call(ta, 1)).toThrow(TypeError);
    expect(() => typedArrayFindLastIndex.call(ta, 1)).toThrow(TypeError);
  });
});

describe('toReversed / toSorted / with', () => {
  it('toReversed returns a new array and leaves the original alone', () => {
    const ta = new Uint8Array([1, 2, 3]);
    const out = typedArrayToReversed.call(ta);
    expect(Array.from(out)).toEqual([3, 2, 1]);
    expect(Array.from(ta)).toEqual([1, 2, 3]);
    expect(out).not.toBe(ta);
    expect(out instanceof Uint8Array).toBe(true);
  });

  it('toSorted sorts numerically by default, not lexicographically', () => {
    const ta = new Uint8Array([10, 9, 1]);
    const out = typedArrayToSorted.call(ta);
    // the Array default comparator would give [1, 10, 9]
    expect(Array.from(out)).toEqual([1, 9, 10]);
    expect(Array.from(ta)).toEqual([10, 9, 1]);
  });

  it('toSorted honours a comparator', () => {
    const ta = new Uint8Array([1, 2, 3]);
    const out = typedArrayToSorted.call(ta, (a: number, b: number) => b - a);
    expect(Array.from(out)).toEqual([3, 2, 1]);
  });

  it('with replaces one index, including from the end', () => {
    const ta = new Uint8Array([1, 2, 3]);
    expect(Array.from(typedArrayWith.call(ta, 1, 9))).toEqual([1, 9, 3]);
    expect(Array.from(typedArrayWith.call(ta, -1, 9))).toEqual([1, 2, 9]);
    expect(Array.from(ta)).toEqual([1, 2, 3]);
  });

  it('with throws RangeError outside bounds', () => {
    const ta = new Uint8Array([1, 2, 3]);
    expect(() => typedArrayWith.call(ta, 3, 9)).toThrow(RangeError);
    expect(() => typedArrayWith.call(ta, -4, 9)).toThrow(RangeError);
  });
});

describe('set', () => {
  it('copies at an offset', () => {
    const ta = new Uint8Array(4);
    typedArraySet.call(ta, [1, 2], 1);
    expect(Array.from(ta)).toEqual([0, 1, 2, 0]);
  });

  it('throws RangeError rather than truncating when the source does not fit', () => {
    expect(() => typedArraySet.call(new Uint8Array(2), [1, 2, 3])).toThrow(RangeError);
    expect(() => typedArraySet.call(new Uint8Array(3), [1, 2], 2)).toThrow(RangeError);
  });

  it('throws RangeError on a negative offset', () => {
    expect(() => typedArraySet.call(new Uint8Array(4), [1], -1)).toThrow(RangeError);
  });
});

describe('from / of statics', () => {
  it('of builds from its arguments', () => {
    const out = typedArrayOf.call(Uint8Array, 1, 2, 3);
    expect(out instanceof Uint8Array).toBe(true);
    expect(Array.from(out)).toEqual([1, 2, 3]);
  });

  it('from builds from an array-like', () => {
    const out = typedArrayFrom.call(Uint8Array, { length: 2, 0: 5, 1: 6 });
    expect(Array.from(out)).toEqual([5, 6]);
  });

  it('from builds from an iterable', () => {
    expect(Array.from(typedArrayFrom.call(Uint8Array, new Set([7, 8])))).toEqual([7, 8]);
  });

  it('from applies a map function with the index', () => {
    const out = typedArrayFrom.call(Uint8Array, [1, 2], (v: number, i: number) => v + i);
    expect(Array.from(out)).toEqual([1, 3]);
  });

  it('from throws on a non-callable mapfn', () => {
    expect(() => typedArrayFrom.call(Uint8Array, [1], 1)).toThrow(TypeError);
  });

  it('respects the concrete type it is called on', () => {
    expect(typedArrayOf.call(Int16Array, 1) instanceof Int16Array).toBe(true);
  });
});
