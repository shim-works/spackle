import { stringEndsWith } from '../src/modules/es.string.ends-with.js';


/**
 * test262-derived conformance suite for the String.prototype.endsWith polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/String/prototype/endsWith/
 * https://github.com/tc39/test262/tree/main/test/built-ins/String/prototype/endsWith
 *
 * ES2015 (Chrome 41 / Safari 9) — absent on the floor, so the polyfill installs.
 *
 *   - true when the search matches ending at endPosition (default length)
 *   - endPosition coerced via ToInteger: NaN/negative -> 0, fractions truncated,
 *     values past length clamp to length
 *   - the empty string always matches
 *   - search coerced via ToString; a RegExp search throws TypeError
 */
describe('String.prototype.endsWith — test262 conformance', () => {
  const endsWith = (s: string, ...args: any[]) =>
    stringEndsWith.apply(s, args as any);

  describe('basic', () => {
    it('matches a suffix', () => {
      expect(endsWith('abc', 'bc')).toBe(true);
      expect(endsWith('abc', 'abc')).toBe(true);
    });

    it('is false when not a suffix', () => {
      expect(endsWith('abc', 'ab')).toBe(false);
      expect(endsWith('abc', 'zabc')).toBe(false);
    });

    it('is case-sensitive', () => {
      expect(endsWith('abc', 'C')).toBe(false);
    });
  });

  describe('endPosition', () => {
    it('treats the string as ending at endPosition', () => {
      expect(endsWith('abcdef', 'cd', 4)).toBe(true);
      expect(endsWith('abcdef', 'cd', 3)).toBe(false);
    });

    it('truncates a fractional endPosition toward zero', () => {
      expect(endsWith('abcdef', 'cd', 4.9)).toBe(true);
    });

    it('clamps an endPosition past length to length', () => {
      expect(endsWith('abc', 'bc', 100)).toBe(true);
    });

    it('treats a negative endPosition as 0', () => {
      expect(endsWith('abc', 'a', -1)).toBe(false);
      // empty search still matches at endPosition 0
      expect(endsWith('abc', '', -1)).toBe(true);
    });
  });

  describe('empty search', () => {
    it('always matches the empty string', () => {
      expect(endsWith('abc', '')).toBe(true);
      expect(endsWith('', '')).toBe(true);
    });
  });

  describe('coercion & RegExp', () => {
    it('coerces the search via ToString', () => {
      expect(endsWith('abc12', 12 as any)).toBe(true);
    });

    it('throws TypeError when search is a RegExp', () => {
      expect(() => endsWith('abc', /c/)).toThrow(TypeError);
    });
  });

  describe('parity vs native', () => {
    it('matches native', () => {
      const native = String.prototype.endsWith;
      const nativeResult = native.call('image.png', '.png');
      const specResult = stringEndsWith.call('image.png', '.png');
      expect(specResult).toBe(nativeResult);
    });
  });
});
