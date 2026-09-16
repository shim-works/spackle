import { objectValues } from '../src/modules/es.object.values.js';


/**
 * test262-derived conformance suite for the Object.values polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Object/values/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Object/values
 *
 *   - returns an array of own enumerable values
 *   - target coerced via ToObject; null/undefined target throws TypeError
 *   - primitive target is boxed (string -> indexed chars)
 *   - only own enumerable properties (not inherited, not non-enumerable)
 *   - integer-indexed keys ordered ascending before insertion-order string keys
 *   - values read via Get (getters invoked)
 *   - Symbol keys are excluded — this matches spec, not a limitation
 */
describe('Object.values — test262 conformance', () => {
  describe('return value', () => {
    it('returns own enumerable values', () => {
      expect(objectValues({ a: 1, b: 2 })).toEqual([1, 2]);
    });

    it('returns an empty array for an empty object', () => {
      expect(objectValues({})).toEqual([]);
    });
  });

  describe('target coercion (ToObject)', () => {
    it('throws TypeError on null target', () => {
      expect(() => objectValues(null as any)).toThrow(TypeError);
    });

    it('throws TypeError on undefined target', () => {
      expect(() => objectValues(undefined as any)).toThrow(TypeError);
    });

    it('boxes a primitive string into indexed chars', () => {
      expect(objectValues('abc' as any)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('property selection', () => {
    it('skips inherited properties', () => {
      const source: any = Object.create({ inherited: true });
      source.own = 'yes';
      expect(objectValues(source)).toEqual(['yes']);
    });

    it('skips own non-enumerable properties', () => {
      const source: any = {};
      Object.defineProperty(source, 'hidden', { value: 1, enumerable: false });
      source.visible = 2;
      expect(objectValues(source)).toEqual([2]);
    });
  });

  describe('key order', () => {
    it('orders integer keys ascending before insertion-order string keys', () => {
      const source: any = {};
      source.b = 'b';
      source[2] = 'two';
      source.a = 'a';
      source[1] = 'one';
      expect(objectValues(source)).toEqual(['one', 'two', 'b', 'a']);
    });
  });

  describe('accessor semantics', () => {
    it('reads values via Get (invokes getters)', () => {
      let reads = 0;
      const source = {
        get a() {
          reads++;
          return 42;
        },
      };
      expect(objectValues(source)).toEqual([42]);
      expect(reads).toBe(1);
    });
  });

  describe('Symbol keys (spec parity, not a limitation)', () => {
    // Object.values returns only String-keyed own enumerable values by spec;
    // Symbol keys are excluded. The polyfill matches this exactly.
    it('excludes Symbol-keyed values', () => {
      const sym = Symbol('s');
      const source: any = { a: 1 };
      source[sym] = 2;
      expect(objectValues(source)).toEqual([1]);
    });
  });

  describe('parity vs native', () => {
    it('matches native for a mixed object', () => {
      const obj = { name: 'test', value: 'hello', n: 3 };
      const nativeResult = Object.values(obj);
      const specResult = objectValues(obj);
      expect(specResult).toEqual(nativeResult);
    });
  });
});
