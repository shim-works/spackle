import { stringIsWellFormed } from '../src/modules/es.string.is-well-formed.js';
import { stringToWellFormed } from '../src/modules/es.string.to-well-formed.js';

/**
 * test262-derived conformance suite for the String.prototype.isWellFormed /
 * toWellFormed polyfills.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/String/prototype/{isWellFormed,toWellFormed}/
 * https://github.com/tc39/test262/tree/main/test/built-ins/String/prototype
 */
describe('String well-formed (ES2024) — test262 conformance', () => {
  describe('isWellFormed', () => {
    it('accepts BMP-only and properly paired strings', () => {
      expect(stringIsWellFormed.call('')).toBe(true);
      expect(stringIsWellFormed.call('abc')).toBe(true);
      expect(stringIsWellFormed.call('a😀b')).toBe(true); // 😀 pair
    });

    it('rejects lone surrogates in any position', () => {
      expect(stringIsWellFormed.call('\uD800')).toBe(false); // lone high
      expect(stringIsWellFormed.call('\uDC00')).toBe(false); // lone low
      expect(stringIsWellFormed.call('a\uD800z')).toBe(false); // high not followed by low
      expect(stringIsWellFormed.call('\uDC00\uD800')).toBe(false); // reversed pair
      expect(stringIsWellFormed.call('abc\uD800')).toBe(false); // trailing high
    });

    it('matches native', () => {
      const native = (String.prototype as any).isWellFormed;
      if (typeof native !== 'function') return;
      const cases = ['', 'abc', '\uD800', '\uDC00', 'a😀b', '\uDC00\uD800'];
      for (let i = 0; i < cases.length; i++) {
        expect(stringIsWellFormed.call(cases[i])).toBe(native.call(cases[i]));
      }
    });
  });

  describe('toWellFormed', () => {
    it('returns well-formed strings unchanged', () => {
      expect(stringToWellFormed.call('abc')).toBe('abc');
      expect(stringToWellFormed.call('a😀b')).toBe('a😀b');
    });

    it('replaces each lone surrogate with U+FFFD', () => {
      expect(stringToWellFormed.call('\uD800')).toBe('�');
      expect(stringToWellFormed.call('a\uDC00z')).toBe('a�z');
      expect(stringToWellFormed.call('\uDC00\uD800')).toBe('��');
      // the intact pair survives, its lone neighbour doesn't
      expect(stringToWellFormed.call('😀\uD800')).toBe('😀�');
    });

    it('matches native', () => {
      const native = (String.prototype as any).toWellFormed;
      if (typeof native !== 'function') return;
      const cases = ['', 'abc', '\uD800', 'a\uDC00z', '😀\uD800'];
      for (let i = 0; i < cases.length; i++) {
        expect(stringToWellFormed.call(cases[i])).toBe(native.call(cases[i]));
      }
    });
  });
});
