import { objectEntries } from '../src/modules/es.object.entries.js';


/**
 * test262-derived conformance suite for the Object.entries polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Object/entries/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Object/entries
 *
 *   - returns an array of own enumerable [key, value] pairs
 *   - target coerced via ToObject; null/undefined target throws TypeError
 *   - primitive target is boxed (string -> indexed entries)
 *   - only own enumerable properties (not inherited, not non-enumerable)
 *   - integer-indexed keys ordered ascending before insertion-order string keys
 *   - values read via Get (getters invoked)
 *   - Symbol keys are excluded — this matches spec, not a limitation
 */
describe('Object.entries — test262 conformance', () => {
  describe('return value', () => {
    it('returns own enumerable [key, value] pairs', () => {
      expect(objectEntries({ a: 1, b: 2 })).toEqual([
        ['a', 1],
        ['b', 2],
      ]);
    });

    it('returns an empty array for an empty object', () => {
      expect(objectEntries({})).toEqual([]);
    });
  });

  describe('target coercion (ToObject)', () => {
    it('throws TypeError on null target', () => {
      expect(() => objectEntries(null as any)).toThrow(TypeError);
    });

    it('throws TypeError on undefined target', () => {
      expect(() => objectEntries(undefined as any)).toThrow(TypeError);
    });

    it('boxes a primitive string into indexed entries', () => {
      expect(objectEntries('abc' as any)).toEqual([
        ['0', 'a'],
        ['1', 'b'],
        ['2', 'c'],
      ]);
    });
  });

  describe('property selection', () => {
    it('skips inherited properties', () => {
      const source: any = Object.create({ inherited: true });
      source.own = 'yes';
      expect(objectEntries(source)).toEqual([['own', 'yes']]);
    });

    it('skips own non-enumerable properties', () => {
      const source: any = {};
      Object.defineProperty(source, 'hidden', { value: 1, enumerable: false });
      source.visible = 2;
      expect(objectEntries(source)).toEqual([['visible', 2]]);
    });
  });

  describe('key order', () => {
    it('orders integer keys ascending before insertion-order string keys', () => {
      const source: any = {};
      source.b = 'b';
      source[2] = 'two';
      source.a = 'a';
      source[1] = 'one';
      expect(objectEntries(source)).toEqual([
        ['1', 'one'],
        ['2', 'two'],
        ['b', 'b'],
        ['a', 'a'],
      ]);
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
      expect(objectEntries(source)).toEqual([['a', 42]]);
      expect(reads).toBe(1);
    });
  });

  describe('Symbol keys (spec parity, not a limitation)', () => {
    // Object.entries returns only String-keyed own enumerable properties by
    // spec; Symbol keys are excluded. The polyfill matches this exactly.
    it('excludes Symbol-keyed properties', () => {
      const sym = Symbol('s');
      const source: any = { a: 1 };
      source[sym] = 2;
      expect(objectEntries(source)).toEqual([['a', 1]]);
    });
  });

  describe('parity vs native', () => {
    it('matches native for a mixed object', () => {
      const obj = { name: 'test', value: 'hello', n: 3 };
      const nativeResult = Object.entries(obj);
      const specResult = objectEntries(obj);
      expect(specResult).toEqual(nativeResult);
    });
  });
});
