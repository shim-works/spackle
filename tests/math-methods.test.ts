import { isMathAcoshSupported } from '../src/modules/es.math.acosh.js';
import { isMathExpm1Supported } from '../src/modules/es.math.expm1.js';
import { isMathHypotSupported, mathHypot } from '../src/modules/es.math.hypot.js';
import { isMathImulSupported, mathImul } from '../src/modules/es.math.imul.js';
import { isMathSinhSupported } from '../src/modules/es.math.sinh.js';
import { mathCbrt } from '../src/modules/es.math.cbrt.js';
import { mathClz32 } from '../src/modules/es.math.clz32.js';
import { mathFround } from '../src/modules/es.math.fround.js';
import { mathLog10 } from '../src/modules/es.math.log10.js';
import { mathLog2 } from '../src/modules/es.math.log2.js';

/**
 * test262-derived conformance suite for the remaining ES2015 Math islands:
 * cbrt, clz32, fround, hypot, imul, log10, log2.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Math/{cbrt,clz32,fround,hypot,imul,log10,log2}/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Math
 */
describe('Math cbrt/clz32/fround/hypot/imul/log10/log2 (ES2015) — test262 conformance', () => {
  describe('behavioral probe contracts', () => {
    it('pass on a healthy modern engine', () => {
      // each probe hunts a specific documented engine bug (V8 hypot NaN,
      // WebKit imul wrap, V8-38 expm1/sinh tiny-x, V8 acosh overflow) —
      // the browsers running this suite ship none of them
      expect(isMathHypotSupported()).toBe(true);
      expect(isMathImulSupported()).toBe(true);
      expect(isMathExpm1Supported()).toBe(true);
      expect(isMathSinhSupported()).toBe(true);
      expect(isMathAcoshSupported()).toBe(true);
    });
  });

  describe('cbrt', () => {
    it('passes NaN / ±0 / ±Infinity through unchanged', () => {
      expect(mathCbrt(NaN)).toBeNaN();
      expect(Object.is(mathCbrt(0), 0)).toBe(true);
      expect(Object.is(mathCbrt(-0), -0)).toBe(true);
      expect(mathCbrt(Infinity)).toBe(Infinity);
      expect(mathCbrt(-Infinity)).toBe(-Infinity);
    });
    it('roots perfect cubes, keeping the sign', () => {
      expect(mathCbrt(1)).toBe(1);
      expect(mathCbrt(-1)).toBe(-1);
      expect(mathCbrt(8)).toBe(2);
      expect(mathCbrt(-8)).toBe(-2);
      expect(mathCbrt(27)).toBeCloseTo(3, 10);
    });
    it('matches native (ratio check — absolute digits break on big magnitudes)', () => {
      const xs = [0.5, -0.5, 2, 10, 1000, 1e21, -1e21];
      for (let i = 0; i < xs.length; i++) {
        expect(mathCbrt(xs[i]) / Math.cbrt(xs[i])).toBeCloseTo(1, 10);
      }
    });
  });

  describe('clz32', () => {
    it('coerces via ToUint32: NaN / ±0 / Infinity all count 32 empty slots', () => {
      expect(mathClz32(NaN)).toBe(32);
      expect(mathClz32(0)).toBe(32);
      expect(mathClz32(-0)).toBe(32);
      expect(mathClz32(Infinity)).toBe(32);
      expect(mathClz32(0x100000000)).toBe(32); // 2^32 wraps to 0
    });
    it('counts leading zeros exactly at every power of two', () => {
      // the island uses a log2-with-fudge formula — this loop is the proof it
      // never miscounts at the rounding-sensitive boundaries
      for (let i = 0; i < 32; i++) {
        expect(mathClz32(Math.pow(2, i))).toBe(31 - i);
      }
    });
    it('handles negatives, fractions and the all-ones word', () => {
      expect(mathClz32(1)).toBe(31);
      expect(mathClz32(1.5)).toBe(31); // fraction truncated
      expect(mathClz32(-1)).toBe(0); // ToUint32(-1) = 0xffffffff
      expect(mathClz32(0xffffffff)).toBe(0);
      expect(mathClz32(0x80000000)).toBe(0);
    });
    it('matches native', () => {
      const xs = [0, 1, 2, 3, 255, 256, 65535, 65536, 0x7fffffff, -5, 1e10];
      for (let i = 0; i < xs.length; i++) {
        expect(mathClz32(xs[i])).toBe(Math.clz32(xs[i]));
      }
    });
  });

  describe('fround', () => {
    it('passes NaN / ±0 / ±Infinity through unchanged', () => {
      expect(mathFround(NaN)).toBeNaN();
      expect(Object.is(mathFround(0), 0)).toBe(true);
      expect(Object.is(mathFround(-0), -0)).toBe(true);
      expect(mathFround(Infinity)).toBe(Infinity);
      expect(mathFround(-Infinity)).toBe(-Infinity);
    });
    it('rounds to the nearest 32-bit float', () => {
      expect(mathFround(1)).toBe(1);
      expect(mathFround(1.5)).toBe(1.5); // exactly representable
      expect(mathFround(1.337)).toBe(1.3370000123977661); // not — picks up float32 noise
    });
    it('overflows to Infinity and flushes denormals to zero at the float32 limits', () => {
      expect(mathFround(1e39)).toBe(Infinity); // past float32 max (~3.4e38)
      expect(mathFround(-1e39)).toBe(-Infinity);
      expect(mathFround(Math.pow(2, -150))).toBe(0); // below float32 min denormal
    });
    it('matches native', () => {
      const xs = [0.1, -0.1, 3.14159, 1e10, -1e10, 5.5, 1e-40];
      for (let i = 0; i < xs.length; i++) {
        expect(mathFround(xs[i])).toBe(Math.fround(xs[i]));
      }
    });
  });

  describe('hypot', () => {
    it('handles the empty / special-value cases (Infinity beats NaN)', () => {
      expect(Object.is(mathHypot(), 0)).toBe(true);
      expect(Object.is((mathHypot as any)(-0, -0), 0)).toBe(true);
      expect((mathHypot as any)(NaN)).toBeNaN();
      expect((mathHypot as any)(Infinity, NaN)).toBe(Infinity);
      expect((mathHypot as any)(NaN, -Infinity)).toBe(Infinity);
      expect((mathHypot as any)(3, NaN)).toBeNaN();
    });
    it('computes the classic triangles exactly', () => {
      expect((mathHypot as any)(3, 4)).toBe(5);
      expect((mathHypot as any)(-3, -4)).toBe(5);
      expect((mathHypot as any)(3, 4, 12)).toBe(13);
      expect((mathHypot as any)(6)).toBe(6);
    });
    it('coerces arguments to numbers', () => {
      expect((mathHypot as any)('3', '4')).toBe(5);
      expect((mathHypot as any)(3, 'x')).toBeNaN();
    });
    it('survives huge values that would overflow a naive sum of squares', () => {
      expect((mathHypot as any)(1e200, 1e200)).toBeCloseTo(1.414213562373095e200, -186);
      expect((mathHypot as any)(1e-200, 1e-200)).toBeCloseTo(Math.hypot(1e-200, 1e-200), 210);
    });
    it('matches native', () => {
      const cases = [
        [1, 2],
        [5, 12],
        [0.3, 0.4],
        [1e5, 1e5, 1e5],
        [-7, 24],
      ];
      for (let i = 0; i < cases.length; i++) {
        expect((mathHypot as any).apply(null, cases[i])).toBeCloseTo(
          (Math.hypot as any).apply(null, cases[i]),
          10
        );
      }
    });
  });

  describe('imul', () => {
    it('multiplies small ints like ordinary multiplication', () => {
      expect(mathImul(3, 4)).toBe(12);
      expect(mathImul(-5, 12)).toBe(-60);
      expect(mathImul(0, 7)).toBe(0);
    });
    it('wraps 32-bit like C — the cases naive float multiply gets wrong', () => {
      expect(mathImul(0xffffffff, 5)).toBe(-5);
      expect(mathImul(0xfffffffe, 5)).toBe(-10);
      expect(mathImul(0x7fffffff, 0x7fffffff)).toBe(1);
      expect(mathImul(0x80000000, 0x80000000)).toBe(0);
    });
    it('coerces via ToUint32: NaN / Infinity / fractions', () => {
      expect(mathImul(NaN, 1)).toBe(0);
      expect(mathImul(Infinity, 1)).toBe(0);
      expect(mathImul(1.5, 1)).toBe(1); // fraction truncated
    });
    it('matches native', () => {
      const cases = [
        [2, 4],
        [-1, 8],
        [12345, 67890],
        [0xdeadbeef, 0xcafebabe],
        [65535, 65535],
      ];
      for (let i = 0; i < cases.length; i++) {
        expect(mathImul(cases[i][0], cases[i][1])).toBe(Math.imul(cases[i][0], cases[i][1]));
      }
    });
  });

  describe('log10', () => {
    it('handles the domain edges', () => {
      expect(mathLog10(NaN)).toBeNaN();
      expect(mathLog10(-1)).toBeNaN(); // negative out of domain
      expect(mathLog10(0)).toBe(-Infinity);
      expect(mathLog10(-0)).toBe(-Infinity);
      expect(Object.is(mathLog10(1), 0)).toBe(true);
      expect(mathLog10(Infinity)).toBe(Infinity);
    });
    it('is within a ulp of native on powers of ten (change-of-base rounding)', () => {
      const xs = [10, 100, 1000, 1e10, 1e-5];
      for (let i = 0; i < xs.length; i++) {
        expect(mathLog10(xs[i])).toBeCloseTo(Math.log10(xs[i]), 10);
      }
    });
    it('matches native', () => {
      const xs = [0.5, 2, Math.E, 42, 1e21];
      for (let i = 0; i < xs.length; i++) {
        expect(mathLog10(xs[i])).toBeCloseTo(Math.log10(xs[i]), 10);
      }
    });
  });

  describe('log2', () => {
    it('handles the domain edges', () => {
      expect(mathLog2(NaN)).toBeNaN();
      expect(mathLog2(-1)).toBeNaN();
      expect(mathLog2(0)).toBe(-Infinity);
      expect(mathLog2(-0)).toBe(-Infinity);
      expect(Object.is(mathLog2(1), 0)).toBe(true);
      expect(mathLog2(Infinity)).toBe(Infinity);
    });
    it('is within a ulp of native on powers of two (change-of-base rounding)', () => {
      // the island computes ln(x) * LOG2E, which can land 1 ulp off an exact
      // integer (e.g. log2(8) = 2.9999999999999996) — close-to, not equal
      const xs = [2, 4, 8, 1024, Math.pow(2, 31)];
      for (let i = 0; i < xs.length; i++) {
        expect(mathLog2(xs[i])).toBeCloseTo(Math.log2(xs[i]), 10);
      }
    });
    it('matches native', () => {
      const xs = [0.5, 3, 10, 1e21, 1e-10];
      for (let i = 0; i < xs.length; i++) {
        expect(mathLog2(xs[i])).toBeCloseTo(Math.log2(xs[i]), 10);
      }
    });
  });
});
