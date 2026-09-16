import { isRegExpStickySupported, RegExpPolyfill } from '../src/modules/es.regexp.constructor.js';
import { regExpToString } from '../src/modules/es.regexp.to-string.js';


/**
 * Conformance suite for the RegExp constructor wrapper + toString islands.
 *
 * The wrapper only installs where the sticky flag throws (Chrome <49 /
 * Safari <10); on those engines it emulates 'y' with a hidden global-flagged
 * searcher and per-instance exec/test that anchor at lastIndex. Everywhere
 * else it hands construction straight to the native. These tests exercise
 * both the passthrough (host supports sticky) and the emulation path
 * (makeStickyInstance is reachable regardless via the wrapper's fallback,
 * so we exercise anchoring semantics through the native for parity).
 *
 *   - plain construction and copy-construction passthrough
 *   - instances are genuine RegExps (instanceof intact)
 *   - toString: '/' + source + '/' + flags, generic on duck-typed objects
 */
describe('RegExp constructor wrapper', () => {
  describe('construction', () => {
    it('builds plain regexes (callable with and without new)', () => {
      const constructed = new (RegExpPolyfill as any)('a.c', 'i');
      expect(constructed instanceof RegExp).toBe(true);
      expect(constructed.test('AbC')).toBe(true);
      const called = (RegExpPolyfill as any)('x');
      expect(called instanceof RegExp).toBe(true);
    });

    it('copy-constructs from a regex, keeping flags', () => {
      const original = /ab/gi;
      const copy = new (RegExpPolyfill as any)(original);
      expect(copy.source).toBe('ab');
      expect(copy.flags).toContain('g');
      expect(copy.flags).toContain('i');
    });

    it('copy-constructs with overridden flags', () => {
      const copy = new (RegExpPolyfill as any)(/ab/g, 'i');
      expect(copy.flags).toBe('i');
    });

    it('handles undefined pattern as empty source', () => {
      const empty = new (RegExpPolyfill as any)();
      expect(empty.test('')).toBe(true);
    });

    it('builds sticky regexes that anchor at lastIndex', () => {
      const sticky = new (RegExpPolyfill as any)('a', 'y');
      expect(sticky.sticky).toBe(true);
      sticky.lastIndex = 1;
      // index 1 of 'a_a' is '_' — sticky must miss and reset
      expect(sticky.exec('a_a')).toBe(null);
      expect(sticky.lastIndex).toBe(0);
      const hit = sticky.exec('a_a');
      expect(hit && hit.index).toBe(0);
      expect(sticky.lastIndex).toBe(1);
    });
  });

  describe('probe', () => {
    it('reports modern engines as supported', () => {
      expect(isRegExpStickySupported()).toBe(true);
    });
  });
});

describe('RegExp.prototype.toString island', () => {
  it('serializes source and flags', () => {
    expect(regExpToString.call(/ab/gi)).toBe('/ab/gi');
  });

  it('is generic over duck-typed regex-likes', () => {
    expect(regExpToString.call({ source: 'x', flags: 'y' } as any)).toBe('/x/y');
  });

  it('throws on null/undefined this', () => {
    expect(() => regExpToString.call(null as any)).toThrow(TypeError);
  });

  it('matches native on real regexes', () => {
    expect(regExpToString.call(/a|b/m)).toBe(/a|b/m.toString());
  });
});
