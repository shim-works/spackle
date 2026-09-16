import { mathSign } from '../src/modules/es.math.sign.js';


/**
 * test262-derived conformance suite for the Math.sign polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Math/sign/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Math/sign
 *
 * Math.sign returns 1, -1, +0, -0, or NaN. The signed-zero preservation and
 * NaN/Infinity handling are the cases that catch a naive `x > 0 ? 1 : -1`
 * impl, so they are asserted explicitly (incl. Object.is for ±0).
 */
describe('Math.sign — test262 conformance', () => {
  const cases: [number, number][] = [
    [3, 1],
    [-3, -1],
    [0.5, 1],
    [-0.5, -1],
    [Infinity, 1],
    [-Infinity, -1],
    [Number.MAX_VALUE, 1],
    [-Number.MAX_VALUE, -1],
  ];

  it.each(cases)('Math.sign(%p) === %p', (input, expected) => {
    expect(mathSign(input)).toBe(expected);
    expect(Math.sign(input)).toBe(expected);
  });

  describe('signed zero is preserved (not collapsed to 1/-1)', () => {
    it('Math.sign(+0) is +0', () => {
      expect(Object.is(mathSign(0), 0)).toBe(true);
      expect(Object.is(Math.sign(0), 0)).toBe(true);
    });

    it('Math.sign(-0) is -0', () => {
      expect(Object.is(mathSign(-0), -0)).toBe(true);
      expect(Object.is(Math.sign(-0), -0)).toBe(true);
    });
  });

  describe('NaN handling', () => {
    it('returns NaN for NaN', () => {
      expect(mathSign(NaN)).toBeNaN();
      expect(Math.sign(NaN)).toBeNaN();
    });

    it('returns NaN for values that coerce to NaN', () => {
      expect(mathSign(undefined as any)).toBeNaN();
      expect(mathSign('foo' as any)).toBeNaN();
    });
  });

  describe('argument coercion (ToNumber)', () => {
    it('coerces numeric strings and booleans', () => {
      expect(mathSign('5' as any)).toBe(1);
      expect(mathSign('-5' as any)).toBe(-1);
      expect(mathSign(true as any)).toBe(1);
      expect(Object.is(mathSign(false as any), 0)).toBe(true);
    });
  });
});
