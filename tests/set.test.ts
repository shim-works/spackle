import { Set as SetPolyfill } from '../src/modules/es.set.js';

/**
 * test262-derived conformance suite for the local Set polyfill island.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Set/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Set
 *
 *   - constructor requires `new`; consumes an iterable of values
 *   - add is chainable and de-duplicates; has/delete/clear/size
 *   - values compared by SameValueZero (NaN matches NaN; -0 and +0 are one
 *     value, normalised to +0 on iteration)
 *   - insertion-order iteration (forEach + keys/values/entries)
 *   - forEach callback receives (value, value, set) and honors thisArg
 *   - entries() yields [value, value]; Symbol.iterator is values()
 *   - Object.prototype.toString tag is "[object Set]"
 *
 * This island is intentionally O(n) (single backing array) — Sets in the
 * TV/React runtime are small, and this sheds the es6-set dependency chain.
 */
describe('Set — test262 conformance', () => {
  describe('constructor', () => {
    it('throws without new', () => {
      expect(() => (SetPolyfill as any)()).toThrow(TypeError);
    });

    it('is empty by default (size 0)', () => {
      expect(new SetPolyfill().size).toBe(0);
    });

    it('builds from an array, de-duplicating', () => {
      const s = new SetPolyfill([1, 2, 2, 3]);
      expect(s.size).toBe(3);
      expect(s.has(1)).toBe(true);
      expect(s.has(2)).toBe(true);
      expect(s.has(3)).toBe(true);
    });

    it('builds from a generic iterable (Symbol.iterator)', () => {
      const iterable: any = {
        [Symbol.iterator]() {
          const vals = ['x', 'y'];
          let i = 0;
          return {
            next() {
              return i < vals.length
                ? { value: vals[i++], done: false }
                : { value: undefined, done: true };
            },
          };
        },
      };
      const s = new SetPolyfill(iterable);
      expect(s.has('x')).toBe(true);
      expect(s.has('y')).toBe(true);
    });

    it('treats null/undefined iterable as empty', () => {
      expect(new SetPolyfill(null as any).size).toBe(0);
      expect(new SetPolyfill(undefined).size).toBe(0);
    });
  });

  describe('add / has / delete / clear / size', () => {
    it('add returns the set (chainable)', () => {
      const s = new SetPolyfill();
      expect(s.add(1)).toBe(s);
      s.add(2).add(3);
      expect(s.size).toBe(3);
    });

    it('add de-duplicates (no size change for an existing value)', () => {
      const s = new SetPolyfill();
      s.add('a').add('a');
      expect(s.size).toBe(1);
    });

    it('has reflects membership', () => {
      const s = new SetPolyfill();
      s.add('a');
      expect(s.has('a')).toBe(true);
      expect(s.has('z')).toBe(false);
    });

    it('delete removes and returns boolean', () => {
      const s = new SetPolyfill();
      s.add('a');
      expect(s.delete('a')).toBe(true);
      expect(s.delete('a')).toBe(false);
      expect(s.has('a')).toBe(false);
    });

    it('clear empties the set', () => {
      const s = new SetPolyfill([1, 2, 3]);
      s.clear();
      expect(s.size).toBe(0);
      expect(s.has(1)).toBe(false);
    });
  });

  describe('value equality', () => {
    it('distinguishes object values by identity', () => {
      const a = {};
      const b = {};
      const s = new SetPolyfill();
      s.add(a).add(b).add(a);
      expect(s.size).toBe(2);
    });

    it('distinguishes primitive values by type (1 vs "1")', () => {
      const s = new SetPolyfill();
      s.add(1).add('1');
      expect(s.size).toBe(2);
    });

    it('treats NaN as a single value (SameValueZero)', () => {
      const s = new SetPolyfill();
      s.add(NaN).add(NaN);
      expect(s.size).toBe(1);
      expect(s.has(NaN)).toBe(true);
    });

    it('treats -0 and +0 as the same value, normalised to +0', () => {
      const s = new SetPolyfill();
      s.add(-0);
      expect(s.has(0)).toBe(true);
      expect(s.size).toBe(1);
      const first = Array.from(s.values())[0];
      expect(Object.is(first, 0)).toBe(true);
    });
  });

  describe('iteration (insertion order)', () => {
    it('forEach visits in insertion order with (value, value, set)', () => {
      const s = new SetPolyfill(['a', 'b']);
      const seen: Array<[unknown, unknown, unknown]> = [];
      s.forEach(function (v1: unknown, v2: unknown, set: unknown) {
        seen.push([v1, v2, set]);
      });
      expect(seen).toEqual([
        ['a', 'a', s],
        ['b', 'b', s],
      ]);
    });

    it('forEach honors thisArg', () => {
      const s = new SetPolyfill(['a']);
      const ctx = { tag: 'ctx' };
      let captured: unknown;
      s.forEach(function (this: unknown) {
        captured = this;
      }, ctx);
      expect(captured).toBe(ctx);
    });

    it('keys/values/entries yield in insertion order', () => {
      const s = new SetPolyfill(['a', 'b']);
      expect(Array.from(s.keys())).toEqual(['a', 'b']);
      expect(Array.from(s.values())).toEqual(['a', 'b']);
      expect(Array.from(s.entries())).toEqual([
        ['a', 'a'],
        ['b', 'b'],
      ]);
    });

    it('is spreadable via Symbol.iterator (values)', () => {
      const s = new SetPolyfill(['a', 'b']);
      expect([...s]).toEqual(['a', 'b']);
    });
  });

  describe('toStringTag', () => {
    it('reports [object Set]', () => {
      expect(Object.prototype.toString.call(new SetPolyfill())).toBe(
        '[object Set]',
      );
    });

    it('is non-writable, unlike ordinary methods (from test262)', () => {
      const desc = Object.getOwnPropertyDescriptor(SetPolyfill.prototype, Symbol.toStringTag)!;
      expect(desc.writable).toBe(false);
      expect(desc.configurable).toBe(true);
    });
  });

  describe('parity vs native', () => {

    it('matches native for add/has round-trips', () => {
      const roundTrip = (Ctor: any) => () => {
        const s = new Ctor();
        s.add('a').add('b').add('a');
        return s.has('a') && s.has('b') && s.size === 2;
      };
      const nativeResult = (roundTrip(Set))();
      const specResult = (roundTrip(SetPolyfill))();
      expect(specResult).toBe(nativeResult);
    });

    it('matches native at scale', () => {
      // N inserts then 2N membership checks (N hits + N misses) — proves the
      // O(n) spec scan behaves at scale, not just at n=2.
      const N = 1000;
      const items: string[] = [];
      for (let i = 0; i < N; i++) items.push('item-' + i);
      const work = (Ctor: any) => () => {
        const s = new Ctor();
        for (let i = 0; i < N; i++) s.add(items[i]);
        let hits = 0;
        for (let i = 0; i < N; i++) if (s.has(items[i])) hits++;
        for (let i = 0; i < N; i++) if (s.has('missing-' + i)) hits++;
        return hits;
      };
      const nativeResult = (work(Set))();
      const specResult = (work(SetPolyfill))();
      expect(specResult).toBe(nativeResult);
    });
  });
});
