import { objectIs } from '../src/modules/es.object.is.js';


/**
 * test262-derived conformance suite for the Object.is polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Object/is/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Object/is
 *
 * Object.is implements SameValue, which differs from === in exactly two places:
 * NaN is equal to NaN, and +0 is NOT equal to -0. Everything else matches
 * strict equality. The impl was verified correct — this suite locks it in.
 */
describe('Object.is — test262 conformance', () => {
  describe('return value', () => {
    it('returns a boolean', () => {
      expect(typeof objectIs(1, 1)).toBe('boolean');
    });
  });

  describe('differs from strict equality', () => {
    it('treats NaN as equal to NaN (=== would be false)', () => {
      expect(objectIs(NaN, NaN)).toBe(true);
    });

    it('treats +0 and -0 as different (=== would be true)', () => {
      expect(objectIs(0, -0)).toBe(false);
      expect(objectIs(-0, 0)).toBe(false);
    });

    it('treats +0/+0 and -0/-0 as equal', () => {
      expect(objectIs(0, 0)).toBe(true);
      expect(objectIs(-0, -0)).toBe(true);
    });
  });

  describe('matches strict equality elsewhere', () => {
    it('compares numbers', () => {
      expect(objectIs(1, 1)).toBe(true);
      expect(objectIs(1, 2)).toBe(false);
      expect(objectIs(Infinity, Infinity)).toBe(true);
      expect(objectIs(Infinity, -Infinity)).toBe(false);
    });

    it('compares strings', () => {
      expect(objectIs('foo', 'foo')).toBe(true);
      expect(objectIs('foo', 'bar')).toBe(false);
    });

    it('compares booleans', () => {
      expect(objectIs(true, true)).toBe(true);
      expect(objectIs(true, false)).toBe(false);
    });

    it('handles null and undefined', () => {
      expect(objectIs(null, null)).toBe(true);
      expect(objectIs(undefined, undefined)).toBe(true);
      expect(objectIs(null, undefined)).toBe(false);
    });

    it('does not coerce across types', () => {
      expect(objectIs(0, '0' as any)).toBe(false);
      expect(objectIs(0, false as any)).toBe(false);
      expect(objectIs('', false as any)).toBe(false);
    });
  });

  describe('object references', () => {
    it('compares by reference identity', () => {
      const obj = {};
      expect(objectIs(obj, obj)).toBe(true);
      expect(objectIs({}, {})).toBe(false);
    });
  });

  describe('parity vs native', () => {
    it('matches native across the SameValue edge cases', () => {
      const native = Object.is;
      const nativeResult = native(NaN, NaN) && !native(0, -0);
      const specResult = objectIs(NaN, NaN) && !objectIs(0, -0);
      expect(specResult).toBe(nativeResult);
    });
  });
});
