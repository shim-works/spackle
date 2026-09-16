import { stringMatch } from '../src/modules/es.string.match.js';
import { stringReplace } from '../src/modules/es.string.replace.js';
import { stringSearch } from '../src/modules/es.string.search.js';
import { stringSplit } from '../src/modules/es.string.split.js';


/**
 * test262-derived conformance suite for the Symbol-dispatch String method
 * patches (match / replace / search / split).
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/String/prototype/{match,replace,search,split}/
 *
 * ES2015 — the patches only install alongside the Symbol island (Safari 7/8);
 * their whole job is honoring a custom Symbol.match/replace/search/split
 * handler on the argument before falling back to the native method.
 */
describe('String dispatch patches — test262 conformance', () => {
  describe('stringMatch', () => {
    it('falls back to native for regexes and strings', () => {
      expect(stringMatch.call('abcabc', /b/g)).toEqual('abcabc'.match(/b/g));
      expect(stringMatch.call('abc', 'b')!.index).toBe(1);
    });

    it('dispatches to a custom Symbol.match handler', () => {
      const matcher = {
        [Symbol.match](str: string) {
          return 'matched:' + str;
        },
      };
      expect(stringMatch.call('abc', matcher)).toBe('matched:abc');
    });

    it('throws on null/undefined this', () => {
      expect(() => stringMatch.call(null, /a/)).toThrow(TypeError);
    });
  });

  describe('stringReplace', () => {
    it('falls back to native', () => {
      expect(stringReplace.call('aaa', /a/g, 'b')).toBe('bbb');
      expect(stringReplace.call('abc', 'b', 'x')).toBe('axc');
    });

    it('dispatches to a custom Symbol.replace handler with the replacement', () => {
      const replacer = {
        [Symbol.replace](str: string, replacement: any) {
          return str + '->' + replacement;
        },
      };
      expect(stringReplace.call('abc', replacer, 'xyz')).toBe('abc->xyz');
    });
  });

  describe('stringSearch', () => {
    it('falls back to native', () => {
      expect(stringSearch.call('abc', /b/)).toBe(1);
      expect(stringSearch.call('abc', 'c')).toBe(2);
    });

    it('dispatches to a custom Symbol.search handler', () => {
      const searcher = {
        [Symbol.search]() {
          return 42;
        },
      };
      expect(stringSearch.call('abc', searcher)).toBe(42);
    });
  });

  describe('stringSplit', () => {
    it('falls back to native, limit included', () => {
      expect(stringSplit.call('a,b,c', ',')).toEqual(['a', 'b', 'c']);
      expect(stringSplit.call('a,b,c', ',', 2)).toEqual(['a', 'b']);
      expect(stringSplit.call('a1b2c', /\d/)).toEqual(['a', 'b', 'c']);
    });

    it('dispatches to a custom Symbol.split handler with the limit', () => {
      const splitter = {
        [Symbol.split](str: string, limit: any) {
          return [str, limit];
        },
      };
      expect(stringSplit.call('abc', splitter, 7)).toEqual(['abc', 7]);
    });
  });
});
