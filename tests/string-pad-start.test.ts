import { stringPadStart } from '../src/modules/es.string.pad-start.js';


/**
 * test262-derived conformance suite for the String.prototype.padStart polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/String/prototype/padStart/
 * https://github.com/tc39/test262/tree/main/test/built-ins/String/prototype/padStart
 *
 * ES2017 (Chrome 57 / Safari 10) — absent on the floor, so the polyfill installs.
 *
 *   - prepends the pad until the string reaches maxLength
 *   - if the string is already >= maxLength, returns it unchanged
 *   - default pad is a single space; a custom pad is repeated and truncated
 *     (possibly mid-pattern) to fit exactly
 *   - an empty pad string returns the string unchanged
 *   - maxLength coerced via ToLength (fractional floored; negative/NaN -> 0)
 *   - receiver and pad coerced via ToString
 */
describe('String.prototype.padStart — test262 conformance', () => {
  const padStart = (s: any, ...args: any[]) =>
    stringPadStart.apply(s, args as any);

  describe('basic padding', () => {
    it('prepends the default space', () => {
      expect(padStart('abc', 5)).toBe('  abc');
    });

    it('prepends a custom pad', () => {
      expect(padStart('5', 3, '0')).toBe('005');
    });

    it('returns the string unchanged when already long enough', () => {
      expect(padStart('abcde', 5)).toBe('abcde');
      expect(padStart('abcde', 3)).toBe('abcde');
    });

    it('returns a string', () => {
      expect(typeof padStart('a', 3)).toBe('string');
    });
  });

  describe('pad repetition & truncation', () => {
    it('repeats a multi-char pad to fill exactly', () => {
      expect(padStart('x', 5, 'ab')).toBe('ababx');
    });

    it('truncates the pad mid-pattern to fit', () => {
      expect(padStart('x', 5, 'abc')).toBe('abcax');
    });

    it('fills a long target from an empty string', () => {
      expect(padStart('', 10, 'abc')).toBe('abcabcabca');
    });

    it('returns the string unchanged for an empty pad', () => {
      expect(padStart('abc', 10, '')).toBe('abc');
    });
  });

  describe('maxLength coercion (ToLength)', () => {
    it('floors a fractional maxLength', () => {
      expect(padStart('ab', 5.9, '*')).toBe('***ab');
    });

    it('returns unchanged for a negative maxLength', () => {
      expect(padStart('ab', -5, '*')).toBe('ab');
    });

    it('treats a NaN maxLength as 0 (unchanged)', () => {
      expect(padStart('ab', NaN, '*')).toBe('ab');
    });
  });

  describe('coercion', () => {
    it('coerces the receiver and pad via ToString', () => {
      expect(stringPadStart.call(7 as any, 3, 0 as any)).toBe('007');
    });
  });

  describe('parity vs native', () => {
    it('matches native zero-padding a number', () => {
      const native = String.prototype.padStart;
      const nativeResult = native.call('42', 6, '0');
      const specResult = stringPadStart.call('42', 6, '0');
      expect(specResult).toBe(nativeResult);
    });
  });
});
