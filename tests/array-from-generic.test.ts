import { arrayFrom } from '../src/modules/es.array.from.js';
import { arrayOf } from '../src/modules/es.array.of.js';

/**
 * Array.from / Array.of are generic on `this`.
 *
 * `Sub.from(src)` must Construct(Sub), not build a plain Array. Building an
 * Array unconditionally is invisible on every engine with a native Array.from
 * -- but on the floor it silently downgrades every subclass, and the damage
 * shows up somewhere else entirely: the result's .constructor comes back as
 * Array, so ArraySpeciesCreate picks Array and @@species is never consulted.
 *
 * Deliberately an ES5-expressible constructor rather than `class extends Array`
 * -- the transpiled class form tests the transpiler as much as the polyfill.
 */
describe('Array.from / Array.of are generic on `this`', () => {
  const makeCtor = () => {
    const Ctor: any = function (this: any, length?: number) {
      this.length = length || 0;
      this.built = true;
    };
    Ctor.prototype.constructor = Ctor;
    return Ctor;
  };

  describe('arrayFrom', () => {
    it('constructs via `this` on the array-like path', () => {
      const Ctor = makeCtor();
      const out: any = arrayFrom.call(Ctor, { length: 2, 0: 'a', 1: 'b' });
      expect(out instanceof Ctor).toBe(true);
      expect(out.built).toBe(true);
      expect(out.length).toBe(2);
      expect(out[0]).toBe('a');
      expect(out[1]).toBe('b');
    });

    it('constructs via `this` on the iterable path', () => {
      const Ctor = makeCtor();
      const out: any = arrayFrom.call(Ctor, [1, 2, 3]);
      expect(out instanceof Ctor).toBe(true);
      expect(out.length).toBe(3);
      expect(out[2]).toBe(3);
    });

    it('applies mapFn while constructing via `this`', () => {
      const Ctor = makeCtor();
      const out: any = arrayFrom.call(Ctor, [1, 2], (v: number) => v * 10);
      expect(out instanceof Ctor).toBe(true);
      expect(out[0]).toBe(10);
      expect(out[1]).toBe(20);
    });

    it('still yields a plain Array when called as Array.from', () => {
      const out: any = arrayFrom.call(Array, [1, 2]);
      expect(Array.isArray(out)).toBe(true);
      expect(out).toEqual([1, 2]);
    });

    it('still yields a plain Array when called unbound', () => {
      expect(arrayFrom([1, 2] as any)).toEqual([1, 2]);
    });
  });

  describe('arrayOf', () => {
    it('constructs via `this`', () => {
      const Ctor = makeCtor();
      const out: any = arrayOf.call(Ctor, 'x', 'y');
      expect(out instanceof Ctor).toBe(true);
      expect(out.length).toBe(2);
      expect(out[0]).toBe('x');
    });

    it('still yields a plain Array when called as Array.of or unbound', () => {
      expect(Array.isArray(arrayOf.call(Array, 1, 2))).toBe(true);
      expect(arrayOf(1, 2)).toEqual([1, 2]);
    });
  });
});
