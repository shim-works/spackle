import { objectGetOwnPropertyDescriptors } from '../src/modules/es.object.get-own-property-descriptors.js';


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
    it('includes enumerable Symbol-keyed properties', () => {
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

    it('includes non-enumerable Symbol-keyed properties', () => {
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
