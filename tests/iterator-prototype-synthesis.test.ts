import { describe, expect, it, vi } from 'vitest';

/**
 * Chrome 38/41 have no %IteratorPrototype% at all, so `install-iterator` builds
 * one at module-eval time and splices it into the iterator chains at install.
 *
 * Testing that needs the module re-evaluated with the chain ALREADY broken --
 * the walk runs once, on import. Hence vi.resetModules(), and hence its own
 * file: the browser bundle skips the vi.resetModules() suites, and the splice
 * tests next door are worth running on the real engines.
 */

describe('an engine with no %IteratorPrototype% at all', () => {
  it('gets a synthesized one, spliced in, with Object.prototype left alone', async () => {
    // ONE level up from each iterator; its parent is %IteratorPrototype%. Chrome
    // 38/41 have none anywhere, so detach every family the module samples.
    const arrayIterProto = Object.getPrototypeOf(([] as any)[Symbol.iterator]());
    const real = Object.getPrototypeOf(arrayIterProto);
    const others = [
      Object.getPrototypeOf(('' as any)[Symbol.iterator]()),
      Object.getPrototypeOf(new Map()[Symbol.iterator]()),
      Object.getPrototypeOf(new Set()[Symbol.iterator]()),
    ];

    Object.setPrototypeOf(arrayIterProto, Object.prototype);
    for (const proto of others) Object.setPrototypeOf(proto, Object.prototype);
    vi.resetModules();
    try {
      const fresh = await import('../src/modules/install-iterator.js');
      fresh.installIterator();

      const spliced = Object.getPrototypeOf(arrayIterProto);
      expect(spliced).not.toBe(Object.prototype);
      expect(spliced).not.toBe(real); // a new object, not the engine's
      expect((spliced.map as any).__polyfilled).toBe(true);
      expect(([] as any)[Symbol.iterator]().map).toBe(spliced.map);
      expect(Object.getPrototypeOf(spliced)).toBe(Object.prototype);
      expect((Object.prototype as any).map).toBeUndefined();

      // and it actually works end to end
      expect(([1, 2, 3] as any)[Symbol.iterator]().map((v: number) => v * 2).toArray()).toEqual([2, 4, 6]);

      // @@toStringTag and constructor are SetterThatIgnoresPrototypeProperties
      // accessors (core-js's es.iterator.constructor shape)
      const tag = Object.getOwnPropertyDescriptor(spliced, Symbol.toStringTag)!;
      expect(typeof tag.get).toBe('function');
      expect([tag.enumerable, tag.configurable]).toEqual([false, true]);
      expect(spliced[Symbol.toStringTag]).toBe('Iterator');
      expect(() => { spliced[Symbol.toStringTag] = 'x'; }).toThrow(TypeError);
      expect(() => tag.set!.call(1, 'x')).toThrow(TypeError);
      const child: any = Object.create(spliced);
      child[Symbol.toStringTag] = 'Child';
      expect(Object.getOwnPropertyDescriptor(child, Symbol.toStringTag)).toEqual({ value: 'Child', writable: true, enumerable: true, configurable: true });
      // functions are objects: both setters accept one
      const fn: any = function () {};
      tag.set!.call(fn, 'F');
      expect(fn[Symbol.toStringTag]).toBe('F');
      const ctor = Object.getOwnPropertyDescriptor(spliced, 'constructor')!;
      ctor.set!.call(fn, 'C');
      expect(fn.constructor).toBe('C');
      ctor.set!.call(fn, 'D');
      expect(fn.constructor).toBe('D');
    } finally {
      Object.setPrototypeOf(arrayIterProto, real);
      for (const proto of others) Object.setPrototypeOf(proto, real);
      vi.resetModules();
    }
  });
});
