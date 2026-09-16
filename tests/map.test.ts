import { Map as MapPolyfill } from '../src/modules/es.map.js';

/**
 * test262-derived conformance suite for the local Map polyfill island.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Map/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Map
 *
 *   - constructor requires `new`; consumes an iterable of [key, value] pairs
 *   - set/get/has/delete/clear/size; set is chainable; delete returns boolean
 *   - keys compared by SameValueZero (NaN matches NaN; -0 and +0 are one key,
 *     normalised to +0 on iteration)
 *   - object keys are distinct by identity; primitive keys distinct by type
 *   - insertion-order iteration (forEach + keys/values/entries)
 *   - Object.prototype.toString tag is "[object Map]"
 *
 * This island is intentionally O(n) (parallel arrays) — Maps in the TV/React
 * runtime are small, and this sheds the es6-map dependency chain. Deep spec
 * minutiae beyond these cases are out of scope (see TEST262-PROGRESS.md).
 */
describe('Map — test262 conformance', () => {
  describe('constructor', () => {
    it('throws without new', () => {
      expect(() => (MapPolyfill as any)()).toThrow(TypeError);
    });

    it('is empty by default (size 0)', () => {
      expect(new MapPolyfill().size).toBe(0);
    });

    it('builds from an array of pairs', () => {
      const m = new MapPolyfill([
        ['a', 1],
        ['b', 2],
      ]);
      expect(m.size).toBe(2);
      expect(m.get('a')).toBe(1);
      expect(m.get('b')).toBe(2);
    });

    it('builds from a generic iterable (Symbol.iterator)', () => {
      const iterable: any = {
        [Symbol.iterator]() {
          const pairs: [string, number][] = [['x', 10], ['y', 20]];
          let i = 0;
          return {
            next() {
              return i < pairs.length
                ? { value: pairs[i++], done: false }
                : { value: undefined, done: true };
            },
          };
        },
      };
      const m = new MapPolyfill(iterable);
      expect(m.get('x')).toBe(10);
      expect(m.get('y')).toBe(20);
    });

    it('treats null/undefined iterable as empty', () => {
      expect(new MapPolyfill(null as any).size).toBe(0);
      expect(new MapPolyfill(undefined).size).toBe(0);
    });

    it('throws TypeError when an entry is not an object', () => {
      expect(() => new MapPolyfill([1 as any])).toThrow(TypeError);
    });
  });

  describe('set / get / has / delete / clear / size', () => {
    it('set returns the map (chainable)', () => {
      const m = new MapPolyfill();
      expect(m.set('a', 1)).toBe(m);
      m.set('b', 2).set('c', 3);
      expect(m.size).toBe(3);
    });

    it('last write wins for an existing key', () => {
      const m = new MapPolyfill();
      m.set('a', 1).set('a', 2);
      expect(m.get('a')).toBe(2);
      expect(m.size).toBe(1);
    });

    it('has reflects membership; get returns undefined when absent', () => {
      const m = new MapPolyfill();
      m.set('a', 1);
      expect(m.has('a')).toBe(true);
      expect(m.has('z')).toBe(false);
      expect(m.get('z')).toBeUndefined();
    });

    it('delete removes and returns boolean', () => {
      const m = new MapPolyfill();
      m.set('a', 1);
      expect(m.delete('a')).toBe(true);
      expect(m.delete('a')).toBe(false);
      expect(m.has('a')).toBe(false);
    });

    it('clear empties the map', () => {
      const m = new MapPolyfill([['a', 1], ['b', 2]]);
      m.clear();
      expect(m.size).toBe(0);
      expect(m.get('a')).toBeUndefined();
    });
  });

  describe('key equality', () => {
    it('distinguishes object keys by identity', () => {
      const k1 = {};
      const k2 = {};
      const m = new MapPolyfill();
      m.set(k1, 'one').set(k2, 'two');
      expect(m.get(k1)).toBe('one');
      expect(m.get(k2)).toBe('two');
      expect(m.size).toBe(2);
    });

    it('distinguishes primitive keys by type (1 vs "1")', () => {
      const m = new MapPolyfill();
      m.set(1, 'number').set('1', 'string');
      expect(m.get(1)).toBe('number');
      expect(m.get('1')).toBe('string');
      expect(m.size).toBe(2);
    });

    it('treats NaN as a single retrievable key (SameValueZero)', () => {
      const m = new MapPolyfill();
      m.set(NaN, 'nan');
      expect(m.get(NaN)).toBe('nan');
      expect(m.has(NaN)).toBe(true);
    });

    it('treats -0 and +0 as the same key, normalised to +0', () => {
      const m = new MapPolyfill();
      m.set(-0, 'zero');
      expect(m.get(0)).toBe('zero');
      expect(m.size).toBe(1);
      const firstKey = Array.from(m.keys())[0];
      expect(Object.is(firstKey, 0)).toBe(true);
    });
  });

  describe('iteration (insertion order)', () => {
    it('forEach visits in insertion order with (value, key, map)', () => {
      const m = new MapPolyfill([['a', 1], ['b', 2]]);
      const seen: Array<[string, number, unknown]> = [];
      m.forEach(function (this: unknown, v: number, k: string, map: unknown) {
        seen.push([k, v, map]);
      });
      expect(seen).toEqual([
        ['a', 1, m],
        ['b', 2, m],
      ]);
    });

    it('forEach honors thisArg', () => {
      const m = new MapPolyfill([['a', 1]]);
      const ctx = { tag: 'ctx' };
      let captured: unknown;
      m.forEach(function (this: unknown) {
        captured = this;
      }, ctx);
      expect(captured).toBe(ctx);
    });

    it('keys/values/entries yield in insertion order', () => {
      const m = new MapPolyfill([['a', 1], ['b', 2]]);
      expect(Array.from(m.keys())).toEqual(['a', 'b']);
      expect(Array.from(m.values())).toEqual([1, 2]);
      expect(Array.from(m.entries())).toEqual([['a', 1], ['b', 2]]);
    });

    it('is spreadable via Symbol.iterator', () => {
      const m = new MapPolyfill([['a', 1], ['b', 2]]);
      expect([...m]).toEqual([['a', 1], ['b', 2]]);
    });
  });

  describe('toStringTag', () => {
    it('reports [object Map]', () => {
      expect(Object.prototype.toString.call(new MapPolyfill())).toBe(
        '[object Map]',
      );
    });

    it('is non-writable, unlike ordinary methods (from test262)', () => {
      const desc = Object.getOwnPropertyDescriptor(MapPolyfill.prototype, Symbol.toStringTag)!;
      expect(desc.writable).toBe(false);
      expect(desc.configurable).toBe(true);
    });
  });

  describe('parity vs native', () => {

    it('matches native for set/get round-trips', () => {
      const roundTrip = (Ctor: any) => () => {
        const m = new Ctor();
        m.set('a', 1).set('b', 2);
        return m.get('a') + m.get('b');
      };
      const nativeResult = (roundTrip(Map))();
      const specResult = (roundTrip(MapPolyfill))();
      expect(specResult).toBe(nativeResult);
    });
  });
});
