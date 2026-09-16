import { arraySort, isArraySortSupported } from '../src/modules/es.array.sort.js';


/**
 * test262-derived conformance suite for the Array.prototype.sort polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/Array/prototype/sort/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype/sort
 *
 * sort is ES1, but stability is ES2019 (Chrome 70 / Safari always) — V8's
 * quicksort reordered equal-compare items on arrays longer than 10 until
 * Chrome 70, so the behavioral probe installs the stable island on the floor.
 *
 *   - sorts in place and returns the same array
 *   - default ordering is by string (lexicographic)
 *   - honors a supplied comparator; NaN comparator results are treated as 0
 *   - stable: equal-compare items keep their original order
 *   - undefined sorts after all values; holes pack after the undefineds
 *   - a non-callable comparator (not undefined) throws TypeError
 *   - generic via .call on an array-like
 */
describe('Array.prototype.sort — test262 conformance', () => {
  describe('basic', () => {
    it('sorts in place and returns the same array', () => {
      const arr = [3, 1, 2];
      const out = arraySort.call(arr, (a: number, b: number) => a - b);
      expect(out).toBe(arr);
      expect(arr).toEqual([1, 2, 3]);
    });

    it('sorts lexicographically by default (string coercion)', () => {
      expect(arraySort.call([10, 1, 2])).toEqual([1, 10, 2]);
    });

    it('handles an empty array and a single element', () => {
      expect(arraySort.call([])).toEqual([]);
      expect(arraySort.call([1])).toEqual([1]);
    });
  });

  describe('comparator', () => {
    it('honors a numeric comparator', () => {
      expect(arraySort.call([10, 1, 2], (a: number, b: number) => a - b)).toEqual([1, 2, 10]);
    });

    it('throws TypeError when comparator is not callable and not undefined', () => {
      expect(() => arraySort.call([1, 2], 5 as any)).toThrow(TypeError);
    });

    it('treats a NaN comparator result as 0 (keeps original order)', () => {
      const arr = [3, 1, 2];
      arraySort.call(arr, () => NaN);
      expect(arr).toEqual([3, 1, 2]);
    });
  });

  describe('stability', () => {
    it('keeps equal-compare items in original order (16+ items)', () => {
      const items: { key: number; tag: number }[] = [];
      for (let i = 0; i < 32; i++) {
        items.push({ key: i % 4, tag: i });
      }
      arraySort.call(items, (a: any, b: any) => a.key - b.key);
      for (let i = 1; i < items.length; i++) {
        if (items[i].key === items[i - 1].key) {
          expect(items[i].tag).toBeGreaterThan(items[i - 1].tag);
        } else {
          expect(items[i].key).toBeGreaterThan(items[i - 1].key);
        }
      }
    });
  });

  describe('undefined + holes', () => {
    it('sorts undefined after all values without calling the comparator on it', () => {
      let sawUndefined = false;
      const out = arraySort.call([3, undefined, 1], (a: any, b: any) => {
        if (a === undefined || b === undefined) {
          sawUndefined = true;
        }
        return a - b;
      });
      expect(out).toEqual([1, 3, undefined]);
      expect(sawUndefined).toBe(false);
    });

    it('packs holes after the undefineds', () => {
      // eslint-disable-next-line no-sparse-arrays
      const arr = [3, undefined, , 1];
      arraySort.call(arr, (a: any, b: any) => a - b);
      expect(arr[0]).toBe(1);
      expect(arr[1]).toBe(3);
      expect(arr[2]).toBe(undefined);
      expect(2 in arr).toBe(true);
      expect(3 in arr).toBe(false);
    });
  });

  describe('generic application', () => {
    it('works on an array-like via .call', () => {
      const arrayLike: any = { 0: 3, 1: 1, 2: 2, length: 3 };
      arraySort.call(arrayLike, (a: number, b: number) => a - b);
      expect([arrayLike[0], arrayLike[1], arrayLike[2]]).toEqual([1, 2, 3]);
    });

    it('throws on null/undefined this', () => {
      expect(() => arraySort.call(null as any)).toThrow(TypeError);
      expect(() => arraySort.call(undefined as any)).toThrow(TypeError);
    });
  });

  describe('parity vs native', () => {
    it('matches native with a numeric comparator', () => {
      const source = [5, 3, 8, 1, 9, 2, 7, 4, 6, 0, 11, 10];
      const cmp = (a: number, b: number) => a - b;
      const nativeResult = source.slice().sort(cmp);
      const specResult = arraySort.call(source.slice(), cmp);
      expect(specResult).toEqual(nativeResult);
    });
  });

  describe('probe', () => {
    it('reports stable native sorts as supported (modern engines)', () => {
      expect(isArraySortSupported()).toBe(true);
    });
  });
});
