import { describe, expect, it, vi } from 'vitest';

/**
 * Chrome 38/41 have no %IteratorPrototype% at all, so `_iterator-impl` builds
 * one at module-eval time and splices it into the iterator chains at install.
 *
 * Testing that needs the module re-evaluated with the chain ALREADY broken --
 * the walk runs once, on import. Hence vi.resetModules(), and hence its own
 * file: the browser bundle skips the vi.resetModules() suites, and the splice
 * tests next door are worth running on the real engines.
 */

describe('an engine with no %IteratorPrototype% at all', () => {
  it('gets a synthesized one, spliced in, with Object.prototype left alone', async () => {
    // ONE level up from the iterator; its parent is %IteratorPrototype%.
    const arrayIterProto = Object.getPrototypeOf(([] as any)[Symbol.iterator]());
    const real = Object.getPrototypeOf(arrayIterProto);

    Object.setPrototypeOf(arrayIterProto, Object.prototype);
    vi.resetModules();
    try {
      const fresh = await import('../src/modules/_iterator-impl.js');
      fresh.install();

      const spliced = Object.getPrototypeOf(arrayIterProto);
      expect(spliced).not.toBe(Object.prototype);
      expect(spliced).not.toBe(real); // a new object, not the engine's
      expect((spliced.map as any).__polyfilled).toBe(true);
      expect(([] as any)[Symbol.iterator]().map).toBe(spliced.map);
      expect(Object.getPrototypeOf(spliced)).toBe(Object.prototype);
      expect((Object.prototype as any).map).toBeUndefined();

      // and it actually works end to end
      expect(([1, 2, 3] as any)[Symbol.iterator]().map((v: number) => v * 2).toArray()).toEqual([2, 4, 6]);
    } finally {
      Object.setPrototypeOf(arrayIterProto, real);
      vi.resetModules();
    }
  });
});
