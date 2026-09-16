import { mathTrunc } from '../src/modules/es.math.trunc.js';

/**
 * test262-derived conformance suite for Math.trunc. Its sibling ES2015 Math
 * islands are covered in math-sign.test.ts and math-hyperbolic.test.ts.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Math/trunc/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Math
 */
describe('Math (ES2015) — test262 conformance', () => {
  describe('trunc', () => {
    it('rounds toward zero for both signs', () => {
      expect(mathTrunc(4.7)).toBe(4);
      expect(mathTrunc(-4.7)).toBe(-4);
      expect(mathTrunc(0.5)).toBe(0);
      expect(mathTrunc(-0.5)).toBe(-0);
    });
    it('passes NaN / ±Infinity / ±0 through (preserving -0)', () => {
      expect(mathTrunc(NaN)).toBeNaN();
      expect(mathTrunc(Infinity)).toBe(Infinity);
      expect(mathTrunc(-Infinity)).toBe(-Infinity);
      expect(Object.is(mathTrunc(-0), -0)).toBe(true);
    });
    it('matches native', () => {
      const xs = [4.7, -4.7, 0.5, -0.9, 100, -100.999];
      for (let i = 0; i < xs.length; i++) {
        expect(mathTrunc(xs[i])).toBe(Math.trunc(xs[i]));
      }
    });
  });
});
