import { stringTrim } from '../src/modules/es.string.trim.js';


/**
 * test262-derived conformance suite for the String.prototype.trim polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/String/prototype/trim/
 * https://github.com/tc39/test262/tree/main/test/built-ins/String/prototype/trim
 *
 * ES5 — universal in range; the island exists for core-js parity (the babel
 * intercept ships es.string.trim), so the gate should never fire on the floor.
 *
 *   - removes leading and trailing whitespace, keeps interior
 *   - the whitespace set matches the spec: space, tab, \n, \r, \v, \f, NBSP,
 *     BOM and the Unicode space separators
 */
describe('String.prototype.trim — test262 conformance', () => {
  const trim = (s: any) => stringTrim.call(s);

  describe('basic', () => {
    it('removes leading and trailing whitespace', () => {
      expect(trim('   abc   ')).toBe('abc');
    });

    it('keeps interior whitespace', () => {
      expect(trim('  a b  c  ')).toBe('a b  c');
    });

    it('leaves an already-trimmed string unchanged', () => {
      expect(trim('abc')).toBe('abc');
    });

    it('returns empty for an all-whitespace string', () => {
      expect(trim('   \t\n ')).toBe('');
    });

    it('returns empty for an empty string', () => {
      expect(trim('')).toBe('');
    });
  });

  describe('whitespace varieties', () => {
    it('removes tab, newline, carriage return, vertical tab, form feed', () => {
      expect(trim('\t\n\r\v\fabc\f\v\r\n\t')).toBe('abc');
    });

    it('removes non-breaking space (U+00A0) and BOM (U+FEFF)', () => {
      expect(trim(' ﻿abc﻿ ')).toBe('abc');
    });

    it('removes Unicode space separators (U+2028, U+2029, U+3000)', () => {
      expect(trim(' 　abc ')).toBe('abc');
    });

    it('does not remove non-whitespace lookalikes (U+200B zero-width)', () => {
      expect(trim('​abc​')).toBe('​abc​');
    });
  });

  describe('parity vs native', () => {
    it('matches native', () => {
      const input = ' \t padded value  \n';
      expect(stringTrim.call(input)).toBe(input.trim());
    });
  });
});
