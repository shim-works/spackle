import { Reflect as ReflectPolyfill, isSupported as reflectImplSupported } from '../src/modules/_reflect-impl.js';
import { installPolyfills } from '../src/install-polyfills.js';
import { symbolIsShimmed } from './engine-capabilities.js';

/**
 * Conformance suite for the partial Reflect polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Reflect/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Reflect
 *
 * Covers the ES5-mappable traps; Reflect.metadata is out of scope by design.
 */
describe('Reflect — partial polyfill', () => {
  it('apply() calls with thisArg + args list', () => {
    const fn = function (this: any, a: number, b: number) {
      return this.base + a + b;
    };
    expect(ReflectPolyfill.apply(fn, { base: 10 }, [2, 3])).toBe(15);
  });

  it('construct() builds an instance from an args list', () => {
    function Point(this: any, x: number, y: number) {
      this.x = x;
      this.y = y;
    }
    const p = ReflectPolyfill.construct(Point, [3, 4]);
    expect(p instanceof Point).toBe(true);
    expect(p.x).toBe(3);
    expect(p.y).toBe(4);
  });

  it('construct() honors a distinct newTarget prototype', () => {
    function Base(this: any) {
      this.tag = 'base';
    }
    function Derived() {}
    Derived.prototype.kind = 'derived';
    const inst = ReflectPolyfill.construct(Base, [], Derived);
    expect(inst.tag).toBe('base');
    expect((inst as any).kind).toBe('derived');
  });

  it('get()/set() read and write, including accessors via receiver', () => {
    const obj: any = {
      _v: 1,
      get v() {
        return this._v;
      },
      set v(x: number) {
        this._v = x;
      },
    };
    expect(ReflectPolyfill.get(obj, 'v')).toBe(1);
    expect(ReflectPolyfill.set(obj, 'v', 9)).toBe(true);
    expect(obj._v).toBe(9);
  });

  it('get() walks the prototype chain', () => {
    const proto = { inherited: 42 };
    const child = Object.create(proto);
    expect(ReflectPolyfill.get(child, 'inherited')).toBe(42);
  });

  it('set() fails (false) on a getter-only accessor', () => {
    const obj: any = {
      get ro() {
        return 1;
      },
    };
    expect(ReflectPolyfill.set(obj, 'ro', 2)).toBe(false);
  });

  it('has() mirrors the `in` operator', () => {
    expect(ReflectPolyfill.has({ a: 1 }, 'a')).toBe(true);
    expect(ReflectPolyfill.has({ a: 1 }, 'b')).toBe(false);
    expect(ReflectPolyfill.has([], 'length')).toBe(true);
  });

  it('deleteProperty() removes and reports success', () => {
    const obj: any = { a: 1 };
    expect(ReflectPolyfill.deleteProperty(obj, 'a')).toBe(true);
    expect('a' in obj).toBe(false);
  });

  it('defineProperty() returns true on success, false on failure', () => {
    const obj: any = {};
    expect(ReflectPolyfill.defineProperty(obj, 'x', { value: 5 })).toBe(true);
    expect(obj.x).toBe(5);
    Object.freeze(obj);
    expect(ReflectPolyfill.defineProperty(obj, 'y', { value: 6 })).toBe(false);
  });

  it('ownKeys() lists own string keys', () => {
    expect(ReflectPolyfill.ownKeys({ a: 1, b: 2 }).sort()).toEqual(['a', 'b']);
  });

  // Already documented at _reflect-impl.ts:21 — "[incomplete] ownKeys omits
  // Symbol keys when the runtime has no Symbols." A shimmed symbol is a
  // '@@name' string key that hideSymbolKeys() deliberately filters out.
  it.skipIf(symbolIsShimmed())('ownKeys() includes Symbol keys when present', () => {
    const s = Symbol('s');
    const obj: any = { a: 1 };
    obj[s] = 2;
    expect(ReflectPolyfill.ownKeys(obj)).toContain(s);
  });

  it('getPrototypeOf()/setPrototypeOf() round-trip', () => {
    const proto = { p: 1 };
    const obj: any = {};
    expect(ReflectPolyfill.setPrototypeOf(obj, proto)).toBe(true);
    expect(ReflectPolyfill.getPrototypeOf(obj)).toBe(proto);
  });

  it('isExtensible()/preventExtensions()', () => {
    const obj: any = {};
    expect(ReflectPolyfill.isExtensible(obj)).toBe(true);
    expect(ReflectPolyfill.preventExtensions(obj)).toBe(true);
    expect(ReflectPolyfill.isExtensible(obj)).toBe(false);
  });

  it('getOwnPropertyDescriptor()', () => {
    const desc = ReflectPolyfill.getOwnPropertyDescriptor({ a: 1 }, 'a');
    expect(desc!.value).toBe(1);
    expect(desc!.enumerable).toBe(true);
  });
});

