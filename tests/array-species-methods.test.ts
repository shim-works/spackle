import {
  arrayConcat,
  isSupported as isArrayConcatSupported,
} from '../src/modules/es.array.concat.js';
import { arrayFilter, isSupported as isArrayFilterSupported } from '../src/modules/es.array.filter.js';
import { arrayMap, isSupported as isArrayMapSupported } from '../src/modules/es.array.map.js';
import { arraySlice } from '../src/modules/es.array.slice.js';
import { arraySplice } from '../src/modules/es.array.splice.js';


/**
 * test262-derived conformance suite for the species-aware Array methods.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/Array/prototype/{map,filter,slice,splice,concat}/
 *
 * All five are ES5 methods — the islands cover the ES2015 semantic additions:
 * ArraySpeciesCreate for the output array, and Symbol.isConcatSpreadable for
 * concat. Mostly gated existence-only in the mount (see the [scope] notes), so
 * these exercise the islands directly. concat is the exception — its gate is
 * behavioural, and has its own case at the bottom.
 */
describe('Array species-aware methods — test262 conformance', () => {
  // a subclass-ish constructor wired via Symbol.species
  class Tagged extends Array {
    static get [Symbol.species]() {
      return Tagged;
    }
  }

  describe('arrayMap', () => {
    it('maps values with index and array args', () => {
      expect(arrayMap.call([1, 2, 3], (v: number, i: number) => v * 10 + i)).toEqual([
        10, 21, 32,
      ]);
    });

    it('skips holes', () => {
      // eslint-disable-next-line no-sparse-arrays
      const out = arrayMap.call([1, , 3], (v: number) => v * 2);
      expect(out[0]).toBe(2);
      expect(1 in out).toBe(false);
      expect(out[2]).toBe(6);
    });

    it('honors thisArg', () => {
      const context = { factor: 3 };
      const out = arrayMap.call(
        [1, 2],
        function (this: any, v: number) {
          return v * this.factor;
        },
        context
      );
      expect(out).toEqual([3, 6]);
    });

    it('throws on a non-callable callback', () => {
      expect(() => arrayMap.call([1], 'nope' as any)).toThrow(TypeError);
    });

    it('creates the output via Symbol.species', () => {
      const source = Tagged.from([1, 2]);
      const out = arrayMap.call(source, (v: number) => v * 2);
      expect(out instanceof Tagged).toBe(true);
      expect(Array.prototype.slice.call(out)).toEqual([2, 4]);
    });

    it('matches native', () => {
      const source = [1, 2, 3];
      const mapper = (v: number, i: number) => v + i;
      expect(arrayMap.call(source, mapper)).toEqual(source.map(mapper));
    });
  });

  describe('arrayFilter', () => {
    it('keeps matching values in order', () => {
      expect(arrayFilter.call([1, 2, 3, 4], (v: number) => v % 2 === 0)).toEqual([2, 4]);
    });

    it('skips holes entirely', () => {
      // eslint-disable-next-line no-sparse-arrays
      expect(arrayFilter.call([1, , 3], () => true)).toEqual([1, 3]);
    });

    it('creates the output via Symbol.species', () => {
      const source = Tagged.from([1, 2, 3]);
      const out = arrayFilter.call(source, (v: number) => v > 1);
      expect(out instanceof Tagged).toBe(true);
    });

    it('matches native', () => {
      const source = [5, 1, 4, 2];
      const predicate = (v: number) => v > 2;
      expect(arrayFilter.call(source, predicate)).toEqual(source.filter(predicate));
    });
  });

  describe('arraySlice', () => {
    it('slices with positive and negative indices', () => {
      expect(arraySlice.call([1, 2, 3, 4], 1, 3)).toEqual([2, 3]);
      expect(arraySlice.call([1, 2, 3, 4], -2)).toEqual([3, 4]);
      expect(arraySlice.call([1, 2, 3, 4], 0, -1)).toEqual([1, 2, 3]);
    });

    it('copies the whole array with no args, preserving holes', () => {
      // eslint-disable-next-line no-sparse-arrays
      const out = arraySlice.call([1, , 3]);
      expect(out.length).toBe(3);
      expect(1 in out).toBe(false);
    });

    it('creates the output via Symbol.species', () => {
      const source = Tagged.from([1, 2, 3]);
      expect(arraySlice.call(source, 1) instanceof Tagged).toBe(true);
    });

    it('matches native across index combos', () => {
      const source = [1, 2, 3, 4, 5];
      const combos: [any, any][] = [
        [undefined, undefined],
        [2, undefined],
        [-3, undefined],
        [1, 4],
        [1, -1],
        [-4, -2],
        [10, 20],
        [2.9, 4.9],
      ];
      for (const [start, end] of combos) {
        expect(arraySlice.call(source, start, end)).toEqual(source.slice(start, end));
      }
    });
  });

  describe('arraySplice', () => {
    it('removes and returns elements, mutating in place', () => {
      const arr = [1, 2, 3, 4, 5];
      const removed = arraySplice.call(arr, 1, 2);
      expect(removed).toEqual([2, 3]);
      expect(arr).toEqual([1, 4, 5]);
    });

    it('inserts without deleting', () => {
      const arr = [1, 4];
      const removed = arraySplice.call(arr, 1, 0, 2, 3);
      expect(removed).toEqual([]);
      expect(arr).toEqual([1, 2, 3, 4]);
    });

    it('replaces (delete + insert of different sizes)', () => {
      const arr = [1, 2, 3];
      const removed = arraySplice.call(arr, 1, 1, 9, 8, 7);
      expect(removed).toEqual([2]);
      expect(arr).toEqual([1, 9, 8, 7, 3]);
    });

    it('handles negative start and omitted deleteCount', () => {
      const arr = [1, 2, 3, 4];
      const removed = arraySplice.call(arr, -2);
      expect(removed).toEqual([3, 4]);
      expect(arr).toEqual([1, 2]);
    });

    it('creates the removed array via Symbol.species', () => {
      const source = Tagged.from([1, 2, 3]);
      expect(arraySplice.call(source, 0, 1) instanceof Tagged).toBe(true);
    });

    it('matches native across arg combos', () => {
      const combos: any[][] = [[], [1], [1, 1], [1, 0, 'x'], [-1, 5], [0, 99], [2, 1, 'a', 'b']];
      for (const args of combos) {
        const mine = [1, 2, 3, 4];
        const theirs = [1, 2, 3, 4];
        const myRemoved = arraySplice.apply(mine, args as any);
        const theirRemoved = Array.prototype.splice.apply(theirs, args as any);
        expect(myRemoved).toEqual(theirRemoved);
        expect(mine).toEqual(theirs);
      }
    });
  });

  describe('arrayConcat', () => {
    it('spreads arrays and appends non-arrays whole', () => {
      expect(arrayConcat.call([1], [2, 3], 4, [5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('keeps holes when spreading', () => {
      // eslint-disable-next-line no-sparse-arrays
      const out = arrayConcat.call([1, , 3], [4]);
      expect(out.length).toBe(4);
      expect(1 in out).toBe(false);
    });

    it('honors Symbol.isConcatSpreadable = false on an array', () => {
      const stuck: any = [2, 3];
      stuck[Symbol.isConcatSpreadable] = false;
      const out = arrayConcat.call([1], stuck);
      expect(out.length).toBe(2);
      expect(out[1]).toBe(stuck);
    });

    it('honors Symbol.isConcatSpreadable = true on an array-like object', () => {
      const spreadable: any = { 0: 'a', 1: 'b', length: 2 };
      spreadable[Symbol.isConcatSpreadable] = true;
      expect(arrayConcat.call([1], spreadable)).toEqual([1, 'a', 'b']);
    });

    it('creates the output via Symbol.species', () => {
      const source = Tagged.from([1]);
      expect(arrayConcat.call(source, [2]) instanceof Tagged).toBe(true);
    });

    it('matches native', () => {
      expect(arrayConcat.call([1, 2], [3], 'x', [[4]])).toEqual([1, 2].concat([3], 'x', [[4]]));
    });
  });

  /*
   * The gate, not the island.
   *
   * Chrome 41 was reported failing this: it has concat and (once es.symbol
   * backfills it) Symbol.isConcatSpreadable, but its concat ignores the flag.
   * An existence-only gate leaves that native in place and the wrong answer
   * stands. Standing in for Chrome 41 here with an ES1-era concat.
   */
  describe('isSupported', () => {
    const native = Array.prototype.concat;
    afterEach(() => {
      Array.prototype.concat = native;
    });

    it('accepts an engine that honours the flag both ways', () => {
      expect(isArrayConcatSupported()).toBe(true);
    });

    it('rejects a concat that ignores the flag', () => {
      Array.prototype.concat = function (this: any[], ...args: any[]) {
        const out: any[] = this.slice();
        for (const arg of args) {
          if (Array.isArray(arg)) out.push(...arg);
          else out.push(arg);
        }
        return out;
      } as any;
      expect(isArrayConcatSupported()).toBe(false);
    });
  });
});

// core-js's arrayMethodHasSpeciesSupport, decided by the native Array[@@species]
describe('map / filter gates', () => {
  const gates = [isArrayMapSupported, isArrayFilterSupported];
  const saved = Object.getOwnPropertyDescriptor(Array, Symbol.species)!;
  afterEach(() => {
    Object.defineProperty(Array, Symbol.species, saved);
  });

  it('keep a native that ships Array[@@species]', () => {
    for (const gate of gates) expect(gate()).toBe(true);
  });

  it('replace the native when Array[@@species] is missing (Chrome < 51, Safari < 10)', () => {
    delete (Array as any)[Symbol.species];
    for (const gate of gates) expect(gate()).toBe(false);
  });

  it('do not count spackle\'s own @@species getter as native support', () => {
    const get: any = function () { return this; };
    Object.defineProperty(get, '__polyfilled', { value: true });
    Object.defineProperty(Array, Symbol.species, { get, configurable: true });
    for (const gate of gates) expect(gate()).toBe(false);
  });
});
