import { arrayToReversed } from '../src/modules/es.array.to-reversed.js';


/**
 * test262-derived conformance suite for the Array.prototype.toReversed polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/Array/prototype/toReversed/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype/toReversed
 *
 * toReversed is ES2023 (Chrome 110 / Safari 16) — far above the floor, so the
 * polyfill always installs; the probe is purely defensive.
 *
 * Non-mutating reverse. Reads every index via Get, so the output is dense:
 *
 *   - returns a new array, original untouched
 *   - holes in the source materialize as undefined (dense output)
 *   - length coerced via ToLength: fractional floored; negative/NaN -> empty
 *   - generic via .call on an array-like
 */
describe('Array.prototype.toReversed — test262 conformance', () => {
  describe('basic reversal', () => {
    it('reverses the elements', () => {
      expect(arrayToReversed.call([1, 2, 3])).toEqual([3, 2, 1]);
    });

    it('returns an empty array for an empty array', () => {
      expect(arrayToReversed.call([])).toEqual([]);
    });

    it('handles a single element', () => {
      expect(arrayToReversed.call([42])).toEqual([42]);
    });
  });

  describe('non-mutating', () => {
    it('does not mutate the original', () => {
      const arr = [1, 2, 3];
      const out = arrayToReversed.call(arr);
      expect(arr).toEqual([1, 2, 3]);
      expect(out).not.toBe(arr);
    });
  });

  describe('holes', () => {
    it('materializes holes as undefined (dense output)', () => {
      // eslint-disable-next-line no-sparse-arrays
      const out = arrayToReversed.call([1, , 3]);
      expect(out).toEqual([3, undefined, 1]);
      expect(0 in out).toBe(true);
      expect(1 in out).toBe(true);
    });
  });

  describe('length coercion (ToLength)', () => {
    it('floors a fractional length', () => {
      const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 2.9 };
      expect(arrayToReversed.call(arrayLike as any)).toEqual(['b', 'a']);
    });

    it('returns empty for a negative length', () => {
      expect(arrayToReversed.call({ length: -1, 0: 'a' } as any)).toEqual([]);
    });

    it('returns empty for a NaN length', () => {
      expect(arrayToReversed.call({ length: NaN, 0: 'a' } as any)).toEqual([]);
    });
  });

  describe('generic application', () => {
    it('works on a string-keyed array-like via .call', () => {
      const arrayLike = { 0: 'x', 1: 'y', 2: 'z', length: 3 };
      expect(arrayToReversed.call(arrayLike as any)).toEqual(['z', 'y', 'x']);
    });
  });

  describe('parity vs native', () => {
    it('matches native on a typical array', () => {
      const arr = [1, 2, 3, 4, 5];
      const native = (Array.prototype as any).toReversed;
      const nativeResult = native.call(arr);
      const specResult = arrayToReversed.call(arr);
      expect(specResult).toEqual(nativeResult);
    });
  });
});
