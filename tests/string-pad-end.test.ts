import { stringPadEnd } from '../src/modules/es.string.pad-end.js';


/**
 * test262-derived conformance suite for the String.prototype.padEnd polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/String/prototype/padEnd/
 * https://github.com/tc39/test262/tree/main/test/built-ins/String/prototype/padEnd
 *
 * ES2017 (Chrome 57 / Safari 10) — absent on the floor, so the polyfill installs.
 *
 *   - appends the pad until the string reaches maxLength
 *   - if already >= maxLength, returns it unchanged
 *   - default pad is a single space; a custom pad is repeated and truncated
 *     (possibly mid-pattern) to fit exactly
 *   - an empty pad returns the string unchanged
 *   - maxLength coerced via ToLength (fractional floored; negative/NaN -> 0)
 *   - receiver and pad coerced via ToString
 */
describe('String.prototype.padEnd — test262 conformance', () => {
  const padEnd = (s: any, ...args: any[]) => stringPadEnd.apply(s, args as any);

  describe('basic padding', () => {
    it('appends the default space', () => {
      expect(padEnd('abc', 5)).toBe('abc  ');
    });

    it('appends a custom pad', () => {
      expect(padEnd('5', 3, '0')).toBe('500');
    });

    it('returns the string unchanged when already long enough', () => {
      expect(padEnd('abcde', 5)).toBe('abcde');
      expect(padEnd('abcde', 3)).toBe('abcde');
    });

    it('returns a string', () => {
      expect(typeof padEnd('a', 3)).toBe('string');
    });
  });

  describe('pad repetition & truncation', () => {
    it('repeats a multi-char pad to fill exactly', () => {
      expect(padEnd('x', 5, 'ab')).toBe('xabab');
    });

    it('truncates the pad mid-pattern to fit', () => {
      expect(padEnd('x', 5, 'abc')).toBe('xabca');
    });

    it('fills a long target from an empty string', () => {
      expect(padEnd('', 10, 'abc')).toBe('abcabcabca');
    });

    it('returns the string unchanged for an empty pad', () => {
      expect(padEnd('abc', 10, '')).toBe('abc');
    });
  });

  describe('maxLength coercion (ToLength)', () => {
    it('floors a fractional maxLength', () => {
      expect(padEnd('ab', 5.9, '*')).toBe('ab***');
    });

    it('returns unchanged for a negative maxLength', () => {
      expect(padEnd('ab', -5, '*')).toBe('ab');
    });

    it('treats a NaN maxLength as 0 (unchanged)', () => {
      expect(padEnd('ab', NaN, '*')).toBe('ab');
    });
  });

  describe('coercion', () => {
    it('coerces the receiver and pad via ToString', () => {
      expect(stringPadEnd.call(7 as any, 3, 0 as any)).toBe('700');
    });
  });

  describe('parity vs native', () => {
    it('matches native padding a label', () => {
      const native = String.prototype.padEnd;
      const nativeResult = native.call('Name', 10, '.');
      const specResult = stringPadEnd.call('Name', 10, '.');
      expect(specResult).toBe(nativeResult);
    });
  });
});