/**
 * The install itself, which is what actually broke: isSupported() read the bare
 * name `Reflect`, which this module exports, so the probe tested the polyfill
 * against itself, passed, and never installed on any engine below Chrome 49.
 */
describe('Reflect installs on an engine that has none', () => {
  it('reports unsupported, installs, and arrives tagged', () => {
    const native = (window as any).Reflect;
    delete (window as any).Reflect;
    try {
      expect(reflectImplSupported()).toBe(false);

      installPolyfills();

      const installed = (window as any).Reflect;
      expect(installed).toBeDefined();
      expect(installed.__polyfilled).toBe(true);
      expect(installed.get({ a: 1 }, 'a')).toBe(1);
      // es.reflect.to-string-tag has to run AFTER the namespace exists
      expect(Object.prototype.toString.call(installed)).toBe('[object Reflect]');
    } finally {
      Object.defineProperty(window, 'Reflect', {
        value: native,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
  });
});

/**
 * ES2015 26.1.3-26.1.13: every Reflect method except apply/construct opens with
 * "If Type(target) is not Object, throw a TypeError".
 *
 * Before this, the failure surfaced as whatever native was reached first --
 * `Reflect.ownKeys(5)` threw "Object.getOwnPropertySymbols called on
 * non-object" on a real Chromium 41 device, naming a function the caller never
 * invoked. The mutators were worse: they swallowed the bad target into their
 * `return false` path, reporting a valid-but-failed operation.
 */
describe('Reflect target validation', () => {
  const METHODS: [string, (t: any) => unknown][] = [
    ['defineProperty', (t) => ReflectPolyfill.defineProperty(t, 'x', { value: 1 })],
    ['deleteProperty', (t) => ReflectPolyfill.deleteProperty(t, 'x')],
    ['get', (t) => ReflectPolyfill.get(t, 'x')],
    ['getOwnPropertyDescriptor', (t) => ReflectPolyfill.getOwnPropertyDescriptor(t, 'x')],
    ['getPrototypeOf', (t) => ReflectPolyfill.getPrototypeOf(t)],
    ['has', (t) => ReflectPolyfill.has(t, 'x')],
    ['isExtensible', (t) => ReflectPolyfill.isExtensible(t)],
    ['ownKeys', (t) => ReflectPolyfill.ownKeys(t)],
    ['preventExtensions', (t) => ReflectPolyfill.preventExtensions(t)],
    ['set', (t) => ReflectPolyfill.set(t, 'x', 1)],
    ['setPrototypeOf', (t) => ReflectPolyfill.setPrototypeOf(t, null)],
  ];

  for (const [name, call] of METHODS) {
    it(name + '() throws a TypeError naming itself', () => {
      for (const bad of [5, 'str', true, null, undefined, Symbol('s')]) {
        expect(() => call(bad)).toThrow(TypeError);
        expect(() => call(bad)).toThrow('Reflect.' + name + ' called on non-object');
      }
    });
  }

  it('accepts functions as targets, not just plain objects', () => {
    const fn = function () {};
    expect(ReflectPolyfill.ownKeys(fn)).toContain('length');
    expect(ReflectPolyfill.isExtensible(fn)).toBe(true);
  });

  /*
   * The distinction the guard introduces: `false` now means only "valid call,
   * operation failed". A non-object target is not a valid call and throws.
   */
  it('still returns false for a valid call that fails', () => {
    const obj = {};
    Object.defineProperty(obj, 'frozen', { value: 1, configurable: false });
    expect(ReflectPolyfill.defineProperty(obj, 'frozen', { value: 2 })).toBe(false);
    expect(ReflectPolyfill.defineProperty(obj, 'ok', { value: 1 })).toBe(true);
  });
});
