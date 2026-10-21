import { describe, expect, it, vi } from 'vitest';
import { regExpToString } from '../src/modules/es.regexp.to-string.js';

/**
 * The sticky-emulation branch, which no other test reaches.
 *
 * es.regexp.constructor only emulates `y` where the engine throws on it --
 * Chrome <49 / Safari <10. Node does not, so `new RegExpPolyfill('a','y')` in
 * regexp-constructor.test.ts takes the passthrough and makeStickyInstance has
 * never executed locally. The device suite was the only thing running it, which
 * is how `new RegExp('a','ym').flags === 'ym'` survived.
 *
 * So the engine is faked: a RegExp that rejects the y flag, installed as the
 * global before the island is re-imported, because the island captures
 * `NativeRegExp` and probes sticky support once at module-eval time.
 */

const withStickyRejectingRegExp = async (body: (island: any) => void): Promise<void> => {
  const RealRegExp = globalThis.RegExp;

  const FakeRegExp: any = function (this: any, source?: any, flags?: any) {
    // Chrome 41 rejects both y and s
    if (typeof flags === 'string' && (flags.indexOf('y') !== -1 || flags.indexOf('s') !== -1)) {
      throw new SyntaxError('Invalid flags supplied to RegExp constructor');
    }
    return new RealRegExp(source, flags);
  };
  // instances stay genuine regexes, so instanceof keeps working
  FakeRegExp.prototype = RealRegExp.prototype;

  (globalThis as any).RegExp = FakeRegExp;
  vi.resetModules();
  try {
    const island = await import('../src/modules/es.regexp.constructor.js');
    expect(island.isRegExpStickySupported()).toBe(false); // the fake took effect
    body(island);
  } finally {
    (globalThis as any).RegExp = RealRegExp;
    vi.resetModules();
  }
};

describe('sticky emulation on an engine that rejects the y flag', () => {
  it('reports flags in spec order, not the order they were written', async () => {
    await withStickyRejectingRegExp(({ RegExpPolyfill }) => {
      expect(new (RegExpPolyfill as any)('a', 'ym').flags).toBe('my');
      expect(new (RegExpPolyfill as any)('a', 'y').flags).toBe('y');
      expect(new (RegExpPolyfill as any)('a', 'yig').flags).toBe('giy');
    });
  });

  it('stringifies with those same ordered flags', async () => {
    await withStickyRejectingRegExp(({ RegExpPolyfill }) => {
      // toString reads this.flags, so the ordering bug printed /a/ym too
      expect(regExpToString.call(new (RegExpPolyfill as any)('a', 'ym'))).toBe('/a/my');
    });
  });

  it('still emulates the sticky behaviour itself', async () => {
    await withStickyRejectingRegExp(({ RegExpPolyfill }) => {
      const sticky = new (RegExpPolyfill as any)('a', 'y');
      expect(sticky instanceof RegExp).toBe(true);
      expect(sticky.sticky).toBe(true);

      // index 1 of 'a_a' is '_' — a sticky match must miss and reset
      sticky.lastIndex = 1;
      expect(sticky.exec('a_a')).toBe(null);
      expect(sticky.lastIndex).toBe(0);

      const hit = sticky.exec('a_a');
      expect(hit && hit[0]).toBe('a');
      expect(sticky.lastIndex).toBe(1);
      expect(sticky.test('a_a')).toBe(false); // lastIndex 1 again, still '_'
    });
  });
});

describe('RegExp.prototype.sticky getter (core-js es.regexp.sticky)', () => {
  it('answers false for real RegExps, undefined on the prototype, and rejects the rest', async () => {
    const { regexpStickyGetter: get } = await import('../src/modules/es.regexp.constructor.js');
    expect(get.call(/a/)).toBe(false);
    expect(get.call(RegExp.prototype)).toBe(undefined);
    for (const bad of [{}, [], undefined, null, 4, 'string']) expect(() => get.call(bad)).toThrow(TypeError);
  });
});

describe('dotAll emulation on an engine that rejects the s flag', () => {
  it('lets . match line terminators only with s, outside classes and escapes', async () => {
    await withStickyRejectingRegExp(({ RegExpPolyfill }) => {
      const R: any = RegExpPolyfill;
      const dot = new R('a.b', 's');
      expect(dot.test('a\nb')).toBe(true);
      expect(dot.test('a\u2028b')).toBe(true);
      expect(dot.dotAll).toBe(true);
      expect(dot.flags).toBe('s');
      expect(new R('a.b').test('a\nb')).toBe(false);
      expect(new R('a\\.b', 's').test('a\nb')).toBe(false); // escaped dot stays literal
      expect(new R('[.]', 's').test('\n')).toBe(false); // a dot in a class stays literal
      expect(new R('a.', 'gsi').flags).toBe('gis');
      const both = new R('a.', 'sy');
      expect(both.flags).toBe('sy');
      expect(both.dotAll).toBe(true);
      expect(both.exec('a\n')).not.toBe(null);
      expect(() => new R('a', 'ss')).toThrow(SyntaxError);
    });
  });
});
