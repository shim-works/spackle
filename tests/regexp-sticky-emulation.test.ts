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
    if (typeof flags === 'string' && flags.indexOf('y') !== -1) {
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
