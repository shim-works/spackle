import { arrayIncludes } from '../src/modules/es.array.includes.js';


/**
 * test262-derived conformance suite for the Array.prototype.includes polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Array/prototype/includes/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype/includes
 *
 *   - returns a boolean
 *   - element compared by SameValueZero: NaN matches NaN (unlike indexOf), and
 *     -0 matches +0
 *   - fromIndex coerced via ToInteger: NaN -> 0, fractions truncated toward
 *     zero, negatives count from the end and clamp to 0
 *   - length coerced via ToLength: negative/NaN length -> empty (no scan)
 *   - holes are visited as undefined (unlike indexOf, which skips them)
 *   - generic: works on array-likes via .call
 *
 * The polyfill is exported as a standalone function and invoked with .call,
 * exactly as load.ts installs it onto Array.prototype.
 */
describe('Array.prototype.includes — test262 conformance', () => {
  describe('return value', () => {
    it('returns a boolean', () => {
      expect(arrayIncludes.call([1], 1)).toBe(true);
      expect(arrayIncludes.call([1], 2)).toBe(false);
    });
  });

  describe('SameValueZero matching', () => {
    it('finds an element by strict equality', () => {
      expect(arrayIncludes.call([1, 2, 3], 2)).toBe(true);
      expect(arrayIncludes.call(['a', 'b'], 'b')).toBe(true);
    });

    it('returns false for a missing element', () => {
      expect(arrayIncludes.call([1, 2, 3], 5)).toBe(false);
    });

    it('finds NaN (SameValueZero — unlike indexOf)', () => {
      expect(arrayIncludes.call([1, NaN, 3], NaN)).toBe(true);
      // contrast: indexOf uses === and cannot find NaN
      expect([1, NaN, 3].indexOf(NaN)).toBe(-1);
    });

    it('treats -0 and +0 as equal', () => {
      expect(arrayIncludes.call([-0], 0)).toBe(true);
      expect(arrayIncludes.call([0], -0)).toBe(true);
    });

    it('does not coerce types (strict)', () => {
      expect(arrayIncludes.call([1, 2, 3], '2')).toBe(false);
    });
  });

  describe('fromIndex (ToInteger)', () => {
    it('respects a positive fromIndex', () => {
      expect(arrayIncludes.call([1, 2, 3, 4], 1, 1)).toBe(false);
      expect(arrayIncludes.call([1, 2, 3, 4], 3, 1)).toBe(true);
    });

    it('counts a negative fromIndex from the end', () => {
      expect(arrayIncludes.call([1, 2, 3, 4], 3, -2)).toBe(true);
      expect(arrayIncludes.call([1, 2, 3, 4], 1, -2)).toBe(false);
    });

    it('clamps a large negative fromIndex to 0', () => {
      expect(arrayIncludes.call([1, 2, 3], 1, -100)).toBe(true);
    });

    it('returns false when fromIndex is past the end', () => {
      expect(arrayIncludes.call([1, 2, 3], 3, 5)).toBe(false);
    });

    it('treats NaN fromIndex as 0', () => {
      expect(arrayIncludes.call([1, 2, 3], 1, NaN)).toBe(true);
    });

    it('truncates a fractional fromIndex toward zero', () => {
      expect(arrayIncludes.call([1, 2, 3, 4], 1, 0.9)).toBe(true);
      expect(arrayIncludes.call([1, 2, 3, 4], 2, 1.5)).toBe(true);
      expect(arrayIncludes.call([1, 2, 3, 4], 1, 1.5)).toBe(false);
    });

    it('handles a fromIndex of 0', () => {
      expect(arrayIncludes.call([1, 2, 3], 1, 0)).toBe(true);
    });
  });

  describe('length coercion (ToLength)', () => {
    it('returns false for an empty array', () => {
      expect(arrayIncludes.call([], 1)).toBe(false);
    });

    it('treats a negative length as empty (no scan, no hang)', () => {
      expect(arrayIncludes.call({ length: -1, 0: 'a' } as any, 'a')).toBe(false);
    });

    it('treats a NaN length as empty', () => {
      expect(arrayIncludes.call({ length: NaN, 0: 'a' } as any, 'a')).toBe(false);
    });

    it('coerces a string length', () => {
      expect(arrayIncludes.call({ length: '2', 0: 'a', 1: 'b' } as any, 'b')).toBe(
        true,
      );
    });
  });

  describe('holes', () => {
    it('visits holes as undefined (unlike indexOf)', () => {
      // eslint-disable-next-line no-sparse-arrays
      const sparse = [1, , 3];
      expect(arrayIncludes.call(sparse, undefined)).toBe(true);
      // contrast: indexOf skips holes
      // eslint-disable-next-line no-sparse-arrays
      expect([1, , 3].indexOf(undefined)).toBe(-1);
    });
  });

  describe('generic application (array-likes)', () => {
    it('works on a string-keyed array-like via .call', () => {
      const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
      expect(arrayIncludes.call(arrayLike as any, 'c')).toBe(true);
      expect(arrayIncludes.call(arrayLike as any, 'z')).toBe(false);
    });
  });

  describe('parity vs native', () => {
    it('matches native scanning for an element', () => {
      const arr = [1, 2, 3, NaN, 5];
      const native = Array.prototype.includes;
      const nativeResult = native.call(arr, NaN);
      const specResult = arrayIncludes.call(arr, NaN);
      expect(specResult).toBe(nativeResult);
    });
  });
});
