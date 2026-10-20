import { isStringMatchAllSupported, stringMatchAll } from '../src/modules/es.string.match-all.js';
import { stringAt } from '../src/modules/es.string.at-alternative.js';
import { stringCodePointAt } from '../src/modules/es.string.code-point-at.js';
import { stringRaw } from '../src/modules/es.string.raw.js';
import { stringRepeat } from '../src/modules/es.string.repeat.js';
import { stringTrimEnd } from '../src/modules/es.string.trim-end.js';


/**
 * test262-derived conformance suite for the previously-stubbed String methods:
 * raw, codePointAt, repeat, trimEnd, matchAll, at.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/String/{raw,prototype/...}/
 * https://github.com/tc39/test262/tree/main/test/built-ins/String
 *
 * Prototype methods are called via .call so they can be exercised without
 * installing onto String.prototype, and paired against the native method.
 */
const repeat = (s: string, n: number): string => (stringRepeat as any).call(s, n);
const trimEnd = (s: string): string => (stringTrimEnd as any).call(s);
const at = (s: string, i: number): string | undefined => (stringAt as any).call(s, i);
const codePointAt = (s: string, i: number): number | undefined =>
  (stringCodePointAt as any).call(s, i);
const matchAll = (s: string, re: any): any[] => {
  const out: any[] = [];
  const it = (stringMatchAll as any).call(s, re);
  let step = it.next();
  while (!step.done) {
    out.push(step.value);
    step = it.next();
  }
  return out;
};

describe('String extras — test262 conformance', () => {
  describe('repeat', () => {
    it('repeats and matches native', () => {
      expect(repeat('ab', 3)).toBe('ababab');
      expect(repeat('x', 0)).toBe('');
      expect(repeat('ab', 3)).toBe('ab'.repeat(3));
    });
    it('floors a fractional count', () => {
      expect(repeat('ab', 2.9)).toBe('abab');
    });
    it('throws RangeError for negative / Infinite count', () => {
      expect(() => repeat('a', -1)).toThrow(RangeError);
      expect(() => repeat('a', Infinity)).toThrow(RangeError);
    });
  });

  describe('trimEnd', () => {
    it('strips only trailing whitespace, matches native', () => {
      expect(trimEnd('  x  ')).toBe('  x');
      expect(trimEnd('\t\nfoo 　')).toBe('\t\nfoo');
      expect(trimEnd('  x  ')).toBe('  x  '.trimEnd());
    });
  });

  describe('at', () => {
    it('indexes from start and end, matches native', () => {
      expect(at('abc', 0)).toBe('a');
      expect(at('abc', -1)).toBe('c');
      expect(at('abc', 5)).toBeUndefined();
      expect(at('abc', -5)).toBeUndefined();
      for (const i of [0, 1, 2, -1, -2, 3, -3]) {
        expect(at('abc', i)).toBe('abc'.at(i));
      }
    });
  });

  describe('codePointAt', () => {
    it('returns the unit, combines surrogate pairs, matches native', () => {
      expect(codePointAt('abc', 1)).toBe(98);
      expect(codePointAt('😀', 0)).toBe(128512);
      expect(codePointAt('abc', 9)).toBeUndefined();
      expect(codePointAt('😀b', 0)).toBe('😀b'.codePointAt(0));
    });
  });

  describe('String.raw', () => {
    it('interleaves raw segments + substitutions, matches native', () => {
      expect((stringRaw as any)({ raw: ['a', 'b', 'c'] }, 1, 2)).toBe('a1b2c');
      // real tagged template parity
      expect((stringRaw as any)`x${1}y${2}z`).toBe(String.raw`x${1}y${2}z`);
      expect((stringRaw as any)`a\nb`).toBe(String.raw`a\nb`); // raw: backslash-n kept
    });
  });

  describe('matchAll', () => {
    it('yields every match with index + capture groups', () => {
      const matches = matchAll('a1b2c3', /([a-z])(\d)/g);
      expect(matches.length).toBe(3);
      expect(matches[0][0]).toBe('a1');
      expect(matches[0][1]).toBe('a');
      expect(matches[0][2]).toBe('1');
      expect(matches[2][2]).toBe('3');
    });
    it('matches native output', () => {
      const mine = matchAll('a1b2', /\d/g).map((m) => m[0]);
      const native = [...'a1b2'.matchAll(/\d/g)].map((m) => m[0]);
      expect(mine).toEqual(native);
    });
    it('throws TypeError for a non-global RegExp', () => {
      expect(() => matchAll('abc', /a/)).toThrow(TypeError);
    });
    it('terminates on empty matches', () => {
      expect(matchAll('abc', /x?/g).length).toBe([...'abc'.matchAll(/x?/g)].length);
    });
    it('the probe contract: modern natives throw on a non-global regexp', () => {
      // Chrome 73-79 shipped the pre-final draft that accepted it silently —
      // that partial is exactly what the behavioral probe screens out
      expect(isStringMatchAllSupported()).toBe(true);
    });
  });
});
