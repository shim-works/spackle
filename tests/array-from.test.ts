import { arrayFrom } from '../src/modules/es.array.from.js';


/**
 * test262-derived conformance suite for the Array.from polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Array/from/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/from
 *
 *   - returns a real Array
 *   - source coerced via ToObject; null/undefined throws TypeError
 *   - array-likes read by index up to ToLength(length): negative/NaN/missing
 *     length -> empty; fractional length floored; string length coerced; holes
 *     become undefined
 *   - iterables consumed via Symbol.iterator (string by code point, Set, Map,
 *     custom iterables); the iterator protocol takes priority over .length
 *   - mapFn called with (value, index); honors thisArg; a non-callable mapFn
 *     throws TypeError; mapFn also applies to iterable values
 *
 * Where the polyfill intentionally diverges from spec it is marked
 * KNOWN LIMITATION and asserted against current behaviour.
 */
describe('Array.from — test262 conformance', () => {
  describe('return value', () => {
    it('returns a real Array', () => {
      expect(Array.isArray(arrayFrom({ length: 0 }))).toBe(true);
      expect(Array.isArray(arrayFrom('ab'))).toBe(true);
    });
  });

  describe('source coercion (ToObject)', () => {
    it('throws TypeError on null source', () => {
      expect(() => arrayFrom(null as any)).toThrow(TypeError);
    });

    it('throws TypeError on undefined source', () => {
      expect(() => arrayFrom(undefined as any)).toThrow(TypeError);
    });
  });

  describe('array-like sources', () => {
    it('reads indexed properties up to length', () => {
      expect(arrayFrom({ 0: 'a', 1: 'b', 2: 'c', length: 3 } as any)).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    it('treats a missing length as zero', () => {
      expect(arrayFrom({} as any)).toEqual([]);
    });

    it('coerces a string length', () => {
      expect(arrayFrom({ 0: 'a', 1: 'b', length: '2' } as any)).toEqual([
        'a',
        'b',
      ]);
    });

    it('clamps a negative length to zero', () => {
      expect(arrayFrom({ length: -1 } as any)).toEqual([]);
    });

    it('treats a NaN length as zero', () => {
      expect(arrayFrom({ length: NaN } as any)).toEqual([]);
    });

    it('floors a fractional length', () => {
      expect(arrayFrom({ 0: 'a', 1: 'b', length: 2.9 } as any)).toEqual([
        'a',
        'b',
      ]);
    });

    it('fills holes with undefined', () => {
      expect(arrayFrom({ length: 2 } as any)).toEqual([undefined, undefined]);
    });

    it('handles an empty array-like', () => {
      expect(arrayFrom({ length: 0 } as any)).toEqual([]);
    });
  });

  describe('iterable sources', () => {
    it('splits a string into characters', () => {
      expect(arrayFrom('hello')).toEqual(['h', 'e', 'l', 'l', 'o']);
    });

    it('handles an empty string', () => {
      expect(arrayFrom('')).toEqual([]);
    });

    it('iterates a string by code point (astral chars stay whole)', () => {
      // '𠮷' is a single astral code point (surrogate pair in UTF-16). The
      // string iterator yields one element. (Holds when Symbol.iterator is
      // present — the normal path on Chrome 38 / Safari 9; see KNOWN LIMITATION
      // for the Symbol-absent Safari 7/8 case.)
      expect(arrayFrom('\u{20BB7}')).toEqual(['\u{20BB7}']);
    });

    it('converts a Set to an array of values', () => {
      expect(arrayFrom(new Set([1, 2, 3]))).toEqual([1, 2, 3]);
    });

    it('converts a Map to an array of entries', () => {
      expect(arrayFrom(new Map([['a', 1], ['b', 2]]))).toEqual([
        ['a', 1],
        ['b', 2],
      ]);
    });

    it('closes the iterator (calls return) when mapFn throws mid-iteration', () => {
      // Spec IteratorClose: a throw during iteration must close the iterator
      // before propagating, so a generator/resource is not left open.
      let returned = false;
      const iterable: any = {
        [Symbol.iterator]() {
          let n = 0;
          return {
            next() {
              n++;
              return n <= 3
                ? { value: n, done: false }
                : { value: undefined, done: true };
            },
            return() {
              returned = true;
              return { value: undefined, done: true };
            },
          };
        },
      };
      const boom = () => {
        throw new Error('boom');
      };
      expect(() => arrayFrom(iterable, boom as any)).toThrow('boom');
      expect(returned).toBe(true);
    });

    it('consumes a custom Symbol.iterator', () => {
      const iterable: any = {
        [Symbol.iterator]() {
          let n = 0;
          return {
            next() {
              n++;
              return n <= 3
                ? { value: n, done: false }
                : { value: undefined, done: true };
            },
          };
        },
      };
      expect(arrayFrom(iterable)).toEqual([1, 2, 3]);
    });

    it('prefers the iterator protocol over .length', () => {
      // Has both Symbol.iterator and a (misleading) length; native uses the
      // iterator, yielding ['x'] not the 5 indexed holes.
      const hybrid: any = {
        length: 5,
        [Symbol.iterator]() {
          let done = false;
          return {
            next() {
              if (done) return { value: undefined, done: true };
              done = true;
              return { value: 'x', done: false };
            },
          };
        },
      };
      expect(arrayFrom(hybrid)).toEqual(['x']);
    });
  });

  describe('mapFn', () => {
    it('applies mapFn with (value, index) to an array-like', () => {
      const out = arrayFrom({ 0: 10, 1: 20, length: 2 } as any, (v, i) => v + i);
      expect(out).toEqual([10, 21]);
    });

    it('applies mapFn to iterable values', () => {
      expect(arrayFrom(new Set([1, 2, 3]), (v) => v * 2)).toEqual([2, 4, 6]);
    });

    it('honors thisArg', () => {
      const ctx = { factor: 10 };
      const out = arrayFrom(
        { 0: 1, 1: 2, length: 2 } as any,
        function (this: typeof ctx, v: number) {
          return v * this.factor;
        },
        ctx,
      );
      expect(out).toEqual([10, 20]);
    });

    it('throws TypeError when mapFn is provided but not callable', () => {
      expect(() => arrayFrom([1, 2], 5 as any)).toThrow(TypeError);
    });
  });

  describe('KNOWN LIMITATIONS (documented divergence from spec)', () => {
    // Spec: Array.from is generic — called as C.from() with `this` a constructor,
    // it builds an instance of C. This polyfill always returns a plain Array.
    // Out of scope for the TV runtime. Asserted so the gap is explicit.
    it('always returns a plain Array, ignoring a subclass `this`', () => {
      class MyArray extends Array {}
      const out = (arrayFrom as any).call(MyArray, { 0: 'a', length: 1 });
      expect(out instanceof MyArray).toBe(false);
      expect(Array.isArray(out)).toBe(true);
    });

    // On Safari 7/8 (no native Symbol; es6-symbol does not patch
    // String.prototype[Symbol.iterator]), the string-iterable branch is skipped
    // and strings fall through to the array-like branch, which iterates by UTF-16
    // code unit — splitting astral code points. Cannot be reproduced here because
    // the test environment has a native Symbol (so the astral test above passes).
    // Documented in the polyfill source.
  });

  describe('parity vs native', () => {
    it('matches native converting an array-like with a map function', () => {
      const arrayLike = { 0: 1, 1: 2, 2: 3, length: 3 } as any;
      const mapFn = (v: number) => v * 2;
      const nativeResult = Array.from(arrayLike, mapFn);
      const specResult = arrayFrom(arrayLike, mapFn);
      expect(specResult).toEqual(nativeResult);
    });
  });
});
