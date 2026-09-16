import { arrayOf } from '../src/modules/es.array.of.js';


/**
 * test262-derived conformance suite for the Array.of polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Array/of/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/of
 *
 * Array.of is ES2015 (stable since), absent below the floor (Chrome < 45 /
 * Safari < 9), so the polyfill always installs there.
 *
 *   - returns a real Array
 *   - a single numeric argument yields a one-element array [n] — the whole point
 *     vs `new Array(n)`, which makes an empty array of length n
 *   - all arguments are kept in order; count is the array length
 *   - no arguments yields an empty array
 *   - every argument (including null/undefined) becomes a real entry
 */
describe('Array.of — test262 conformance', () => {
  describe('return value', () => {
    it('returns a real Array', () => {
      expect(Array.isArray(arrayOf(1, 2, 3))).toBe(true);
    });

    it('keeps all arguments in order', () => {
      expect(arrayOf(1, 2, 3)).toEqual([1, 2, 3]);
    });

    it('returns an empty array for no arguments', () => {
      expect(arrayOf()).toEqual([]);
    });
  });

  describe('single numeric argument (vs new Array(n))', () => {
    it('makes a one-element array, not a length-n empty array', () => {
      const out = arrayOf(7);
      expect(out).toEqual([7]);
      expect(out.length).toBe(1);
      // contrast: new Array(7) is an empty array of length 7
      expect(new Array(7).length).toBe(7);
      expect(7 in new Array(7)).toBe(false);
    });
  });

  describe('argument handling', () => {
    it('preserves mixed types', () => {
      expect(arrayOf(1, 'two', true, null)).toEqual([1, 'two', true, null]);
    });

    it('keeps null/undefined as real entries', () => {
      const out = arrayOf(undefined, null);
      expect(out.length).toBe(2);
      expect(0 in out).toBe(true);
      expect(1 in out).toBe(true);
      expect(out[0]).toBeUndefined();
      expect(out[1]).toBeNull();
    });
  });

  describe('KNOWN LIMITATIONS (documented divergence from spec)', () => {
    // Spec: Array.of is generic — called as C.of() with `this` a constructor, it
    // builds an instance of C. This polyfill always returns a plain Array.
    // Out of scope for the TV runtime. Asserted so the gap is explicit.
    it('always returns a plain Array, ignoring a subclass `this`', () => {
      class MyArray extends Array {}
      const out = (arrayOf as any).call(MyArray, 1, 2);
      expect(out instanceof MyArray).toBe(false);
      expect(Array.isArray(out)).toBe(true);
      expect(out).toEqual([1, 2]);
    });
  });

  describe('parity vs native', () => {
    it('matches native for a mix of arguments', () => {
      const nativeResult = Array.of<unknown>(1, 'two', null, undefined);
      const specResult = arrayOf(1, 'two', null, undefined);
      expect(specResult).toEqual(nativeResult);
    });
  });
});
