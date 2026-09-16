import { Reflect as ReflectPolyfill } from '../src/modules/_reflect-impl.js';

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

  it('ownKeys() includes Symbol keys when present', () => {
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
