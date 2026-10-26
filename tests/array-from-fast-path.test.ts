import { arrayFrom, capture } from '../src/modules/es.array.from.js';

/**
 * The array fast path: once install() has captured the array iterator, a real
 * array whose @@iterator and iterator next are untouched is read by index. Each
 * case checks the result matches what the iterator protocol would give.
 */
describe('Array.from — array fast path', () => {
  beforeAll(() => {
    capture();
  });

  it('copies an array, with mapFn and thisArg', () => {
    expect(arrayFrom([1, 2, 3])).toEqual([1, 2, 3]);
    const ctx = { k: 10 };
    expect(arrayFrom([1, 2], function (this: any, v: number, i: number) { return v * this.k + i; }, ctx)).toEqual([10, 21]);
  });

  it('turns holes into undefined, as the iterator does', () => {
    const out = arrayFrom([1, , 3]);
    expect(out.length).toBe(3);
    expect(1 in out).toBe(true);
    expect(out[1]).toBeUndefined();
  });

  it('re-reads length each step: a mapFn that pushes keeps iterating', () => {
    const src = [1, 2];
    const out = arrayFrom(src, (v: number) => {
      if (src.length < 4) src.push(v + 10);
      return v;
    });
    expect(out).toEqual([1, 2, 11, 12]);
  });

  it('a mapFn that shrinks the source stops early', () => {
    const src = [1, 2, 3, 4];
    const out = arrayFrom(src, (v: number) => {
      src.length = 2;
      return v;
    });
    expect(out).toEqual([1, 2]);
  });

  it('runs an own @@iterator on the array instead', () => {
    const src: any = [1, 2, 3];
    src[Symbol.iterator] = function* () { yield 'own'; };
    expect(arrayFrom(src)).toEqual(['own']);
  });

  it('runs a patched %ArrayIteratorPrototype%.next', () => {
    const proto = Object.getPrototypeOf([][Symbol.iterator]());
    const original = proto.next;
    let calls = 0;
    proto.next = function (this: any) {
      calls++;
      return original.call(this);
    };
    try {
      const out = arrayFrom([1, 2]);
      const seen = calls; // read before toEqual, which iterates too
      expect(out).toEqual([1, 2]);
      expect(seen).toBe(3);
    } finally {
      proto.next = original;
    }
  });

  it('calls a return added to %ArrayIteratorPrototype% when mapFn throws', () => {
    const proto = Object.getPrototypeOf([][Symbol.iterator]());
    let closed = 0;
    proto.return = function () {
      closed++;
      return {};
    };
    try {
      expect(() => arrayFrom([1, 2], () => { throw new Error('boom'); })).toThrow('boom');
      expect(closed).toBe(1);
    } finally {
      delete proto.return;
    }
  });

  it('a constructor `this` gets each value through CreateDataProperty', () => {
    const Ctor: any = function () {};
    const out: any = arrayFrom.call(Ctor, ['a', 'b']);
    expect(out instanceof Ctor).toBe(true);
    expect(out[0]).toBe('a');
    expect(out.length).toBe(2);
  });
});

describe('Array.from — iterator loop', () => {
  it('closes the outer iterator when a mapFn throws after a nested Array.from', () => {
    let closed = 0;
    const iterable: any = {
      [Symbol.iterator]() {
        let i = 0;
        return {
          next: () => ({ value: i++, done: i > 3 }),
          return: () => {
            closed++;
            return {};
          },
        };
      },
    };
    const inner = new Set([1, 2]);
    expect(() =>
      arrayFrom(iterable, (v: number) => {
        arrayFrom(inner, (x: number) => x);
        if (v === 1) throw new Error('outer');
        return v;
      }),
    ).toThrow('outer');
    expect(closed).toBe(1);
  });

  it('does not close when next() throws after a nested mapFn threw', () => {
    let closed = 0;
    let step = 0;
    const iterable: any = {
      [Symbol.iterator]() {
        return {
          next: () => {
            step++;
            if (step === 2) throw new Error('next');
            return { value: step, done: false };
          },
          return: () => {
            closed++;
            return {};
          },
        };
      },
    };
    expect(() =>
      arrayFrom(iterable, (v: number) => {
        try {
          arrayFrom(new Set([1]), () => { throw new Error('inner'); });
        } catch (e) { /* swallowed */ }
        return v;
      }),
    ).toThrow('next');
    expect(closed).toBe(0);
  });
});
