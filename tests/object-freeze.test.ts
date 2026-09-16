import { objectFreeze } from '../src/modules/es.object.freeze.js';


/**
 * test262-derived conformance suite for the Object.freeze polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Object/freeze/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Object/freeze
 *
 * The polyfill exists for one reason: Chrome < 44 / older WebKit THREW when
 * Object.freeze was passed a primitive, but ES2015 specifies it must return the
 * value unchanged. So the wrapper short-circuits primitives and otherwise
 * delegates to the native (ES5) Object.freeze.
 *
 *   - freezes an object: isFrozen, no add/modify/delete
 *   - returns the same object reference
 *   - a primitive argument is returned unchanged (the Chrome < 44 fix)
 *   - freezing is shallow (nested objects stay mutable)
 *
 * Tests run as ES modules (strict mode), so mutating a frozen object throws.
 */
describe('Object.freeze — test262 conformance', () => {
  describe('freezing objects', () => {
    it('returns the same object reference', () => {
      const obj = { a: 1 };
      expect(objectFreeze(obj)).toBe(obj);
    });

    it('makes the object frozen', () => {
      expect(Object.isFrozen(objectFreeze({ a: 1 }))).toBe(true);
    });

    it('prevents modifying an existing property (throws in strict mode)', () => {
      const obj = objectFreeze({ a: 1 });
      expect(() => {
        (obj as any).a = 2;
      }).toThrow(TypeError);
      expect(obj.a).toBe(1);
    });

    it('prevents adding a new property (throws in strict mode)', () => {
      const obj = objectFreeze<{ a: number; b?: number }>({ a: 1 });
      expect(() => {
        obj.b = 2;
      }).toThrow(TypeError);
      expect('b' in obj).toBe(false);
    });

    it('prevents deleting a property (throws in strict mode)', () => {
      const obj = objectFreeze({ a: 1 });
      expect(() => {
        delete (obj as any).a;
      }).toThrow(TypeError);
      expect(obj.a).toBe(1);
    });

    it('freezes arrays (cannot push)', () => {
      const arr = objectFreeze([1, 2, 3]);
      expect(Object.isFrozen(arr)).toBe(true);
      expect(() => {
        arr.push(4);
      }).toThrow(TypeError);
    });
  });

  describe('primitive arguments (the Chrome < 44 fix)', () => {
    it('returns a number unchanged', () => {
      expect(objectFreeze(1 as any)).toBe(1);
    });

    it('returns a string unchanged', () => {
      expect(objectFreeze('str' as any)).toBe('str');
    });

    it('returns a boolean unchanged', () => {
      expect(objectFreeze(true as any)).toBe(true);
    });

    it('returns null and undefined unchanged', () => {
      expect(objectFreeze(null as any)).toBe(null);
      expect(objectFreeze(undefined as any)).toBe(undefined);
    });
  });

  describe('shallow', () => {
    it('does not deep-freeze nested objects', () => {
      const obj = objectFreeze({ nested: { x: 1 } });
      expect(Object.isFrozen(obj.nested)).toBe(false);
      obj.nested.x = 2; // allowed — nested object is not frozen
      expect(obj.nested.x).toBe(2);
    });
  });

  describe('parity vs native', () => {
    it('matches native freezing an object', () => {
      const native = Object.freeze;
      const nativeResult = Object.isFrozen(native({ a: 1 }));
      const specResult = Object.isFrozen(objectFreeze({ a: 1 }));
      expect(specResult).toBe(nativeResult);
    });
  });
});
