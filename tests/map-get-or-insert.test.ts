import { weakMapGetOrInsert } from '../src/modules/es.weak-map.get-or-insert.js';
import { weakMapGetOrInsertComputed } from '../src/modules/es.weak-map.get-or-insert-computed.js';
import { mapGetOrInsertComputed } from '../src/modules/es.map.get-or-insert-computed.js';
import '../src/modules/es.map.get-or-insert.js';
import '../src/modules/es.map.get-or-insert-computed.js';
import '../src/modules/es.weak-map.get-or-insert.js';
import '../src/modules/es.weak-map.get-or-insert-computed.js';

/**
 * https://tc39.es/proposal-upsert/
 *
 * Importing the four islands installs them onto the live Map/WeakMap (jsdom's
 * natives have neither method), so these exercise the real installed methods.
 */
describe('Map.prototype.getOrInsert', () => {
  it('returns the existing value without overwriting', () => {
    const map = new Map([['a', 1]]);
    expect((map as any).getOrInsert('a', 99)).toBe(1);
    expect(map.get('a')).toBe(1);
    expect(map.size).toBe(1);
  });

  it('inserts and returns the value when the key is absent', () => {
    const map = new Map();
    expect((map as any).getOrInsert('a', 1)).toBe(1);
    expect(map.get('a')).toBe(1);
  });

  it('matches keys by SameValueZero, so NaN finds NaN', () => {
    const map = new Map();
    (map as any).getOrInsert(NaN, 'first');
    expect((map as any).getOrInsert(NaN, 'second')).toBe('first');
    expect(map.size).toBe(1);
  });

  it('treats undefined as a real stored value, not a miss', () => {
    const map = new Map([['a', undefined]]);
    expect((map as any).getOrInsert('a', 'fallback')).toBe(undefined);
  });
});

describe('Map.prototype.getOrInsertComputed', () => {
  it('does not invoke the callback when the key is present', () => {
    const map = new Map([['a', 1]]);
    let calls = 0;
    const result = (map as any).getOrInsertComputed('a', () => {
      calls++;
      return 99;
    });
    expect(result).toBe(1);
    expect(calls).toBe(0);
  });

  it('invokes the callback with the key, inserts, and returns', () => {
    const map = new Map();
    const seen: any[] = [];
    const result = (map as any).getOrInsertComputed('a', (key: any) => {
      seen.push(key);
      return 1;
    });
    expect(seen).toEqual(['a']);
    expect(result).toBe(1);
    expect(map.get('a')).toBe(1);
  });

  it('writes the computed value even if the callback inserted the key itself', () => {
    const map = new Map();
    const result = (map as any).getOrInsertComputed('a', () => {
      map.set('a', 'from callback');
      return 'computed';
    });
    expect(result).toBe('computed');
    expect(map.get('a')).toBe('computed');
  });

  it('throws on a non-callable callback', () => {
    const map = new Map();
    expect(() => (map as any).getOrInsertComputed('a', 1)).toThrow(TypeError);
  });
});

describe('WeakMap.prototype.getOrInsert / getOrInsertComputed', () => {
  it('round-trips on an object key', () => {
    const weakMap = new WeakMap();
    const key = {};
    expect((weakMap as any).getOrInsert(key, 1)).toBe(1);
    expect((weakMap as any).getOrInsert(key, 99)).toBe(1);
  });

  it('rejects a primitive key', () => {
    const weakMap = new WeakMap();
    expect(() => (weakMap as any).getOrInsert('x', 1)).toThrow(TypeError);
  });

  it('rejects a primitive key before running the callback', () => {
    const weakMap = new WeakMap();
    let calls = 0;
    expect(() =>
      (weakMap as any).getOrInsertComputed('x', () => {
        calls++;
        return 1;
      })
    ).toThrow(TypeError);
    expect(calls).toBe(0);
  });

  it('computes and inserts on an object key', () => {
    const weakMap = new WeakMap();
    const key = {};
    expect((weakMap as any).getOrInsertComputed(key, () => 1)).toBe(1);
    expect(weakMap.get(key)).toBe(1);
  });
});


/**
 * Regressions from real test262.
 */
describe('spec conformance regressions (from test262)', () => {
  it('accepts a non-registered symbol as a weak key', () => {
    // CanBeHeldWeakly covers symbols, not just objects and functions
    const weakMap = new WeakMap();
    const key = Symbol('weak');
    expect(weakMapGetOrInsert.call(weakMap, key, 1)).toBe(1);
    expect(weakMapGetOrInsert.call(weakMap, key, 99)).toBe(1);
  });

  it('rejects a REGISTERED symbol — it can never be collected', () => {
    const weakMap = new WeakMap();
    expect(() => weakMapGetOrInsert.call(weakMap, Symbol.for('registered'), 1))
      .toThrow(TypeError);
  });

  it('rejects a Map receiver, which has has/get/set and would otherwise slip through', () => {
    expect(() => weakMapGetOrInsert.call(new Map() as any, {}, 1)).toThrow(TypeError);
    expect(() => weakMapGetOrInsertComputed.call(new Map() as any, {}, () => 1))
      .toThrow(TypeError);
  });

  it('canonicalises -0 to +0 before the callback and before storing', () => {
    const map = new Map();
    let seen: any;
    mapGetOrInsertComputed.call(map, -0, (key: any) => {
      seen = key;
      return 'v';
    });
    // Object.is distinguishes -0 from +0, which is the whole point
    expect(seen).toBe(0);
    expect(Object.is(seen, -0)).toBe(false);
    expect(Array.from(map.keys())[0]).toBe(0);
  });
});
