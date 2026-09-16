import { numberToExponential } from '../src/modules/es.number.to-exponential.js';
import { numberToPrecision } from '../src/modules/es.number.to-precision.js';

const toExp = (value: any, digits?: any): string => numberToExponential.call(value, digits);
const toPrec = (value: any, precision?: any): string => numberToPrecision.call(value, precision);

/**
 * Conformance for Number.prototype.toExponential / toPrecision islands. Both
 * delegate formatting to the native when it rounds correctly (as here), so we
 * assert the spec results, the RangeError guard, and the non-number this guard.
 */
describe('Number.prototype.toExponential island', () => {
  it('formats with the requested fraction digits', () => {
    expect(toExp(12345, 3)).toBe('1.235e+4');
    expect(toExp(25, 0)).toBe('3e+1');
    expect(toExp(0, 2)).toBe('0.00e+0');
  });

  it('handles a non-finite value as a string', () => {
    expect(toExp(Infinity, 2)).toBe('Infinity');
    expect(toExp(NaN, 2)).toBe('NaN');
  });

  it('throws RangeError for out-of-range fraction digits', () => {
    expect(() => toExp(1, -1)).toThrow(RangeError);
    expect(() => toExp(1, 21)).toThrow(RangeError);
  });

  it('throws on a non-number this', () => {
    expect(() => numberToExponential.call({} as any, 2)).toThrow(TypeError);
  });
});

describe('Number.prototype.toPrecision island', () => {
  it('formats to the requested precision', () => {
    expect(toPrec(123.456, 4)).toBe('123.5');
    expect(toPrec(0.0001234, 2)).toBe('0.00012');
  });

  it('treats an explicit undefined precision like a plain toString', () => {
    expect(toPrec(1, undefined)).toBe('1');
    expect(toPrec(123.456, undefined)).toBe('123.456');
  });

  it('throws on a non-number this', () => {
    expect(() => numberToPrecision.call({} as any, 2)).toThrow(TypeError);
  });
});
