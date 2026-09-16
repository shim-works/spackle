import { arrayToSorted } from '../src/modules/es.array.to-sorted.js';


/**
 * test262-derived conformance suite for the Array.prototype.toSorted polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/Array/prototype/toSorted/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype/toSorted
 *
 * toSorted is ES2023 (Chrome 110 / Safari 16) — far above the floor, so the
 * polyfill always installs; the probe is purely defensive.
 *
 * Non-mutating sort. Dense copy + inlined stable merge sort (native .sort was
 * unstable on V8 until Chrome 70, and toSorted mandates stable):
 *
 *   - returns a new, sorted array, original untouched
 *   - stable: equal-compare items keep their original order
 *   - default ordering is by string (lexicographic), like sort
 *   - honors a supplied comparator
 *   - undefined sorts to the end regardless of comparator
 *   - a non-callable comparator (not undefined) throws TypeError
 *   - holes in the source materialize as undefined, sorted to the end
 *   - generic via .call on an array-like
 */
describe('Array.prototype.toSorted — test262 conformance', () => {
  describe('default ordering', () => {
    it('sorts lexicographically by default (string coercion)', () => {
      expect(arrayToSorted.call([10, 1, 2])).toEqual([1, 10, 2]);
    });

    it('returns an empty array for an empty array', () => {
      expect(arrayToSorted.call([])).toEqual([]);
    });
  });

  describe('comparator', () => {
    it('honors a numeric comparator', () => {
      expect(arrayToSorted.call([10, 1, 2], (a: number, b: number) => a - b)).toEqual([
        1, 2, 10,
      ]);
    });

    it('throws TypeError when comparator is not callable and not undefined', () => {
      expect(() => arrayToSorted.call([1, 2], 5 as any)).toThrow(TypeError);
    });

    it('accepts undefined comparator (default ordering)', () => {
      expect(arrayToSorted.call([3, 1, 2], undefined)).toEqual([1, 2, 3]);
    });
  });

  describe('stability', () => {
    it('keeps equal-compare items in original order (16+ items)', () => {
      const items: { key: number; tag: number }[] = [];
      for (let i = 0; i < 32; i++) {
        items.push({ key: i % 4, tag: i });
      }
      const out = arrayToSorted.call(items, (a: any, b: any) => a.key - b.key) as any[];
      for (let i = 1; i < out.length; i++) {
        if (out[i].key === out[i - 1].key) {
          expect(out[i].tag).toBeGreaterThan(out[i - 1].tag);
        } else {
          expect(out[i].key).toBeGreaterThan(out[i - 1].key);
        }
      }
    });
  });

  describe('non-mutating', () => {
    it('does not mutate the original', () => {
      const arr = [3, 1, 2];
      const out = arrayToSorted.call(arr, (a: number, b: number) => a - b);
      expect(arr).toEqual([3, 1, 2]);
      expect(out).not.toBe(arr);
      expect(out).toEqual([1, 2, 3]);
    });
  });

  describe('undefined + holes', () => {
    it('sorts undefined to the end', () => {
      const out = arrayToSorted.call([3, undefined, 1], (a: any, b: any) => a - b);
      expect(out).toEqual([1, 3, undefined]);
    });

    it('treats holes as undefined, sorted to the end', () => {
      // eslint-disable-next-line no-sparse-arrays
      const out = arrayToSorted.call([3, , 1], (a: any, b: any) => a - b);
      expect(out).toEqual([1, 3, undefined]);
      expect(2 in out).toBe(true);
    });
  });

  describe('length coercion (ToLength)', () => {
    it('floors a fractional length', () => {
      const arrayLike = { 0: 2, 1: 1, 2: 99, length: 2.9 };
      expect(arrayToSorted.call(arrayLike as any, (a: number, b: number) => a - b)).toEqual([
        1, 2,
      ]);
    });
  });

  describe('generic application', () => {
    it('works on a string-keyed array-like via .call', () => {
      const arrayLike = { 0: 3, 1: 1, 2: 2, length: 3 };
      expect(arrayToSorted.call(arrayLike as any, (a: number, b: number) => a - b)).toEqual([
        1, 2, 3,
      ]);
    });
  });

  describe('parity vs native', () => {
    it('matches native with a numeric comparator', () => {
      const arr = [5, 3, 8, 1, 9, 2];
      const cmp = (a: number, b: number) => a - b;
      const native = (Array.prototype as any).toSorted;
      const nativeResult = native.call(arr, cmp);
      const specResult = arrayToSorted.call(arr, cmp);
      expect(specResult).toEqual(nativeResult);
    });
  });
});
