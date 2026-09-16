import { arrayFlat } from '../src/modules/es.array.flat.js';


/**
 * test262-derived conformance suite for the Array.prototype.flat polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Array/prototype/flat/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype/flat
 *
 * flat is ES2019 (Chrome 69 / Safari 12) — far above the floor, so the polyfill
 * always installs; the probe is purely defensive.
 *
 *   - default depth is 1
 *   - depth coerced via ToIntegerOrInfinity: NaN -> 0, fractions truncated,
 *     negative -> 0 (shallow copy, no flatten), +Infinity -> fully flatten
 *   - holes are skipped (only existing elements are copied)
 *   - returns a NEW array; non-array elements pass through
 *   - generic: works on array-likes via .call
 */
describe('Array.prototype.flat — test262 conformance', () => {
  describe('depth', () => {
    it('flattens one level by default', () => {
      expect(arrayFlat.call([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
    });

    it('leaves deeper nesting when depth is 1', () => {
      expect(arrayFlat.call([1, [2, [3]]])).toEqual([1, 2, [3]]);
    });

    it('flattens two levels when depth is 2', () => {
      expect(arrayFlat.call([1, [2, [3, [4]]]], 2)).toEqual([1, 2, 3, [4]]);
    });

    it('fully flattens when depth is Infinity', () => {
      expect(arrayFlat.call([1, [2, [3, [4, [5]]]]], Infinity)).toEqual([
        1, 2, 3, 4, 5,
      ]);
    });

    it('does not flatten when depth is 0 (shallow copy)', () => {
      expect(arrayFlat.call([1, [2, 3]], 0)).toEqual([1, [2, 3]]);
    });

    it('does not flatten for a negative depth', () => {
      expect(arrayFlat.call([1, [2, 3]], -1)).toEqual([1, [2, 3]]);
    });

    it('treats a NaN depth as 0', () => {
      expect(arrayFlat.call([1, [2, 3]], NaN)).toEqual([1, [2, 3]]);
    });

    it('truncates a fractional depth toward zero', () => {
      expect(arrayFlat.call([1, [2, [3]]], 1.9)).toEqual([1, 2, [3]]);
    });
  });

  describe('holes', () => {
    it('skips holes (only existing elements copied)', () => {
      // eslint-disable-next-line no-sparse-arrays
      expect(arrayFlat.call([1, , 3])).toEqual([1, 3]);
    });

    it('skips holes inside nested arrays too', () => {
      // eslint-disable-next-line no-sparse-arrays
      expect(arrayFlat.call([1, [2, , 4]])).toEqual([1, 2, 4]);
    });
  });

  describe('return value', () => {
    it('returns a new array (not the same reference)', () => {
      const arr = [1, 2, 3];
      const out = arrayFlat.call(arr);
      expect(out).not.toBe(arr);
      expect(out).toEqual([1, 2, 3]);
    });

    it('passes non-array elements through', () => {
      expect(arrayFlat.call([1, 'a', null, undefined, [2]])).toEqual([
        1,
        'a',
        null,
        undefined,
        2,
      ]);
    });

    it('returns an empty array for an empty array', () => {
      expect(arrayFlat.call([])).toEqual([]);
    });
  });

  describe('generic application (array-likes)', () => {
    it('flattens a string-keyed array-like via .call', () => {
      const arrayLike = { 0: 1, 1: [2, 3], length: 2 };
      expect(arrayFlat.call(arrayLike as any)).toEqual([1, 2, 3]);
    });
  });

  describe('parity vs native', () => {
    it('matches native fully flattening', () => {
      const arr = [1, [2, [3, [4]]], 5];
      const native = Array.prototype.flat;
      const nativeResult = native.call(arr, Infinity);
      const specResult = arrayFlat.call(arr, Infinity);
      expect(specResult).toEqual(nativeResult);
    });
  });
});
