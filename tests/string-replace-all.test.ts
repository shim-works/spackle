import { stringReplaceAll } from '../src/modules/es.string.replace-all.js';


/**
 * test262-derived conformance suite for the String.prototype.replaceAll polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/String/prototype/replaceAll/
 * https://github.com/tc39/test262/tree/main/test/built-ins/String/prototype/replaceAll
 *
 * ES2021 (Chrome 85 / Safari 13.1) — absent on the floor, so the polyfill
 * installs there.
 *
 *   - replaces every occurrence of a string search
 *   - empty search inserts the replacement between every character (and ends)
 *   - a function replacer is called with (matched, position, string) per match
 *   - string replacements honour $ patterns: $$ $& $` $'
 *   - a RegExp search must be global (else TypeError); a global RegExp replaces
 *     all (delegated to native replace, which handles function/$ replacers)
 *   - search and replacement are coerced via ToString
 */
describe('String.prototype.replaceAll — test262 conformance', () => {
  const replaceAll = (s: string, ...args: any[]) =>
    stringReplaceAll.apply(s, args as any);

  describe('string search & replacement', () => {
    it('replaces all occurrences', () => {
      expect(replaceAll('aabbcc', 'b', 'x')).toBe('aaxxcc');
      expect(replaceAll('a.b.c', '.', '-')).toBe('a-b-c');
    });

    it('returns the string unchanged when there is no match', () => {
      expect(replaceAll('abc', 'z', 'x')).toBe('abc');
    });

    it('replaces a multi-char search', () => {
      expect(replaceAll('foofoo', 'foo', 'bar')).toBe('barbar');
    });

    it('does not re-scan replaced text', () => {
      expect(replaceAll('aaa', 'aa', 'a')).toBe('aa');
    });
  });

  describe('empty search', () => {
    it('inserts the replacement between every character and at the ends', () => {
      expect(replaceAll('abc', '', '-')).toBe('-a-b-c-');
    });
  });

  describe('function replacer', () => {
    it('uses the function return value for each match', () => {
      expect(replaceAll('aabbcc', 'b', () => 'x')).toBe('aaxxcc');
    });

    it('passes (matched, position, string) and runs in order', () => {
      const calls: Array<[string, number, string]> = [];
      const out = replaceAll('a1a2', 'a', (m: string, i: number, s: string) => {
        calls.push([m, i, s]);
        return '[' + i + ']';
      });
      expect(out).toBe('[0]1[2]2');
      expect(calls).toEqual([
        ['a', 0, 'a1a2'],
        ['a', 2, 'a1a2'],
      ]);
    });
  });

  describe('$ substitution (string replacement)', () => {
    it('$& inserts the matched substring', () => {
      expect(replaceAll('abc', 'b', '[$&]')).toBe('a[b]c');
    });

    it('$$ inserts a literal dollar sign', () => {
      expect(replaceAll('ab', 'a', '$$')).toBe('$b');
    });

    it('$` inserts the portion before the match', () => {
      expect(replaceAll('xby', 'b', '$`')).toBe('xxy');
    });

    it("$' inserts the portion after the match", () => {
      expect(replaceAll('xby', 'b', "$'")).toBe('xyy');
    });

    it('leaves an unknown $ pattern literal', () => {
      expect(replaceAll('ab', 'a', '$z')).toBe('$zb');
    });
  });

  describe('RegExp search', () => {
    it('replaces all with a global RegExp', () => {
      expect(replaceAll('a1b2c3', /[0-9]/g as any, '#')).toBe('a#b#c#');
    });

    it('supports a function replacer with a global RegExp', () => {
      expect(
        replaceAll('a1b2', /[0-9]/g as any, (m: string) => '<' + m + '>'),
      ).toBe('a<1>b<2>');
    });

    it('throws TypeError for a non-global RegExp', () => {
      expect(() => replaceAll('abc', /b/ as any, 'x')).toThrow(TypeError);
    });
  });

  describe('coercion', () => {
    it('coerces search and replacement via ToString', () => {
      expect(replaceAll('a1b1', 1 as any, 2 as any)).toBe('a2b2');
    });
  });

  describe('parity vs native', () => {
    it('matches native replacing all separators', () => {
      const native = String.prototype.replaceAll;
      const nativeResult = native.call('a,b,c,d,e', ',', ';');
      const specResult = stringReplaceAll.call('a,b,c,d,e', ',', ';');
      expect(specResult).toBe(nativeResult);
    });
  });
});
