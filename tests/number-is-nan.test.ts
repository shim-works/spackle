import { numberIsNaN } from '../src/modules/es.number.is-nan.js';


/**
 * test262-derived conformance suite for the Number.isNaN polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Number/isNaN/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Number/isNaN
 *
 * The defining property vs the global isNaN: Number.isNaN does NOT coerce its
 * argument. Only the actual number value NaN returns true; every non-number
 * (including the string "NaN") returns false.
 */
describe('Number.isNaN — test262 conformance', () => {
  it('returns true only for the number NaN', () => {
    expect(numberIsNaN(NaN)).toBe(true);
    expect(numberIsNaN(Number.NaN)).toBe(true);
    expect(numberIsNaN(0 / 0)).toBe(true);
  });

  it('returns false for finite and infinite numbers', () => {
    const finite = [0, -0, 1, -1, 3.14, -3.14, Number.MAX_VALUE, Number.MIN_VALUE];
    for (let i = 0; i < finite.length; i++) {
      expect(numberIsNaN(finite[i])).toBe(false);
    }
    expect(numberIsNaN(Infinity)).toBe(false);
    expect(numberIsNaN(-Infinity)).toBe(false);
  });

  describe('no coercion (the global-isNaN divergence)', () => {
    // global isNaN('NaN') === true because it coerces; Number.isNaN must not.
    it('returns false for the string "NaN" and other non-numbers', () => {
      const nonNumbers: any[] = [
        'NaN',
        'foo',
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
        expect(numberIsNaN(nonNumbers[i])).toBe(false);
      }
    });

    it('returns false for objects whose valueOf would coerce to NaN', () => {
      const obj = { valueOf: () => NaN };
      expect(numberIsNaN(obj as any)).toBe(false);
    });
  });

  describe('parity vs native', () => {
    it('matches native across a mixed set', () => {
      const inputs: any[] = [NaN, 0, Infinity, 'NaN', null, {}];
      for (let i = 0; i < inputs.length; i++) {
        expect(numberIsNaN(inputs[i])).toBe(Number.isNaN(inputs[i]));
      }
    });
  });
});
