import { stringStartsWith } from '../src/modules/es.string.starts-with.js';


/**
 * test262-derived conformance suite for the String.prototype.startsWith polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/String/prototype/startsWith/
 * https://github.com/tc39/test262/tree/main/test/built-ins/String/prototype/startsWith
 *
 * ES2015 (Chrome 41 / Safari 9) — absent on the floor, so the polyfill installs.
 *
 *   - true only when the search matches AT the position (default 0)
 *   - position coerced via ToInteger: NaN/negative -> 0, fractions truncated
 *   - the empty string always matches (even past the end)
 *   - search coerced via ToString; a RegExp search throws TypeError
 */
describe('String.prototype.startsWith — test262 conformance', () => {
  const startsWith = (s: string, ...args: any[]) =>
    stringStartsWith.apply(s, args as any);

  describe('basic', () => {
    it('matches a prefix', () => {
      expect(startsWith('abc', 'ab')).toBe(true);
      expect(startsWith('abc', 'abc')).toBe(true);
    });

    it('is false when not a prefix', () => {
      expect(startsWith('abc', 'bc')).toBe(false);
      expect(startsWith('abc', 'abcd')).toBe(false);
    });

    it('is case-sensitive', () => {
      expect(startsWith('abc', 'A')).toBe(false);
    });
  });

  describe('position', () => {
    it('matches at a positive position', () => {
      expect(startsWith('abcdef', 'cd', 2)).toBe(true);
      expect(startsWith('abcdef', 'cd', 1)).toBe(false);
    });

    it('treats NaN and negative positions as 0', () => {
      expect(startsWith('abc', 'ab', NaN)).toBe(true);
      expect(startsWith('abc', 'ab', -5)).toBe(true);
    });

    it('truncates a fractional position toward zero', () => {
      expect(startsWith('abcdef', 'cd', 2.9)).toBe(true);
    });

    it('is false when position is past the end (non-empty search)', () => {
      expect(startsWith('abc', 'a', 10)).toBe(false);
    });
  });

  describe('empty search', () => {
    it('always matches the empty string, even past the end', () => {
      expect(startsWith('abc', '')).toBe(true);
      expect(startsWith('abc', '', 100)).toBe(true);
    });
  });

  describe('coercion & RegExp', () => {
    it('coerces the search via ToString', () => {
      expect(startsWith('12abc', 12 as any)).toBe(true);
    });

    it('throws TypeError when search is a RegExp', () => {
      expect(() => startsWith('abc', /a/)).toThrow(TypeError);
    });
  });

  describe('parity vs native', () => {
    it('matches native', () => {
      const native = String.prototype.startsWith;
      const nativeResult = native.call('https://example.com', 'https://');
      const specResult = stringStartsWith.call('https://example.com', 'https://');
      expect(specResult).toBe(nativeResult);
    });
  });
});
