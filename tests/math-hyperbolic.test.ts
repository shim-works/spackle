import { mathAcosh } from '../src/modules/es.math.acosh.js';
import { mathAsinh } from '../src/modules/es.math.asinh.js';
import { mathAtanh } from '../src/modules/es.math.atanh.js';
import { mathCosh } from '../src/modules/es.math.cosh.js';
import { mathExpm1 } from '../src/modules/es.math.expm1.js';
import { mathLog1p } from '../src/modules/es.math.log1p.js';
import { mathSinh } from '../src/modules/es.math.sinh.js';
import { mathTanh } from '../src/modules/es.math.tanh.js';

/**
 * test262-derived conformance suite for the ES2015 Math exponential /
 * logarithmic / hyperbolic islands: expm1, log1p, sinh, cosh, tanh,
 * asinh, acosh, atanh.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Math/{expm1,log1p,sinh,cosh,tanh,asinh,acosh,atanh}/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Math
 */
describe('Math hyperbolic/log (ES2015) — test262 conformance', () => {
  describe('expm1', () => {
    it('passes NaN / ±0 / ±Infinity through (preserving -0)', () => {
      expect(mathExpm1(NaN)).toBeNaN();
      expect(Object.is(mathExpm1(0), 0)).toBe(true);
      expect(Object.is(mathExpm1(-0), -0)).toBe(true);
      expect(mathExpm1(Infinity)).toBe(Infinity);
      expect(mathExpm1(-Infinity)).toBe(-1);
    });
    it('keeps precision for tiny x where exp(x)-1 collapses', () => {
      // naive exp(1e-10)-1 loses digits; expm1 must stay ~1e-10
      expect(mathExpm1(1e-10)).toBeCloseTo(1e-10, 15);
    });
    it('matches native', () => {
      const xs = [1, -1, 0.5, -0.5, 10, -10, 1e-10];
      for (let i = 0; i < xs.length; i++) {
        expect(mathExpm1(xs[i])).toBeCloseTo(Math.expm1(xs[i]), 10);
      }
    });
  });

  describe('log1p', () => {
    it('handles the domain edges', () => {
      expect(mathLog1p(NaN)).toBeNaN();
      expect(mathLog1p(-2)).toBeNaN(); // x < -1 out of domain
      expect(mathLog1p(-1)).toBe(-Infinity);
      expect(Object.is(mathLog1p(0), 0)).toBe(true);
      expect(Object.is(mathLog1p(-0), -0)).toBe(true);
      expect(mathLog1p(Infinity)).toBe(Infinity);
    });
    it('keeps precision for tiny x where log(1+x) collapses', () => {
      expect(mathLog1p(1e-10)).toBeCloseTo(1e-10, 15);
    });
    it('matches native', () => {
      const xs = [1, -0.5, 0.5, 10, 1e-10, Math.E - 1];
      for (let i = 0; i < xs.length; i++) {
        expect(mathLog1p(xs[i])).toBeCloseTo(Math.log1p(xs[i]), 10);
      }
    });
  });

  describe('sinh', () => {
    it('passes NaN / ±0 / ±Infinity through (preserving -0)', () => {
      expect(mathSinh(NaN)).toBeNaN();
      expect(Object.is(mathSinh(0), 0)).toBe(true);
      expect(Object.is(mathSinh(-0), -0)).toBe(true);
      expect(mathSinh(Infinity)).toBe(Infinity);
      expect(mathSinh(-Infinity)).toBe(-Infinity);
    });
    it('is odd: sinh(-x) === -sinh(x)', () => {
      expect(mathSinh(-2)).toBeCloseTo(-mathSinh(2), 10);
    });
    it('matches native', () => {
      const xs = [1, -1, 0.5, -0.5, 5, -5, 1e-5];
      for (let i = 0; i < xs.length; i++) {
        expect(mathSinh(xs[i])).toBeCloseTo(Math.sinh(xs[i]), 10);
      }
    });
  });

  describe('cosh', () => {
    it('handles the edges (even function, minimum 1)', () => {
      expect(mathCosh(NaN)).toBeNaN();
      expect(mathCosh(0)).toBe(1);
      expect(mathCosh(-0)).toBe(1);
      expect(mathCosh(Infinity)).toBe(Infinity);
      expect(mathCosh(-Infinity)).toBe(Infinity);
    });
    it('matches native', () => {
      const xs = [1, -1, 0.5, -0.5, 5, -5, 10];
      for (let i = 0; i < xs.length; i++) {
        expect(mathCosh(xs[i])).toBeCloseTo(Math.cosh(xs[i]), 10);
      }
    });
  });

  describe('tanh', () => {
    it('handles the edges (saturates to ±1)', () => {
      expect(mathTanh(NaN)).toBeNaN();
      expect(Object.is(mathTanh(0), 0)).toBe(true);
      expect(Object.is(mathTanh(-0), -0)).toBe(true);
      expect(mathTanh(Infinity)).toBe(1);
      expect(mathTanh(-Infinity)).toBe(-1);
    });
    it('matches native', () => {
      const xs = [1, -1, 0.5, -0.5, 5, -5, 100, -100];
      for (let i = 0; i < xs.length; i++) {
        expect(mathTanh(xs[i])).toBeCloseTo(Math.tanh(xs[i]), 10);
      }
    });
  });

  describe('asinh', () => {
    it('passes NaN / ±0 / ±Infinity through (preserving -0)', () => {
      expect(mathAsinh(NaN)).toBeNaN();
      expect(Object.is(mathAsinh(0), 0)).toBe(true);
      expect(Object.is(mathAsinh(-0), -0)).toBe(true);
      expect(mathAsinh(Infinity)).toBe(Infinity);
      expect(mathAsinh(-Infinity)).toBe(-Infinity);
    });
    it('matches native', () => {
      const xs = [1, -1, 0.5, -0.5, 100, -100, 1e10];
      for (let i = 0; i < xs.length; i++) {
        expect(mathAsinh(xs[i])).toBeCloseTo(Math.asinh(xs[i]), 10);
      }
    });
  });

  describe('acosh', () => {
    it('handles the domain edges (x < 1 is NaN)', () => {
      expect(mathAcosh(NaN)).toBeNaN();
      expect(mathAcosh(0.999)).toBeNaN();
      expect(mathAcosh(-1)).toBeNaN();
      expect(mathAcosh(1)).toBe(0);
      expect(mathAcosh(Infinity)).toBe(Infinity);
    });
    it('matches native (including huge x where x*x would overflow)', () => {
      const xs = [1, 1.5, 2, 10, 1e5, 1e155, 1e300];
      for (let i = 0; i < xs.length; i++) {
        expect(mathAcosh(xs[i])).toBeCloseTo(Math.acosh(xs[i]), 10);
      }
    });
  });

  describe('atanh', () => {
    it('handles the domain edges (|x| > 1 is NaN, ±1 is ±Infinity)', () => {
      expect(mathAtanh(NaN)).toBeNaN();
      expect(mathAtanh(2)).toBeNaN();
      expect(mathAtanh(-2)).toBeNaN();
      expect(mathAtanh(1)).toBe(Infinity);
      expect(mathAtanh(-1)).toBe(-Infinity);
      expect(Object.is(mathAtanh(0), 0)).toBe(true);
      expect(Object.is(mathAtanh(-0), -0)).toBe(true);
    });
    it('matches native', () => {
      const xs = [0.5, -0.5, 0.9, -0.9, 0.99999, 1e-10];
      for (let i = 0; i < xs.length; i++) {
        expect(mathAtanh(xs[i])).toBeCloseTo(Math.atanh(xs[i]), 10);
      }
    });
  });
});
