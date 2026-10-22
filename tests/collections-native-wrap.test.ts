import { describe, expect, it } from 'vitest';
import { installMapExtensionsOnNative } from '../src/modules/es.map.js';
import { installSetExtensionsOnNative } from '../src/modules/es.set.js';

/**
 * Safari 7.1/8 and Chrome 38-41: a usable native Map/Set whose constructor
 * ignores iterables and whose set/add may not chain. core-js keeps the native
 * and wraps it; spackle now does the same instead of replacing the storage.
 * The fake keeps real storage and drops the constructor argument.
 */
const fakeOf = (Real: any, adder: string): any => {
  const proto = Object.create(Real.prototype);
  const Fake: any = function () { return Object.setPrototypeOf(new Real(), proto); };
  const realAdder = Real.prototype[adder];
  proto[adder] = function (this: any, a: any, b: any) { realAdder.call(this, a, b); }; // no chaining
  Fake.prototype = proto;
  Fake.extra = 'static';
  return { Fake, proto };
};

const run = (name: 'Map' | 'Set', install: () => void, body: (G: any, proto: any) => void) => {
  const Real = (window as any)[name];
  const { Fake, proto } = fakeOf(Real, name === 'Map' ? 'set' : 'add');
  const saved = Object.getOwnPropertyDescriptor(window, name)!;
  Object.defineProperty(window, name, { value: Fake, writable: true, configurable: true });
  try {
    install();
    const G = (window as any)[name];
    body(G, proto);
  } finally {
    Object.defineProperty(window, name, saved);
  }
};

describe('Map and Set: a native without iterable construction is wrapped, not replaced', () => {
  it('Map', () => {
    run('Map', installMapExtensionsOnNative, (G, proto) => {
      expect(G.name).toBe('Map');
      expect(G.length).toBe(0);
      expect(G.extra).toBe('static');
      expect(G.prototype).toBe(proto);
      expect(proto.constructor).toBe(G);
      expect(() => (G as any)()).toThrow(TypeError);
      const m = new G([[1, 'a'], [2, 'b']]);
      expect(m instanceof G).toBe(true);
      expect([m.size, m.get(1), m.get(2)]).toEqual([2, 'a', 'b']);
      expect(m.set(3, 'c')).toBe(m); // chaining fixed
      class Sub extends G {}
      const s: any = new Sub([[1, 1]]);
      expect(s instanceof Sub).toBe(true);
      expect(s.get(1)).toBe(1);
      expect(() => new G([1])).toThrow(TypeError);
    });
  });

  it('Set', () => {
    run('Set', installSetExtensionsOnNative, (G, proto) => {
      expect(G.name).toBe('Set');
      expect(G.prototype).toBe(proto);
      const s = new G([1, 2, 2]);
      expect(s instanceof G).toBe(true);
      expect(s.size).toBe(2);
      expect(s.add(3)).toBe(s);
      class Sub extends G {}
      expect(new Sub([5]).has(5)).toBe(true);
    });
  });
});
