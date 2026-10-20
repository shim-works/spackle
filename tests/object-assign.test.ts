import { SymbolPolyfill, hideSymbolKeys } from '../src/modules/es.symbol.js';
import { objectAssign } from '../src/modules/es.object.assign.js';

/**
 * test262-derived conformance suite for the Object.assign polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Object/assign/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Object/assign
 *
 *   - returns the target object
 *   - target coerced via ToObject; null/undefined target throws TypeError
 *   - null/undefined sources are ignored
 *   - only own enumerable properties are copied (not inherited, not non-enum)
 *   - Symbol-keyed own enumerable properties are copied
 *   - source values read via Get (getters invoked)
 *   - target values written via Set (setters invoked)
 *   - integer-indexed keys copied in ascending order before string keys
 *   - writing a non-writable target property throws TypeError (strict [[Set]])
 *   - a property deleted by an earlier source getter is skipped
 *   - a getter that throws propagates and halts assignment
 *
 * Where the polyfill intentionally diverges from spec it is marked
 * KNOWN LIMITATION and asserted against current behaviour so the gap is
 * explicit rather than silent.
 */
describe('Object.assign — test262 conformance', () => {
  describe('return value', () => {
    it('returns the target (same reference)', () => {
      const target = {};
      expect(objectAssign(target, { a: 1 })).toBe(target);
    });
  });

  describe('target coercion (ToObject)', () => {
    it('throws TypeError on null target', () => {
      expect(() => objectAssign(null)).toThrow(TypeError);
    });

    it('throws TypeError on undefined target', () => {
      expect(() => objectAssign(undefined)).toThrow(TypeError);
    });

    it('boxes a primitive target and copies onto the wrapper', () => {
      const result = objectAssign(1, { a: 'b' });
      expect(typeof result).toBe('object');
      expect((result as any).a).toBe('b');
    });
  });

  describe('source handling', () => {
    it('ignores null and undefined sources without throwing', () => {
      expect(objectAssign({}, null, { a: 1 }, undefined)).toEqual({ a: 1 });
    });

    it('coerces a primitive source to an object and copies its indices', () => {
      // 'abc' -> { 0:'a', 1:'b', 2:'c' }
      expect(objectAssign({}, 'abc')).toEqual({ 0: 'a', 1: 'b', 2: 'c' });
    });

    it('overwrites with later sources (last wins)', () => {
      expect(objectAssign({}, { a: 1 }, { a: 2 })).toEqual({ a: 2 });
    });
  });

  describe('property selection', () => {
    it('copies only own enumerable properties (skips inherited)', () => {
      const proto = { inherited: true };
      const source = Object.create(proto);
      source.own = 'yes';
      expect(objectAssign({}, source)).toEqual({ own: 'yes' });
    });

    it('skips own non-enumerable properties', () => {
      const source = {};
      Object.defineProperty(source, 'hidden', {
        value: 1,
        enumerable: false,
      });
      (source as any).visible = 2;
      expect(objectAssign({}, source)).toEqual({ visible: 2 });
    });
  });

  describe('accessor semantics', () => {
    it('invokes getters on the source', () => {
      let reads = 0;
      const source = {
        get a() {
          reads++;
          return 42;
        },
      };
      const out = objectAssign({}, source);
      expect(out).toEqual({ a: 42 });
      expect(reads).toBe(1);
    });

    it('invokes setters on the target ([[Set]] semantics)', () => {
      let written: number | undefined;
      const target = {};
      Object.defineProperty(target, 'a', {
        set(v: number) {
          written = v;
        },
        get() {
          return written;
        },
        enumerable: true,
        configurable: true,
      });
      objectAssign(target, { a: 7 });
      expect(written).toBe(7);
    });
  });

  describe('error propagation', () => {
    it('propagates a throwing getter and halts further copying', () => {
      const source = {
        get bad(): never {
          throw new Error('boom');
        },
      };
      expect(() => objectAssign({}, source)).toThrow('boom');
    });
  });

  describe('own-key visit order', () => {
    it('reads integer-indexed keys ascending, then string keys in insertion order', () => {
      const order: string[] = [];
      const source = {};
      const recordingGetter = (label: string) => ({
        enumerable: true,
        configurable: true,
        get() {
          order.push(label);
          return label;
        },
      });
      // Defined out of order on purpose; integer keys must sort ahead of strings.
      Object.defineProperty(source, 'b', recordingGetter('b'));
      Object.defineProperty(source, '2', recordingGetter('2'));
      Object.defineProperty(source, 'a', recordingGetter('a'));
      Object.defineProperty(source, '1', recordingGetter('1'));

      objectAssign({}, source);
      expect(order).toEqual(['1', '2', 'b', 'a']);
    });
  });

  describe('[[Set]] semantics on target', () => {
    it('throws TypeError writing to a non-writable target property (strict)', () => {
      const target = {};
      Object.defineProperty(target, 'a', {
        value: 1,
        writable: false,
        enumerable: true,
        configurable: true,
      });
      expect(() => objectAssign(target, { a: 2 })).toThrow(TypeError);
    });
  });

  describe('source mutation during copy', () => {
    it('skips a source property deleted by an earlier getter', () => {
      const source: any = {};
      Object.defineProperty(source, 'a', {
        enumerable: true,
        configurable: true,
        get() {
          delete source.b;
          return 1;
        },
      });
      source.b = 2;
      expect(objectAssign({}, source)).toEqual({ a: 1 });
    });
  });

  describe('Symbol-keyed properties', () => {
    // test262 requires own enumerable Symbol-keyed properties to be copied.
    // When the runtime has real Symbols + Object.getOwnPropertySymbols (Chrome
    // 38 / Safari 9+, or the Symbol polyfill), the polyfill copies them. On an
    // engine without Symbols there are no Symbol keys to copy anyway.
    it('copies own enumerable Symbol-keyed properties', () => {
      const sym = Symbol('s');
      const source: any = {};
      source[sym] = 1;
      const out = objectAssign({}, source) as any;
      expect(out[sym]).toBe(1);
    });

    it('does NOT copy non-enumerable Symbol-keyed properties', () => {
      const sym = Symbol('s');
      const source: any = {};
      Object.defineProperty(source, sym, { value: 1, enumerable: false });
      const out = objectAssign({}, source) as any;
      expect(out[sym]).toBeUndefined();
    });
  });

  describe('parity vs native', () => {

    it('merges multiple sources', () => {
      const s1 = { b: 2 };
      const s2 = { c: 3 };
      const nativeResult = Object.assign({ a: 1 }, s1, s2);
      const specResult = objectAssign({ a: 1 }, s1, s2);
      expect(specResult).toEqual(nativeResult);
    });

    it('copies many string keys', () => {
      const big: Record<string, number> = {};
      for (let i = 0; i < 50; i++) big[`k${i}`] = i;
      const nativeResult = Object.assign({}, big);
      const specResult = objectAssign({}, big);
      expect(specResult).toEqual(nativeResult);
    });
  });
});

