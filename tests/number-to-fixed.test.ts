import { numberToFixed } from '../src/modules/es.number.to-fixed.js';

/**
 * Conformance for Number.prototype.toFixed. The four core-js FORCED cases are
 * the historical old-engine rounding bugs; plus spec basics, range errors, and
 * the non-number `this` guard.
 */
const toFixed = (value: any, digits?: any): string => numberToFixed.call(value, digits);

describe('Number.prototype.toFixed island', () => {
  it('rounds the core-js regression cases correctly', () => {
    expect(toFixed(0.00008, 3)).toBe('0.000');
    expect(toFixed(0.9, 0)).toBe('1');
    expect(toFixed(1.255, 2)).toBe('1.25');
    expect(toFixed(1000000000000000128.0, 0)).toBe('1000000000000000128');
  });

  it('handles spec basics', () => {
    expect(toFixed(123.456, 2)).toBe('123.46');
    expect(toFixed(0, 2)).toBe('0.00');
    expect(toFixed(-1.5, 1)).toBe('-1.5');
    expect(toFixed(5)).toBe('5');
  });

  it('returns NaN / large numbers via String', () => {
    expect(toFixed(NaN, 2)).toBe('NaN');
    expect(toFixed(1e21, 2)).toBe('1e+21');
  });

  it('throws RangeError for out-of-range fraction digits', () => {
    expect(() => toFixed(1, -1)).toThrow(RangeError);
    expect(() => toFixed(1, 21)).toThrow(RangeError);
  });

  it('throws on a non-number this', () => {
    expect(() => numberToFixed.call({} as any, 2)).toThrow(TypeError);
  });
});
