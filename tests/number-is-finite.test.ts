import { numberIsFinite } from '../src/modules/es.number.is-finite.js';


/**
 * test262-derived conformance suite for the Number.isFinite polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Number/isFinite/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Number/isFinite
 *
 * The defining property vs the global isFinite: Number.isFinite does NOT coerce
 * its argument. Only finite number values return true; non-numbers (even the
 * string "1") return false.
 */
describe('Number.isFinite — test262 conformance', () => {
  it('returns true for finite numbers', () => {
    const finite = [0, -0, 1, -1, 3.14, -3.14, Number.MAX_VALUE, Number.MIN_VALUE];
    for (let i = 0; i < finite.length; i++) {
      expect(numberIsFinite(finite[i])).toBe(true);
    }
  });

  it('returns false for NaN and the infinities', () => {
    expect(numberIsFinite(NaN)).toBe(false);
    expect(numberIsFinite(Infinity)).toBe(false);
    expect(numberIsFinite(-Infinity)).toBe(false);
  });

  describe('no coercion (the global-isFinite divergence)', () => {
    // global isFinite('1') === true because it coerces; Number.isFinite must not.
    it('returns false for non-numbers, including numeric strings', () => {
      const nonNumbers: any[] = [
        '1',
        '0',
        '',
        'foo',
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
        expect(numberIsFinite(nonNumbers[i])).toBe(false);
      }
    });

    it('returns false for objects whose valueOf would coerce to a finite number', () => {
      const obj = { valueOf: () => 1 };
      expect(numberIsFinite(obj as any)).toBe(false);
    });
  });

  describe('parity vs native', () => {
    it('matches native across a mixed set', () => {
      const inputs: any[] = [0, NaN, Infinity, '1', null, {}];
      for (let i = 0; i < inputs.length; i++) {
        expect(numberIsFinite(inputs[i])).toBe(Number.isFinite(inputs[i]));
      }
    });
  });
});
