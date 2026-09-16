import { arrayFindIndex } from '../src/modules/es.array.find-index.js';


/**
 * test262-derived conformance suite for the Array.prototype.findIndex polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Array/prototype/findIndex/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype/findIndex
 *
 *   - returns the index of the first element for which predicate is truthy, else -1
 *   - predicate is called with (value, index, array), ascending from 0
 *   - honors thisArg
 *   - a non-callable predicate throws TypeError
 *   - visits EVERY index 0..len-1 including holes (predicate sees undefined for
 *     a hole) — unlike forEach/map, which skip holes
 *   - length coerced via ToLength: fractional floored; negative/NaN -> no visit
 *   - generic: works on array-likes via .call
 */
describe('Array.prototype.findIndex — test262 conformance', () => {
  describe('return value', () => {
    it('returns the index of the first matching element', () => {
      expect(arrayFindIndex.call([1, 2, 3, 4, 5], (v) => v > 3)).toBe(3);
    });

    it('returns -1 when nothing matches', () => {
      expect(arrayFindIndex.call([1, 2, 3], (v) => v > 10)).toBe(-1);
    });

    it('returns -1 for an empty array', () => {
      expect(arrayFindIndex.call([], () => true)).toBe(-1);
    });

    it('returns 0 when the first element matches', () => {
      expect(arrayFindIndex.call([7, 8, 9], (v) => v === 7)).toBe(0);
    });
  });

  describe('predicate invocation', () => {
    it('calls predicate with (value, index, array) ascending', () => {
      const arr = ['a', 'b', 'c'];
      const seen: Array<[string, number, unknown]> = [];
      arrayFindIndex.call(arr, (v, i, a) => {
        seen.push([v, i, a]);
        return false;
      });
      expect(seen).toEqual([
        ['a', 0, arr],
        ['b', 1, arr],
        ['c', 2, arr],
      ]);
    });

    it('honors thisArg', () => {
      const ctx = { min: 2 };
      const out = arrayFindIndex.call(
        [1, 2, 3],
        function (this: typeof ctx, v: number) {
          return v >= this.min;
        },
        ctx,
      );
      expect(out).toBe(1);
    });

    it('throws TypeError when predicate is not callable', () => {
      expect(() => arrayFindIndex.call([1, 2], 5 as any)).toThrow(TypeError);
    });
  });

  describe('holes', () => {
    it('visits holes as undefined (unlike forEach)', () => {
      // eslint-disable-next-line no-sparse-arrays
      const sparse = [1, , 3];
      const seen: Array<[number, unknown]> = [];
      arrayFindIndex.call(sparse, (v, i) => {
        seen.push([i, v]);
        return false;
      });
      expect(seen).toEqual([
        [0, 1],
        [1, undefined],
        [2, 3],
      ]);
    });

    it('matches the undefined value at a hole and returns its index', () => {
      // eslint-disable-next-line no-sparse-arrays
      const sparse = [1, , 3];
      expect(arrayFindIndex.call(sparse, (v) => v === undefined)).toBe(1);
    });
  });

  describe('length coercion (ToLength)', () => {
    it('floors a fractional length', () => {
      const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 2.9 };
      const seen: number[] = [];
      arrayFindIndex.call(arrayLike as any, (_v, i) => {
        seen.push(i);
        return false;
      });
      expect(seen).toEqual([0, 1]);
    });

    it('does not visit anything for a negative length', () => {
      let calls = 0;
      arrayFindIndex.call({ length: -1, 0: 'a' } as any, () => {
        calls++;
        return true;
      });
      expect(calls).toBe(0);
    });

    it('does not visit anything for a NaN length', () => {
      let calls = 0;
      arrayFindIndex.call({ length: NaN, 0: 'a' } as any, () => {
        calls++;
        return true;
      });
      expect(calls).toBe(0);
    });
  });

  describe('generic application (array-likes)', () => {
    it('finds the index in a string-keyed array-like via .call', () => {
      const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
      expect(arrayFindIndex.call(arrayLike as any, (v) => v === 'b')).toBe(1);
    });
  });

  describe('parity vs native', () => {
    it('matches native finding an index', () => {
      const arr = [1, 2, 3, 4, 5];
      const native = Array.prototype.findIndex;
      const pred = (v: number) => v > 3;
      const nativeResult = native.call(arr, pred);
      const specResult = arrayFindIndex.call(arr, pred);
      expect(specResult).toBe(nativeResult);
    });
  });
});
