import { objectGetOwnPropertyDescriptors } from '../src/modules/es.object.get-own-property-descriptors.js';
import { symbolIsShimmed } from './engine-capabilities.js';


/**
 * test262-derived conformance suite for the Object.getOwnPropertyDescriptors
 * polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/Object/getOwnPropertyDescriptors/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Object/getOwnPropertyDescriptors
 *
 *   - returns a full descriptor for each own property
 *   - includes own non-enumerable properties
 *   - returns accessor descriptors (get/set) for accessors
 *   - excludes inherited properties
 *
 * Where the polyfill intentionally diverges from spec it is marked
 * KNOWN LIMITATION and asserted against current behaviour.
 */
describe('Object.getOwnPropertyDescriptors — test262 conformance', () => {
  describe('data descriptors', () => {
    it('returns a full descriptor per own property', () => {
      expect(objectGetOwnPropertyDescriptors({ a: 1 })).toEqual({
        a: { value: 1, writable: true, enumerable: true, configurable: true },
      });
    });

    it('returns an empty map for an empty object', () => {
      expect(objectGetOwnPropertyDescriptors({})).toEqual({});
    });

    it('includes own non-enumerable properties', () => {
      const source = {};
      Object.defineProperty(source, 'hidden', {
        value: 42,
        enumerable: false,
      });
      const out = objectGetOwnPropertyDescriptors(source);
      expect(out.hidden.value).toBe(42);
      expect(out.hidden.enumerable).toBe(false);
    });
  });

  describe('accessor descriptors', () => {
    it('returns get/set functions for accessors', () => {
      const source = {
        get foo() {
          return 1;
        },
        set foo(_v: number) {
          /* noop */
        },
      };
      const out = objectGetOwnPropertyDescriptors(source);
      expect(typeof out.foo.get).toBe('function');
      expect(typeof out.foo.set).toBe('function');
    });
  });

  describe('property selection', () => {
    it('excludes inherited properties', () => {
      const source: any = Object.create({ inherited: true });
      source.own = 'yes';
      expect(Object.keys(objectGetOwnPropertyDescriptors(source))).toEqual([
        'own',
      ]);
    });
  });

  describe('Symbol-keyed properties', () => {
    // Spec includes ALL Symbol-keyed own properties, enumerable or not. When the
    // runtime has real Symbols + getOwnPropertySymbols (Chrome 38 / Safari 9+,
    // or the Symbol polyfill) the polyfill includes them. Same Symbol-key family
    // as Object.assign.
    // Shimmed symbols are '@@name' STRING keys, and hideSymbolKeys() filters
    // them out of getOwnPropertyNames — so on a Symbol-less engine there is no
    // symbol-keyed descriptor to find. Unfixable in ES5, not a defect.
    it.skipIf(symbolIsShimmed())('includes enumerable Symbol-keyed properties', () => {
      const sym = Symbol('s');
      const source: any = { a: 1 };
      source[sym] = 2;
      const out = objectGetOwnPropertyDescriptors(source) as any;
      expect(out[sym]).toEqual({
        value: 2,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    });

    it.skipIf(symbolIsShimmed())('includes non-enumerable Symbol-keyed properties', () => {
      const sym = Symbol('s');
      const source: any = {};
      Object.defineProperty(source, sym, { value: 9, enumerable: false });
      const out = objectGetOwnPropertyDescriptors(source) as any;
      expect(out[sym].value).toBe(9);
      expect(out[sym].enumerable).toBe(false);
    });
  });

  describe('parity vs native', () => {
    it('matches native for a mixed object', () => {
      const obj = { a: 1, b: 'hello' };
      const nativeResult = Object.getOwnPropertyDescriptors(obj);
      const specResult = objectGetOwnPropertyDescriptors(obj);
      expect(specResult).toEqual(nativeResult);
    });
  });
});

/**
 * Same Chromium 41-49 regression as Object.assign: ES5 has
 * getOwnPropertyNames/getOwnPropertySymbols THROW on a primitive, ES2015 has
 * them ToObject it first. Both natives are captured at module load here, so the
 * stubs go in before the re-import.
 */
describe('Object.getOwnPropertyDescriptors with a primitive (Chromium 41 regression)', () => {
  // These re-import the island after faking an ES5 reflection API, so the
  // fake is captured at module scope. The ES5 browser bundle has no `vi` and
  // cannot re-import: there the run is "not possible", not a failure.
  const canReimport = typeof (globalThis as any).vi !== 'undefined';

  const withEs5Reflection = async (
    body: (descriptors: (o: any) => PropertyDescriptorMap) => void,
  ) => {
    const realNames = Object.getOwnPropertyNames;
    const realSymbols = Object.getOwnPropertySymbols;
    const reject = (target: any, what: string) => {
      if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
        throw new TypeError('Object.' + what + ' called on non-object');
      }
    };
    Object.getOwnPropertyNames = function (target: any) {
      reject(target, 'getOwnPropertyNames');
      return realNames(target);
    } as any;
    Object.getOwnPropertySymbols = function (target: any) {
      reject(target, 'getOwnPropertySymbols');
      return realSymbols(target);
    } as any;
    vi.resetModules();
    try {
      const fresh = await import('../src/modules/es.object.get-own-property-descriptors.js');
      body(fresh.objectGetOwnPropertyDescriptors);
    } finally {
      Object.getOwnPropertyNames = realNames;
      Object.getOwnPropertySymbols = realSymbols;
      vi.resetModules();
    }
  };

  it.skipIf(!canReimport)('boxes a string and describes its indices', async () => {
    await withEs5Reflection((descriptors) => {
      const result = descriptors('ab');
      expect(result[0]!.value).toBe('a');
      expect(result[1]!.value).toBe('b');
      expect(result.length!.value).toBe(2);
    });
  });

  it.skipIf(!canReimport)('boxes a number into an empty descriptor map', async () => {
    await withEs5Reflection((descriptors) => {
      expect(descriptors(5)).toEqual({});
    });
  });

  // ToObject still rejects these -- Object() would quietly box them to {}.
  it.skipIf(!canReimport)('throws TypeError on null and undefined', async () => {
    await withEs5Reflection((descriptors) => {
      expect(() => descriptors(null)).toThrow(TypeError);
      expect(() => descriptors(undefined)).toThrow(TypeError);
    });
  });
});
