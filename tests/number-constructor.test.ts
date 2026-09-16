import { isNumberConstructorSupported, NumberPolyfill } from '../src/modules/es.number.constructor.js';


/**
 * test262-derived conformance suite for the Number constructor wrapper.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/Number/ (StringNumericLiteral cases)
 *
 * ES2015 added binary ('0b') and octal ('0o') forms to StringNumericLiteral;
 * older engines return NaN for them. The wrapper fixes just that and defers
 * everything else to the native.
 */
describe('Number constructor wrapper — test262 conformance', () => {
  describe('ES2015 string literals', () => {
    it('parses binary strings', () => {
      expect((NumberPolyfill as any)('0b101')).toBe(5);
      expect((NumberPolyfill as any)('0B11')).toBe(3);
    });

    it('parses octal strings', () => {
      expect((NumberPolyfill as any)('0o17')).toBe(15);
      expect((NumberPolyfill as any)('0O7')).toBe(7);
    });

    it('trims whitespace around the literal', () => {
      expect((NumberPolyfill as any)('  0b101  ')).toBe(5);
    });

    it('returns NaN for invalid digits', () => {
      expect((NumberPolyfill as any)('0b102')).toBeNaN();
      expect((NumberPolyfill as any)('0o18')).toBeNaN();
    });
  });

  describe('native passthrough', () => {
    it('coerces the usual suspects like native', () => {
      const samples: any[] = ['1.5', '0x10', '', '  42 ', 'abc', true, null, [], [7]];
      for (const sample of samples) {
        const mine = (NumberPolyfill as any)(sample);
        const theirs = Number(sample);
        if (theirs !== theirs) {
          expect(mine).toBeNaN();
        } else {
          expect(mine).toBe(theirs);
        }
      }
    });

    it('returns 0 with no arguments', () => {
      expect((NumberPolyfill as any)()).toBe(0);
    });

    it('boxes under new, instanceof intact', () => {
      const boxed = new (NumberPolyfill as any)('0b101');
      expect(typeof boxed).toBe('object');
      expect(boxed instanceof Number).toBe(true);
      expect(boxed.valueOf()).toBe(5);
    });

    it('carries the statics across', () => {
      expect((NumberPolyfill as any).MAX_SAFE_INTEGER).toBe(Number.MAX_SAFE_INTEGER);
      expect((NumberPolyfill as any).EPSILON).toBe(Number.EPSILON);
      expect((NumberPolyfill as any).isNaN).toBe(Number.isNaN);
      expect((NumberPolyfill as any).parseInt).toBe(Number.parseInt);
    });
  });

  describe('probe', () => {
    it('reports modern engines as supported', () => {
      expect(isNumberConstructorSupported()).toBe(true);
    });
  });
});
