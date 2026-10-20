import {
  setUnion,
  setIntersection,
  setDifference,
  setSymmetricDifference,
  setIsSubsetOf,
  setIsSupersetOf,
  setIsDisjointFrom,
  isSupported,
} from '../src/modules/_set-methods-impl.js';

/**
 * Conformance for the ES2024 Set methods island. core-js tracks these as seven
 * module ids sharing one GetSetRecord machinery; we exercise the hand-rolled
 * impls directly, including set-like arguments and the RequireInternalSlot /
 * GetSetRecord error paths.
 */
const S = (values: any[]): Set<any> => new Set(values);
const list = (s: Set<any>): string => Array.from(s).join(',');

describe('Set.prototype.union island', () => {
  it('merges both sets, de-duplicating', () => {
    expect(list(setUnion.call(S([1, 2, 3]), S([3, 4])))).toBe('1,2,3,4');
  });
  it('accepts a set-like argument', () => {
    const setLike = { size: 2, has: (v: any) => v === 2 || v === 3, keys: function* () { yield 2; yield 3; } };
    expect(list(setUnion.call(S([1, 2]), setLike))).toBe('1,2,3');
  });
});

describe('Set.prototype.intersection island', () => {
  it('keeps only shared elements', () => {
    expect(list(setIntersection.call(S([1, 2, 3]), S([3, 2])))).toBe('3,2');
  });
  it('takes the this-set path when the other set is larger', () => {
    expect(list(setIntersection.call(S([1, 2]), S([2, 3, 4, 5])))).toBe('2');
  });
});

describe('Set.prototype.difference island', () => {
  it('removes the other set’s elements', () => {
    expect(list(setDifference.call(S([1, 2, 3, 4]), S([3, 4])))).toBe('1,2');
  });
});

describe('Set.prototype.symmetricDifference island', () => {
  it('keeps elements in exactly one set', () => {
    expect(list(setSymmetricDifference.call(S([1, 2, 3]), S([3, 4])))).toBe('1,2,4');
  });
});

describe('Set relation predicates', () => {
  it('isSubsetOf', () => {
    expect(setIsSubsetOf.call(S([1, 2]), S([1, 2, 3]))).toBe(true);
    expect(setIsSubsetOf.call(S([1, 5]), S([1, 2, 3]))).toBe(false);
  });
  it('isSupersetOf', () => {
    expect(setIsSupersetOf.call(S([1, 2, 3]), S([1, 2]))).toBe(true);
    expect(setIsSupersetOf.call(S([1]), S([1, 2]))).toBe(false);
  });
  it('isDisjointFrom', () => {
    expect(setIsDisjointFrom.call(S([1, 2]), S([3, 4]))).toBe(true);
    expect(setIsDisjointFrom.call(S([1, 2]), S([2, 3]))).toBe(false);
  });
});

describe('GetSetRecord / RequireInternalSlot guards', () => {
  it('throws TypeError for an invalid size', () => {
    expect(() => setUnion.call(S([1]), { size: NaN, has() {}, keys() {} })).toThrow(TypeError);
  });
  it('throws RangeError for a negative size', () => {
    expect(() => setUnion.call(S([1]), { size: -1, has() {}, keys() {} })).toThrow(RangeError);
  });
  it('throws TypeError when this is not a Set', () => {
    expect(() => setUnion.call({} as any, S([1]))).toThrow(TypeError);
  });
  it('reports supported when the native methods are present', () => {
    expect(isSupported()).toBe(true);
  });
});

describe('Set methods — closing the other set early', () => {
  // A set-like whose keys() iterator counts return() calls.
  const setLike = (values: any[], closed: { count: number }) => ({
    size: values.length,
    has: (v: any) => values.indexOf(v) !== -1,
    keys: () => {
      let i = 0;
      return {
        next: () => (i < values.length ? { value: values[i++], done: false } : { value: undefined, done: true }),
        return: () => {
          closed.count++;
          return {};
        },
      };
    },
  });

  it('isSupersetOf stops at the first missing value and closes the iterator', () => {
    const closed = { count: 0 };
    // receiver is larger, so the size check passes and the other set is walked
    expect(setIsSupersetOf.call(new Set([1, 2, 3]), setLike([1, 9], closed))).toBe(false);
    expect(closed.count).toBe(1);
  });

  it('isSupersetOf walks to the end without closing when every value is present', () => {
    const closed = { count: 0 };
    expect(setIsSupersetOf.call(new Set([1, 2, 3]), setLike([1, 2], closed))).toBe(true);
    expect(closed.count).toBe(0);
  });

  it('isDisjointFrom stops at the first shared value and closes the iterator', () => {
    const closed = { count: 0 };
    // receiver larger than the other set, so the other set is the one iterated
    expect(setIsDisjointFrom.call(new Set([1, 2, 3, 4]), setLike([7, 3], closed))).toBe(false);
    expect(closed.count).toBe(1);
  });

  it('throws when iterator.return() hands back a non-object', () => {
    const bad = {
      size: 1,
      has: () => false,
      keys: () => ({ next: () => ({ value: 5, done: false }), return: () => 1 }),
    };
    expect(() => setIsSupersetOf.call(new Set([1]), bad)).toThrow(TypeError);
  });
});

describe('Set methods — set-like validation order', () => {
  it('checks object, then size, then has, then keys', () => {
    const s = new Set([1]);
    expect(() => setUnion.call(s, null)).toThrow(TypeError);
    expect(() => setUnion.call(s, { size: undefined, has() {}, keys() {} })).toThrow(TypeError);
    expect(() => setUnion.call(s, { size: -1, has() {}, keys() {} })).toThrow(RangeError);
    expect(() => setUnion.call(s, { size: 1, has: 1, keys() {} })).toThrow(/has/);
    expect(() => setUnion.call(s, { size: 1, has() {}, keys: 1 })).toThrow(/keys/);
  });

  it('rejects a keys() that returns a non-object', () => {
    expect(() => setUnion.call(new Set([1]), { size: 1, has: () => false, keys: () => 1 })).toThrow(TypeError);
  });

  it('accepts an Infinity size and still answers correctly', () => {
    const everything = { size: Infinity, has: () => true, keys: () => ({ next: () => ({ done: true }) }) };
    expect(setIsSubsetOf.call(new Set([1, 2]), everything)).toBe(true);
  });
});