/**
 * The Symbol-shim path, which is where this used to break.
 *
 * On an engine with no native Symbol, es.symbol installs a shim whose keys are
 * `@@`-prefixed strings, and patches everything that enumerates -- including
 * Object.assign -- to hide them. That replacement is the assign a Safari 7.1
 * device actually ends up with, so it has to keep the spec's opening steps:
 * reject a nullish target, box a primitive one.
 */
describe('Object.assign under the Symbol shim', () => {
  const withShim = (fn: () => void): void => {
    const savedAssign = Object.assign;
    const savedKeys = Object.keys;
    const savedStringify = JSON.stringify;
    const savedEntries = Object.entries;
    const savedValues = Object.values;
    const savedNames = Object.getOwnPropertyNames;
    hideSymbolKeys();
    try {
      fn();
    } finally {
      Object.assign = savedAssign;
      Object.keys = savedKeys;
      JSON.stringify = savedStringify;
      (Object as any).entries = savedEntries;
      (Object as any).values = savedValues;
      Object.getOwnPropertyNames = savedNames;
    }
  };

  it('throws on a nullish target', () => {
    withShim(() => {
      expect(() => (Object.assign as any)(null)).toThrow(TypeError);
      expect(() => (Object.assign as any)(undefined, { a: 1 })).toThrow(TypeError);
    });
  });

  it('boxes a primitive target instead of returning it raw', () => {
    withShim(() => {
      const out: any = (Object.assign as any)('abc', { extra: 1 });
      expect(typeof out).toBe('object');
      expect(out.extra).toBe(1);
      expect(String(out)).toBe('abc');
    });
  });

  it('still copies normally and still hides shimmed symbol keys', () => {
    withShim(() => {
      expect(Object.assign({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });

      const source: any = {};
      source[SymbolPolyfill('hidden') as any] = 'nope';
      source.visible = 'yes';
      const copy: any = Object.assign({}, source);
      expect(copy.visible).toBe('yes');
      expect(Object.keys(copy)).toEqual(['visible']);
    });
  });

  it('is marked as spackle-installed', () => {
    withShim(() => {
      expect((Object.assign as any).__polyfilled).toBe(true);
    });
  });
});

/**
 * Regression: Chromium 41-49 crashed with
 * "Object.getOwnPropertySymbols called on non-object".
 *
 * ES5 says getOwnPropertySymbols/getOwnPropertyNames THROW on a primitive;
 * ES2015 redefined them to ToObject the argument first. Chrome 41-49 ship the
 * older behaviour, so forwarding a raw source crashes there and works
 * everywhere else -- which is why this reached a real device.
 *
 * jsdom's V8 coerces, so asserting on the result alone can never fail here.
 * These tests install a getOwnPropertySymbols that throws the way the old
 * engine did, and re-import so the module captures THAT at load.
 */
describe('Object.assign with primitive sources (Chromium 41 regression)', () => {
  // These re-import the island after faking an ES5 reflection API, so the
  // fake is captured at module scope. The ES5 browser bundle has no `vi` and
  // cannot re-import: there the run is "not possible", not a failure.
  const canReimport = typeof (globalThis as any).vi !== 'undefined';

  const withEs5Symbols = async (
    body: (assign: (t: any, ...s: any[]) => any) => void,
  ) => {
    const real = Object.getOwnPropertySymbols;
    Object.getOwnPropertySymbols = function (target: any) {
      if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
        throw new TypeError('Object.getOwnPropertySymbols called on non-object');
      }
      return real(target);
    } as any;
    vi.resetModules();
    try {
      const fresh = await import('../src/modules/es.object.assign.js');
      body(fresh.objectAssign);
    } finally {
      Object.getOwnPropertySymbols = real;
      vi.resetModules();
    }
  };

  it.skipIf(!canReimport)('accepts a number source', async () => {
    await withEs5Symbols((assign) => {
      expect(assign({ a: 1 }, 5)).toEqual({ a: 1 });
    });
  });

  it.skipIf(!canReimport)('accepts a boolean source', async () => {
    await withEs5Symbols((assign) => {
      expect(assign({ a: 1 }, true)).toEqual({ a: 1 });
    });
  });

  // A string boxes to indexed own properties, so unlike the other primitives
  // it actually contributes something.
  it.skipIf(!canReimport)('copies the indexed properties of a string source', async () => {
    await withEs5Symbols((assign) => {
      expect(assign({}, 'ab')).toEqual({ 0: 'a', 1: 'b' });
    });
  });

  it.skipIf(!canReimport)('still copies symbol keys from object sources', async () => {
    await withEs5Symbols((assign) => {
      const key = Symbol('k');
      const source: any = {};
      source[key] = 1;
      expect(assign({}, 5, source, 'x')[key]).toBe(1);
    });
  });
});
