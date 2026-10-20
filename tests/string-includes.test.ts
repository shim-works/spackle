import { stringIncludes } from '../src/modules/es.string.includes.js';


/**
 * test262-derived conformance suite for the String.prototype.includes polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/String/prototype/includes/
 * https://github.com/tc39/test262/tree/main/test/built-ins/String/prototype/includes
 *
 * ES2015 (Chrome 41 / Safari 9) — absent on the floor, so the polyfill installs.
 *
 *   - returns a boolean; case-sensitive substring search
 *   - the empty string is always included
 *   - position coerced via ToInteger (NaN/negative -> 0); search starts there
 *   - search is coerced via ToString
 *   - a RegExp search throws TypeError (spec IsRegExp check)
 */
describe('String.prototype.includes — test262 conformance', () => {
  const includes = (s: string, ...args: any[]) =>
    stringIncludes.apply(s, args as any);

  describe('basic search', () => {
    it('returns a boolean', () => {
      expect(includes('abc', 'b')).toBe(true);
      expect(includes('abc', 'x')).toBe(false);
    });

    it('finds a multi-char substring', () => {
      expect(includes('hello world', 'o w')).toBe(true);
    });

    it('is case-sensitive', () => {
      expect(includes('abc', 'B')).toBe(false);
    });

    it('always includes the empty string', () => {
      expect(includes('abc', '')).toBe(true);
      expect(includes('', '')).toBe(true);
    });
  });

  describe('position', () => {
    it('searches from a positive position', () => {
      expect(includes('abcabc', 'a', 1)).toBe(true);
      expect(includes('abc', 'a', 1)).toBe(false);
    });

    it('treats NaN and negative positions as 0', () => {
      expect(includes('abc', 'a', NaN)).toBe(true);
      expect(includes('abc', 'a', -5)).toBe(true);
    });
  });

  describe('coercion', () => {
    it('coerces the search argument via ToString', () => {
      expect(includes('a1b', 1 as any)).toBe(true);
      expect(includes('aundefinedb', undefined)).toBe(true);
    });
  });

  describe('RegExp search throws (IsRegExp)', () => {
    it('throws TypeError when search is a RegExp', () => {
      expect(() => includes('abc', /b/)).toThrow(TypeError);
    });
  });

  describe('parity vs native', () => {
    it('matches native scanning for a substring', () => {
      const native = String.prototype.includes;
      const nativeResult = native.call('the quick brown fox', 'brown');
      const specResult = stringIncludes.call('the quick brown fox', 'brown');
      expect(specResult).toBe(nativeResult);
    });
  });
});
