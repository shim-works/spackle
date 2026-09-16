import { numberParseFloat } from '../src/modules/es.number.parse-float.js';

/**
 * test262-derived conformance suite for the Number.parseFloat polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Number/parseFloat/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Number/parseFloat
 *
 * The spec defines Number.parseFloat as the *same function object* as the global
 * parseFloat, so the headline assertion is reference identity.
 */
describe('Number.parseFloat — test262 conformance', () => {
  it('is the same reference as the global parseFloat', () => {
    expect(numberParseFloat).toBe(parseFloat);
  });

  it('parses leading floats and ignores trailing junk', () => {
    expect(numberParseFloat('3.14')).toBe(3.14);
    expect(numberParseFloat('3.14abc')).toBe(3.14);
    expect(numberParseFloat('  42.5 ')).toBe(42.5);
    expect(numberParseFloat('1e3')).toBe(1000);
  });

  it('returns NaN for non-numeric strings', () => {
    expect(numberParseFloat('abc')).toBeNaN();
    expect(numberParseFloat('')).toBeNaN();
  });

  it('handles Infinity and signs', () => {
    expect(numberParseFloat('Infinity')).toBe(Infinity);
    expect(numberParseFloat('-2.5')).toBe(-2.5);
  });
});
