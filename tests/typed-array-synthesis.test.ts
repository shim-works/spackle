/*
 * Safari 7.1-9 shape: no %TypedArray%, every type straight on Object, with own
 * set/subarray and instance length/buffer. Faked here by moving the natives off
 * %TypedArray%, BEFORE the island loads (it reads the shape at load). Each test
 * file gets its own page, so this cannot leak.
 */
const NAMES = ['Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array'];
const g: any = globalThis;
const realParent = Object.getPrototypeOf(Int8Array.prototype);
const ownOld = ['subarray', 'length', 'byteLength', 'byteOffset', 'buffer', Symbol.toStringTag];
const nativeSet = realParent.set;
for (const name of NAMES) {
  const C = g[name];
  for (const key of ownOld) Object.defineProperty(C.prototype, key, Object.getOwnPropertyDescriptor(realParent, key)!);
  // a set that truncates instead of throwing RangeError: the island must replace it
  Object.defineProperty(C.prototype, 'set', {
    value: function (this: any, src: any, offset?: number) {
      try { nativeSet.call(this, src, offset); } catch (e) { /* old WebKit-style: silent */ }
    },
    writable: true,
    configurable: true,
  });
  Object.setPrototypeOf(C.prototype, Object.prototype);
  Object.setPrototypeOf(C, Function.prototype);
}

const { installTypedArray } = await import('../src/modules/install-typed-array.js');
installTypedArray();

describe('synthesised %TypedArray% (engines without one)', () => {
  const Parent: any = Object.getPrototypeOf(Int8Array);

  it('reparents all nine types onto one shared parent', () => {
    expect(Parent).not.toBe(Function.prototype);
    expect(Parent).not.toBe(realParent.constructor);
    for (const name of NAMES) {
      expect(Object.getPrototypeOf(g[name])).toBe(Parent);
      expect(Object.getPrototypeOf(g[name].prototype)).toBe(Parent.prototype);
      expect(new g[name](1) instanceof Parent).toBe(true);
    }
    expect(Object.getPrototypeOf(Parent.prototype)).toBe(Object.prototype);
  });

  it('the parent is abstract', () => {
    expect(() => Parent()).toThrow(TypeError);
    expect(() => new Parent()).toThrow(TypeError);
  });

  it('members live once on the parent, not per type', () => {
    for (const key of ['map', 'filter', 'at', 'includes', 'toSorted', 'values', 'sort', 'fill']) {
      expect(typeof Parent.prototype[key]).toBe('function');
      for (const name of NAMES) expect(Object.prototype.hasOwnProperty.call(g[name].prototype, key)).toBe(false);
    }
    expect(typeof Parent.from).toBe('function');
    expect(Object.prototype.hasOwnProperty.call(Uint8Array, 'from')).toBe(false);
  });

  it('a broken own set is cleared so the parent one is reached', () => {
    for (const name of NAMES) expect(Object.prototype.hasOwnProperty.call(g[name].prototype, 'set')).toBe(false);
    expect(() => new Uint8Array(2).set([1, 2, 3])).toThrow(RangeError);
    const a = new Uint8Array(4);
    a.set([7, 8], 1);
    expect(Array.from(a)).toEqual([0, 7, 8, 0]);
  });

  it('the types still work', () => {
    const a = new Int32Array([3, 1, 2]);
    expect(Array.from(a.map((v: number) => v * 2))).toEqual([6, 2, 4]);
    expect(Array.from(a.toSorted())).toEqual([1, 2, 3]);
    expect([...a]).toEqual([3, 1, 2]);
    expect(Array.from(Uint8Array.from([1, 2]))).toEqual([1, 2]);
    expect(Uint8Array.from([1]) instanceof Uint8Array).toBe(true);
    expect(a.subarray(1).length).toBe(2);
    expect(Object.prototype.toString.call(a)).toBe('[object Int32Array]');
  });
});
