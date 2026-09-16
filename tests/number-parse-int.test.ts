import { numberParseInt } from '../src/modules/es.number.parse-int.js';


/**
 * test262-derived conformance suite for the Number.parseInt polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Number/parseInt/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Number/parseInt
 *
 * Number.parseInt is specified to be the very same function object as the
 * global parseInt, so the polyfill is a reference copy. The behavioural cases
 * below lock in that the shared parseInt semantics (radix, whitespace, sign,
 * truncation, NaN) come through unchanged.
 */
describe('Number.parseInt — test262 conformance', () => {
  it('is the same function object as global parseInt', () => {
    expect(numberParseInt).toBe(parseInt);
  });

  it('parses leading integer portions, ignoring trailing junk', () => {
    expect(numberParseInt('42')).toBe(42);
    expect(numberParseInt('42px')).toBe(42);
    expect(numberParseInt('3.99')).toBe(3);
  });

  it('honours an explicit radix', () => {
    expect(numberParseInt('0x1F', 16)).toBe(31);
    expect(numberParseInt('FF', 16)).toBe(255);
    expect(numberParseInt('111', 2)).toBe(7);
    expect(numberParseInt('z', 36)).toBe(35);
  });

  it('auto-detects the 0x hex prefix with no radix', () => {
    expect(numberParseInt('0x10')).toBe(16);
  });

  it('skips leading whitespace and respects sign', () => {
    expect(numberParseInt('   -17')).toBe(-17);
    expect(numberParseInt('\t\n +8')).toBe(8);
  });

  it('returns NaN for unparseable input', () => {
    expect(numberParseInt('foo')).toBeNaN();
    expect(numberParseInt('')).toBeNaN();
    expect(numberParseInt('   ')).toBeNaN();
  });

  it('coerces non-string input via ToString (shared parseInt behaviour)', () => {
    expect(numberParseInt(42 as any)).toBe(42);
    expect(numberParseInt(true as any)).toBeNaN();
  });

  describe('parity vs native', () => {
    it('matches native across a mixed set', () => {
      const inputs: [string, number?][] = [
        ['42'],
        ['0x1F', 16],
        ['  -17'],
        ['foo'],
        ['111', 2],
      ];
      for (let i = 0; i < inputs.length; i++) {
        const [s, r] = inputs[i];
        expect(String(numberParseInt(s, r))).toBe(String(parseInt(s, r)));
      }
    });
  });
});
