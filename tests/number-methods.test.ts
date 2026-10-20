import { numberIsFinite } from '../src/modules/es.number.is-finite.js';
import { numberIsInteger } from '../src/modules/es.number.is-integer.js';
import { numberIsNaN } from '../src/modules/es.number.is-nan.js';
import { numberParseInt } from '../src/modules/es.number.parse-int.js';

/**
 * Grouped parity suite for the Number static methods.
 *
 * test262: https://github.com/tc39/test262/tree/main/test/built-ins/Number
 * (deep edge cases live in the per-method suites: number-is-finite / -integer /
 * -nan / parse-int)
 */


describe('Number.isFinite — polyfill vs native', () => {
  const cases: [any, boolean][] = [
    [1, true],
    [0, true],
    [-1, true],
    [1.5, true],
    [Infinity, false],
    [-Infinity, false],
    [NaN, false],
    ['1', false],
    [null, false],
    [undefined, false],
  ];

  it.each(cases)('Number.isFinite(%p) === %p', (val, expected) => {
    expect(numberIsFinite(val)).toBe(expected);
    expect(Number.isFinite(val)).toBe(expected);
  });
});

describe('Number.isInteger — polyfill vs native', () => {
  const cases: [any, boolean][] = [
    [1, true],
    [0, true],
    [-1, true],
    [1.5, false],
    [NaN, false],
    [Infinity, false],
    ['1', false],
    [null, false],
  ];

  it.each(cases)('Number.isInteger(%p) === %p', (val, expected) => {
    expect(numberIsInteger(val)).toBe(expected);
    expect(Number.isInteger(val)).toBe(expected);
  });
});

describe('Number.isNaN — polyfill vs native', () => {
  const cases: [any, boolean][] = [
    [NaN, true],
    [1, false],
    ['NaN', false],
    [undefined, false],
    [null, false],
    [Infinity, false],
  ];

  it.each(cases)('Number.isNaN(%p) === %p', (val, expected) => {
    expect(numberIsNaN(val)).toBe(expected);
    expect(Number.isNaN(val)).toBe(expected);
  });
});

describe('Number.parseInt — polyfill vs native', () => {
  it('parses integers same as native', () => {
    expect(numberParseInt('42', 10)).toBe(Number.parseInt('42', 10));
    expect(numberParseInt('0xFF', 16)).toBe(Number.parseInt('0xFF', 16));
    expect(numberParseInt('11', 2)).toBe(Number.parseInt('11', 2));
    expect(numberParseInt('abc')).toBeNaN();
  });
});
