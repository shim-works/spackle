import { arrayFlatMap } from '../src/modules/es.array.flat-map.js';


/**
 * test262-derived conformance suite for the Array.prototype.flatMap polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/Array/prototype/flatMap/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype/flatMap
 *
 * flatMap is ES2019 (Chrome 69 / Safari 12) — far above the floor, so the
 * polyfill always installs; the probe is purely defensive.
 *
 * flatMap is map() followed by a flatten of depth 1. Both steps skip holes.
 *
 *   - calls callback with (value, index, array); honors thisArg
 *   - flattens exactly one level; nested arrays beyond that are kept
 *   - non-array return values are appended as-is
 *   - a non-callable callback throws TypeError
 *   - holes in the source are skipped (callback not invoked)
 *   - holes inside a returned array are skipped
 *   - length coerced via ToLength: fractional floored; negative/NaN -> no visit
 *   - returns a new array; generic via .call
 */
describe('Array.prototype.flatMap — test262 conformance', () => {
  describe('mapping + single-level flatten', () => {
    it('maps then flattens one level', () => {
      expect(arrayFlatMap.call([1, 2, 3], (v) => [v, v * 2])).toEqual([
        1, 2, 2, 4, 3, 6,
      ]);
    });

    it('flattens exactly one level (nested arrays are kept)', () => {
      expect(arrayFlatMap.call([1], () => [[2]])).toEqual([[2]]);
    });

    it('appends non-array return values as-is', () => {
      expect(arrayFlatMap.call([1, 2], (v) => v * 10)).toEqual([10, 20]);
    });

    it('returns an empty array for an empty array', () => {
      expect(arrayFlatMap.call([], (v) => v)).toEqual([]);
    });
  });

  describe('callback invocation', () => {
    it('calls callback with (value, index, array)', () => {
      const arr = ['a', 'b'];
      const seen: Array<[string, number, unknown]> = [];
      arrayFlatMap.call(arr, (v, i, a) => {
        seen.push([v, i, a]);
        return v;
      });
      expect(seen).toEqual([
        ['a', 0, arr],
        ['b', 1, arr],
      ]);
    });

    it('honors thisArg', () => {
      const ctx = { factor: 3 };
      const out = arrayFlatMap.call(
        [1, 2],
        function (this: typeof ctx, v: number) {
          return v * this.factor;
        },
        ctx,
      );
      expect(out).toEqual([3, 6]);
    });

    it('throws TypeError when callback is not callable', () => {
      expect(() => arrayFlatMap.call([1], 5 as any)).toThrow(TypeError);
    });
  });

  describe('holes', () => {
    it('skips holes in the source (callback not invoked)', () => {
      let calls = 0;
      // eslint-disable-next-line no-sparse-arrays
      const out = arrayFlatMap.call([1, , 3], (v) => {
        calls++;
        return v;
      });
      expect(calls).toBe(2);
      expect(out).toEqual([1, 3]);
    });

    it('skips holes inside a returned array', () => {
      // eslint-disable-next-line no-sparse-arrays
      expect(arrayFlatMap.call([1], () => [10, , 30])).toEqual([10, 30]);
    });
  });

  describe('length coercion (ToLength)', () => {
    it('floors a fractional length', () => {
      const arrayLike = { 0: 1, 1: 2, 2: 3, length: 2.9 };
      expect(arrayFlatMap.call(arrayLike as any, (v) => v)).toEqual([1, 2]);
    });

    it('does not visit anything for a negative length', () => {
      let calls = 0;
      arrayFlatMap.call({ length: -1, 0: 1 } as any, () => {
        calls++;
        return 1;
      });
      expect(calls).toBe(0);
    });

    it('does not visit anything for a NaN length', () => {
      let calls = 0;
      arrayFlatMap.call({ length: NaN, 0: 1 } as any, () => {
        calls++;
        return 1;
      });
      expect(calls).toBe(0);
    });
  });

  describe('return value & generic application', () => {
    it('returns a new array', () => {
      const arr = [1, 2];
      const out = arrayFlatMap.call(arr, (v) => v);
      expect(out).not.toBe(arr);
      expect(out).toEqual([1, 2]);
    });

    it('works on a string-keyed array-like via .call', () => {
      const arrayLike = { 0: 1, 1: 2, length: 2 };
      expect(arrayFlatMap.call(arrayLike as any, (v: number) => [v, v])).toEqual([
        1, 1, 2, 2,
      ]);
    });
  });

  describe('parity vs native', () => {
    it('matches native mapping to pairs', () => {
      const arr = [1, 2, 3];
      const native = Array.prototype.flatMap;
      const cb = (v: number) => [v, v * 2];
      const nativeResult = native.call(arr, cb);
      const specResult = arrayFlatMap.call(arr, cb);
      expect(specResult).toEqual(nativeResult);
    });
  });
});
