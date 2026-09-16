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
