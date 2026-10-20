import { numberIsInteger } from '../src/modules/es.number.is-integer.js';


/**
 * test262-derived conformance suite for the Number.isInteger polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Number/isInteger/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Number/isInteger
 *
 * Number.isInteger does NOT coerce: only a finite number value with no
 * fractional part returns true. Non-numbers, NaN, the infinities, and
 * fractional numbers all return false.
 */
describe('Number.isInteger — test262 conformance', () => {
  it('returns true for integer-valued numbers', () => {
    const integers = [0, -0, 1, -1, 100, -100, Number.MAX_SAFE_INTEGER, 2 ** 53];
    for (let i = 0; i < integers.length; i++) {
      expect(numberIsInteger(integers[i])).toBe(true);
    }
  });

  it('returns true for integral floats (e.g. 5.0)', () => {
    expect(numberIsInteger(5.0)).toBe(true);
    expect(numberIsInteger(-12.0)).toBe(true);
  });

  it('returns false for fractional numbers', () => {
    const fractions = [0.5, -0.5, 3.14, -3.14, Number.MIN_VALUE, 1.0000001];
    for (let i = 0; i < fractions.length; i++) {
      expect(numberIsInteger(fractions[i])).toBe(false);
    }
  });

  it('returns false for NaN and the infinities', () => {
    expect(numberIsInteger(NaN)).toBe(false);
    expect(numberIsInteger(Infinity)).toBe(false);
    expect(numberIsInteger(-Infinity)).toBe(false);
  });

  describe('no coercion', () => {
    it('returns false for non-numbers, including numeric strings', () => {
      const nonNumbers: any[] = [
        '1',
        '0',
        '',
        undefined,
        null,
        true,
        false,
        {},
        [],
        () => 0,
        Symbol('s'),
      ];
      for (let i = 0; i < nonNumbers.length; i++) {
        expect(numberIsInteger(nonNumbers[i])).toBe(false);
      }
    });

    it('returns false for objects whose valueOf would coerce to an integer', () => {
      const obj = { valueOf: () => 1 };
      expect(numberIsInteger(obj as any)).toBe(false);
    });
  });

  describe('parity vs native', () => {
    it('matches native across a mixed set', () => {
      const inputs: any[] = [0, 1.5, NaN, Infinity, '1', null, 2 ** 53];
      for (let i = 0; i < inputs.length; i++) {
        expect(numberIsInteger(inputs[i])).toBe(Number.isInteger(inputs[i]));
      }
    });
  });
});
