import { stringTrimStart } from '../src/modules/es.string.trim-start.js';


/**
 * test262-derived conformance suite for the String.prototype.trimStart polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/String/prototype/trimStart/
 * https://github.com/tc39/test262/tree/main/test/built-ins/String/prototype/trimStart
 *
 * ES2019 (Chrome 66 / Safari 12) — absent on the floor, so the polyfill installs.
 *
 *   - removes leading whitespace only (trailing is preserved)
 *   - the whitespace set matches the spec: space, tab, \n, \r, \v, \f, plus
 *      , ﻿ and the Unicode space separators ( , 　, ...)
 *   - returns a string; the impl was verified correct (regex /^\s+/)
 */
describe('String.prototype.trimStart — test262 conformance', () => {
  const trimStart = (s: any) => stringTrimStart.call(s);

  describe('basic', () => {
    it('removes leading spaces, keeps trailing', () => {
      expect(trimStart('   abc   ')).toBe('abc   ');
    });

    it('leaves a string with no leading whitespace unchanged', () => {
      expect(trimStart('abc  ')).toBe('abc  ');
    });

    it('returns empty for an all-whitespace string', () => {
      expect(trimStart('   \t\n ')).toBe('');
    });

    it('returns empty for an empty string', () => {
      expect(trimStart('')).toBe('');
    });

    it('returns a string', () => {
      expect(typeof trimStart('  x')).toBe('string');
    });
  });

  describe('whitespace varieties', () => {
    it('removes tab, newline, carriage return, vertical tab, form feed', () => {
      expect(trimStart('\t\n\r\v\fabc')).toBe('abc');
    });

    it('removes non-breaking space (U+00A0) and BOM (U+FEFF)', () => {
      expect(trimStart(' ﻿abc')).toBe('abc');
    });

    it('removes Unicode space separators (U+2028, U+2029, U+3000)', () => {
      expect(trimStart('  　abc')).toBe('abc');
    });

    it('does not remove non-whitespace lookalikes (U+200B zero-width)', () => {
      // U+200B is NOT in the trim whitespace set
      expect(trimStart('​abc')).toBe('​abc');
    });
  });

  describe('only leading', () => {
    it('never touches interior or trailing whitespace', () => {
      expect(trimStart('  a b  c  ')).toBe('a b  c  ');
    });
  });

  describe('parity vs native', () => {
    it('matches native', () => {
      const native = String.prototype.trimStart;
      const nativeResult = native.call('   \t padded value  ');
      const specResult = stringTrimStart.call('   \t padded value  ');
      expect(specResult).toBe(nativeResult);
    });
  });
});
