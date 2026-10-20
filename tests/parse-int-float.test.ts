import { numberParseInt } from '../src/modules/es.parse-int.js';
import { numberParseFloat } from '../src/modules/es.parse-float.js';

/**
 * Conformance for the global parseInt / parseFloat islands. core-js patches
 * these for old-engine whitespace-trim and prefix bugs; we exercise the
 * hand-rolled impls directly.
 */
describe('parseInt island', () => {
  it('does not treat a leading zero as octal', () => {
    expect(numberParseInt('08')).toBe(8);
    expect(numberParseInt('010')).toBe(10);
  });

  it('auto-detects the 0x hex prefix', () => {
    expect(numberParseInt('0x16')).toBe(22);
    expect(numberParseInt('-0xff')).toBe(-255);
  });

  it('trims leading/trailing whitespace', () => {
    expect(numberParseInt('  42  ')).toBe(42);
    expect(numberParseInt('\t\n 7')).toBe(7);
  });

  it('honours an explicit radix', () => {
    expect(numberParseInt('10', 2)).toBe(2);
    expect(numberParseInt('ff', 16)).toBe(255);
  });

  it('returns NaN for non-numeric input', () => {
    expect(numberParseInt('abc')).toBeNaN();
  });
});

describe('parseFloat island', () => {
  it('preserves -0 for a signed whitespace-y zero', () => {
    expect(1 / numberParseFloat('-0')).toBe(-Infinity);
    expect(1 / numberParseFloat('  -0 ')).toBe(-Infinity);
  });

  it('parses floats after trimming', () => {
    expect(numberParseFloat('  3.14 ')).toBe(3.14);
    expect(numberParseFloat('1e3')).toBe(1000);
  });

  it('returns NaN for non-numeric input', () => {
    expect(numberParseFloat('xyz')).toBeNaN();
  });
});
