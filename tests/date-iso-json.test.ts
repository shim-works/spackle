import { dateToISOString } from '../src/modules/es.date.to-iso-string.js';
import { dateToJSON } from '../src/modules/es.date.to-json.js';

/**
 * Conformance for the Date.prototype.toISOString / toJSON islands. core-js
 * patches these for old-WebKit padding + invalid-date handling; we exercise the
 * hand-rolled impls directly.
 */
describe('Date.prototype.toISOString island', () => {
  it('formats a UTC date with millisecond precision', () => {
    const d = new Date(Date.UTC(2020, 0, 1, 2, 3, 4, 5));
    expect(dateToISOString.call(d)).toBe('2020-01-01T02:03:04.005Z');
  });

  it('pads far-past years to four digits (the core-js regression case)', () => {
    expect(dateToISOString.call(new Date(-5e13 - 1))).toBe('0385-07-25T07:06:39.999Z');
  });

  it('signs and widens out-of-range years', () => {
    expect(dateToISOString.call(new Date(Date.UTC(12345, 0, 1)))).toBe('+012345-01-01T00:00:00.000Z');
  });

  it('throws RangeError on an invalid date', () => {
    expect(() => dateToISOString.call(new Date(NaN))).toThrow(RangeError);
  });
});

describe('Date.prototype.toJSON island', () => {
  it('serializes a valid date via toISOString', () => {
    const d = new Date(Date.UTC(2020, 0, 1));
    expect(dateToJSON.call(d)).toBe('2020-01-01T00:00:00.000Z');
  });

  it('returns null for a non-finite date', () => {
    expect(dateToJSON.call(new Date(NaN))).toBe(null);
  });

  it('works on any object with a numeric primitive + toISOString', () => {
    expect(dateToJSON.call({ valueOf: () => 1, toISOString: () => 'iso' })).toBe('iso');
    expect(dateToJSON.call({ valueOf: () => NaN, toISOString: () => 'iso' })).toBe(null);
  });
});
