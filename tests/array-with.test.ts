import { arrayWith } from '../src/modules/es.array.with.js';


/**
 * test262-derived conformance suite for the Array.prototype.with polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/Array/prototype/with/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype/with
 *
 * with is ES2023 (Chrome 110 / Safari 16) — far above the floor, so the
 * polyfill always installs; the probe is purely defensive.
 *
 * Non-mutating single-element replace:
 *
 *   - returns a copy with index replaced by value, original untouched
 *   - negative index counts from the end
 *   - out-of-range index (either direction) throws RangeError
 *   - holes elsewhere materialize as undefined (dense output)
 *   - index coerced via ToIntegerOrInfinity (fractional floored toward zero)
 *   - generic via .call on an array-like
 */
describe('Array.prototype.with — test262 conformance', () => {
  describe('basic replace', () => {
    it('replaces the element at a positive index', () => {
      expect(arrayWith.call([1, 2, 3], 1, 'x')).toEqual([1, 'x', 3]);
    });

    it('replaces the first and last elements', () => {
      expect(arrayWith.call([1, 2, 3], 0, 'a')).toEqual(['a', 2, 3]);
      expect(arrayWith.call([1, 2, 3], 2, 'c')).toEqual([1, 2, 'c']);
    });
  });

  describe('negative index', () => {
    it('counts from the end', () => {
      expect(arrayWith.call([1, 2, 3], -1, 'z')).toEqual([1, 2, 'z']);
    });

    it('the most-negative in-range index hits index 0', () => {
      expect(arrayWith.call([1, 2, 3], -3, 'a')).toEqual(['a', 2, 3]);
    });
  });

  describe('out-of-range throws RangeError', () => {
    it('throws for an index at length', () => {
      expect(() => arrayWith.call([1, 2, 3], 3, 'x')).toThrow(RangeError);
    });

    it('throws for an index past length', () => {
      expect(() => arrayWith.call([1, 2, 3], 99, 'x')).toThrow(RangeError);
    });

    it('throws for a negative index past the start', () => {
      expect(() => arrayWith.call([1, 2, 3], -4, 'x')).toThrow(RangeError);
    });

    it('throws on an empty array', () => {
      expect(() => arrayWith.call([], 0, 'x')).toThrow(RangeError);
    });
  });

  describe('non-mutating + holes', () => {
    it('does not mutate the original', () => {
      const arr = [1, 2, 3];
      const out = arrayWith.call(arr, 1, 'x');
      expect(arr).toEqual([1, 2, 3]);
      expect(out).not.toBe(arr);
    });

    it('materializes other holes as undefined (dense output)', () => {
      // eslint-disable-next-line no-sparse-arrays
      const out = arrayWith.call([1, , 3], 0, 'a');
      expect(out).toEqual(['a', undefined, 3]);
      expect(1 in out).toBe(true);
    });
  });

  describe('index coercion (ToIntegerOrInfinity)', () => {
    it('floors a fractional index toward zero', () => {
      expect(arrayWith.call([1, 2, 3], 1.9, 'x')).toEqual([1, 'x', 3]);
    });
  });

  describe('length coercion (ToLength)', () => {
    it('floors a fractional length', () => {
      const arrayLike = { 0: 1, 1: 2, 2: 99, length: 2.9 };
      expect(arrayWith.call(arrayLike as any, 0, 'a')).toEqual(['a', 2]);
    });
  });

  describe('generic application', () => {
    it('works on a string-keyed array-like via .call', () => {
      const arrayLike = { 0: 1, 1: 2, 2: 3, length: 3 };
      expect(arrayWith.call(arrayLike as any, 1, 'x')).toEqual([1, 'x', 3]);
    });
  });

  describe('parity vs native', () => {
    it('matches native on a mid replace', () => {
      const arr = [1, 2, 3, 4, 5];
      const native = (Array.prototype as any).with;
      const nativeResult = native.call(arr, 2, 'x');
      const specResult = arrayWith.call(arr, 2, 'x');
      expect(specResult).toEqual(nativeResult);
    });
  });
});
