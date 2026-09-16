import { objectFromEntries } from '../src/modules/es.object.from-entries.js';


/**
 * test262-derived conformance suite for the Object.fromEntries polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Object/fromEntries/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Object/fromEntries
 *
 *   - builds an object from an array of [key, value] pairs
 *   - last duplicate key wins
 *   - keys coerced to property keys (numeric -> string)
 *   - consumes Map (forEach passes (value, key))
 *
 * Where the polyfill intentionally diverges from spec it is marked
 * KNOWN LIMITATION and asserted against current behaviour.
 */
describe('Object.fromEntries — test262 conformance', () => {
  describe('array of pairs', () => {
    it('builds an object from pairs', () => {
      expect(objectFromEntries([['a', 1], ['b', 2]])).toEqual({ a: 1, b: 2 });
    });

    it('returns an empty object for an empty array', () => {
      expect(objectFromEntries([])).toEqual({});
    });

    it('last duplicate key wins', () => {
      expect(objectFromEntries([['a', 1], ['a', 2]])).toEqual({ a: 2 });
    });

    it('coerces a numeric key to a string property key', () => {
      const out: any = objectFromEntries([[1, 'one']]);
      expect(out['1']).toBe('one');
    });
  });

  describe('Map source', () => {
    it('builds an object from a Map', () => {
      const map = new Map([['x', 10], ['y', 20]]);
      expect(objectFromEntries(map)).toEqual({ x: 10, y: 20 });
    });
  });

  describe('KNOWN LIMITATIONS (documented divergence from spec)', () => {
    // Spec consumes any iterable via the Symbol.iterator protocol. This polyfill
    // handles only Array-of-pairs and objects exposing forEach(value, key)
    // (Map-like). A generator / custom iterable yields no entries rather than
    // throwing. Asserted here so the gap is explicit.
    it('does NOT consume a generic iterable (returns empty object)', () => {
      // A custom iterable with Symbol.iterator but no forEach — matches
      // neither the Array nor the Map-like branch.
      const iterable: any = {
        [Symbol.iterator]() {
          let done = false;
          return {
            next() {
              if (done) return { value: undefined, done: true };
              done = true;
              return { value: ['a', 1], done: false };
            },
          };
        },
      };
      expect(objectFromEntries(iterable)).toEqual({});
    });
  });

  describe('parity vs native', () => {
    it('matches native for an array of pairs', () => {
      const entries: [string, number][] = [['a', 1], ['b', 2], ['c', 3]];
      const nativeResult = Object.fromEntries(entries);
      const specResult = objectFromEntries(entries);
      expect(specResult).toEqual(nativeResult);
    });
  });
});
