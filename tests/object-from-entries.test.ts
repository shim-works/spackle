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

  describe('generic iterables (spec: the Symbol.iterator protocol)', () => {
    // Formerly a documented limitation: only arrays of pairs and forEach-bearing
    // objects were read, and anything else returned {}. Now any iterable is
    // consumed, as AddEntriesFromIterable specifies.
    it('consumes a custom iterable', () => {
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
      expect(objectFromEntries(iterable)).toEqual({ a: 1 });
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

describe('Object.fromEntries — inherited key names', () => {
  it('makes own data properties for __proto__ and toString, prototype untouched', () => {
    const o = objectFromEntries([['__proto__', 1], ['toString', 2], ['plain', 3]]);
    expect(Object.getPrototypeOf(o)).toBe(Object.prototype);
    expect(Object.getOwnPropertyDescriptor(o, '__proto__')).toEqual({ value: 1, writable: true, enumerable: true, configurable: true });
    expect(o.toString).toBe(2);
    expect(o.plain).toBe(3);
  });

  it('reads the key, then the value, then converts the key', () => {
    const log: string[] = [];
    const key = { toString: () => (log.push('key->string'), 'k') };
    const entry: any = {};
    Object.defineProperty(entry, 0, { get: () => (log.push('get 0'), key) });
    Object.defineProperty(entry, 1, { get: () => (log.push('get 1'), 'v') });
    expect(objectFromEntries([entry]).k).toBe('v');
    expect(log).toEqual(['get 0', 'get 1', 'key->string']);
  });
});
