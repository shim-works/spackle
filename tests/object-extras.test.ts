import { objectHasOwn } from '../src/modules/es.object.has-own.js';
import { objectSetPrototypeOf } from '../src/modules/es.object.set-prototype-of.js';

/**
 * test262-derived conformance suite for Object.hasOwn (ES2022) and
 * Object.setPrototypeOf (ES2015).
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Object/{hasOwn,setPrototypeOf}/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Object
 */
describe('Object extras — test262 conformance', () => {
  describe('hasOwn', () => {
    it('reports own data properties, not inherited', () => {
      expect(objectHasOwn({ a: 1 }, 'a')).toBe(true);
      expect(objectHasOwn({ a: 1 }, 'b')).toBe(false);
      expect(objectHasOwn({}, 'toString')).toBe(false); // inherited
    });

    it('works on a null-prototype object (the point of hasOwn)', () => {
      const bare = Object.create(null);
      bare.x = 1;
      expect(objectHasOwn(bare, 'x')).toBe(true);
      expect(objectHasOwn(bare, 'y')).toBe(false);
    });

    it('coerces a primitive target (ToObject) and string-keyed index', () => {
      expect(objectHasOwn('ab', 0)).toBe(true);
      expect(objectHasOwn('ab', 5)).toBe(false);
    });

    it('throws TypeError for null / undefined', () => {
      expect(() => objectHasOwn(null, 'a')).toThrow(TypeError);
      expect(() => objectHasOwn(undefined, 'a')).toThrow(TypeError);
    });

    it('matches native', () => {
      expect(objectHasOwn({ a: 1 }, 'a')).toBe((Object as any).hasOwn({ a: 1 }, 'a'));
    });
  });

  describe('setPrototypeOf', () => {
    it('re-points the prototype', () => {
      const obj: any = {};
      objectSetPrototypeOf(obj, Array.prototype);
      expect(obj instanceof Array).toBe(true);
      expect(typeof obj.push).toBe('function');
    });

    it('accepts a null prototype', () => {
      const obj: any = { a: 1 };
      objectSetPrototypeOf(obj, null);
      expect(Object.getPrototypeOf(obj)).toBe(null);
    });

    it('returns the target', () => {
      const obj = {};
      expect(objectSetPrototypeOf(obj, Array.prototype)).toBe(obj);
    });

    it('returns a primitive target unchanged', () => {
      expect(objectSetPrototypeOf(42, Array.prototype)).toBe(42);
    });

    it('throws for null / undefined target, and a bad proto', () => {
      expect(() => objectSetPrototypeOf(null, {})).toThrow(TypeError);
      expect(() => objectSetPrototypeOf({}, 42 as any)).toThrow(TypeError);
    });

    it('matches native', () => {
      const a: any = objectSetPrototypeOf({}, Array.prototype);
      const b: any = Object.setPrototypeOf({}, Array.prototype);
      expect(a instanceof Array).toBe(b instanceof Array);
    });
  });
});
