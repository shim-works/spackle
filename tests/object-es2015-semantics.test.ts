import { isObjectGetOwnPropertyDescriptorSupported, objectGetOwnPropertyDescriptor } from '../src/modules/es.object.get-own-property-descriptor.js';
import { objectGetOwnPropertyNames } from '../src/modules/es.object.get-own-property-names.js';
import { objectGetPrototypeOf } from '../src/modules/es.object.get-prototype-of.js';
import { objectIsExtensible } from '../src/modules/es.object.is-extensible.js';
import { objectIsFrozen } from '../src/modules/es.object.is-frozen.js';
import { objectKeys } from '../src/modules/es.object.keys.js';
import { objectPreventExtensions } from '../src/modules/es.object.prevent-extensions.js';
import { objectSeal } from '../src/modules/es.object.seal.js';


/**
 * test262-derived conformance suite for the ES2015-semantics Object statics.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/Object/{keys,getOwnPropertyNames,getPrototypeOf,isExtensible,
 * isFrozen,preventExtensions,seal,getOwnPropertyDescriptor}/
 *
 * All eight exist since ES5 — the islands cover the ES2015 semantic change:
 * ES5 natives threw TypeError on primitive args, ES2015 boxes them
 * (keys/getOwnPropertyNames/getPrototypeOf/getOwnPropertyDescriptor) or
 * answers without throwing (isExtensible false, isFrozen true,
 * preventExtensions/seal pass the primitive back).
 */
describe('Object statics — ES2015 primitive semantics', () => {
  describe('objectKeys', () => {
    it('returns own enumerable keys of an object', () => {
      expect(objectKeys({ a: 1, b: 2 })).toEqual(['a', 'b']);
    });

    it('boxes a string primitive (index keys)', () => {
      expect(objectKeys('ab')).toEqual(['0', '1']);
    });

    it('returns [] for number and boolean primitives', () => {
      expect(objectKeys(42)).toEqual([]);
      expect(objectKeys(true)).toEqual([]);
    });

    it('still throws on null/undefined (ToObject rejects them)', () => {
      expect(() => objectKeys(null)).toThrow(TypeError);
      expect(() => objectKeys(undefined)).toThrow(TypeError);
    });

    it('matches native on objects', () => {
      const source = { x: 1, y: 2, z: 3 };
      expect(objectKeys(source)).toEqual(Object.keys(source));
    });
  });

  describe('objectGetOwnPropertyNames', () => {
    it('includes non-enumerable own keys', () => {
      const target = {};
      Object.defineProperty(target, 'hidden', { value: 1, enumerable: false });
      expect(objectGetOwnPropertyNames(target)).toContain('hidden');
    });

    it('boxes a string primitive (indices + length)', () => {
      const names = objectGetOwnPropertyNames('ab');
      expect(names).toContain('0');
      expect(names).toContain('1');
      expect(names).toContain('length');
    });
  });

  describe('objectGetPrototypeOf', () => {
    it('returns the prototype of an object', () => {
      const proto = { p: 1 };
      expect(objectGetPrototypeOf(Object.create(proto))).toBe(proto);
    });

    it('boxes primitives to their wrapper prototypes', () => {
      expect(objectGetPrototypeOf('a')).toBe(String.prototype);
      expect(objectGetPrototypeOf(1)).toBe(Number.prototype);
      expect(objectGetPrototypeOf(true)).toBe(Boolean.prototype);
    });
  });

  describe('objectGetOwnPropertyDescriptor', () => {
    it('returns the descriptor of an own property', () => {
      const descriptor = objectGetOwnPropertyDescriptor({ a: 1 }, 'a');
      expect(descriptor).toEqual({
        value: 1,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    });

    it('boxes a string primitive', () => {
      const descriptor = objectGetOwnPropertyDescriptor('a', 0);
      expect(descriptor && descriptor.value).toBe('a');
    });

    it('returns undefined for a missing key', () => {
      expect(objectGetOwnPropertyDescriptor({}, 'nope')).toBeUndefined();
    });

    it('probe reports modern engines as supported', () => {
      expect(isObjectGetOwnPropertyDescriptorSupported()).toBe(true);
    });
  });

  describe('objectIsExtensible', () => {
    it('answers for objects', () => {
      expect(objectIsExtensible({})).toBe(true);
      expect(objectIsExtensible(Object.preventExtensions({}))).toBe(false);
    });

    it('returns false for primitives instead of throwing', () => {
      expect(objectIsExtensible(1)).toBe(false);
      expect(objectIsExtensible('a')).toBe(false);
      expect(objectIsExtensible(null)).toBe(false);
      expect(objectIsExtensible(undefined)).toBe(false);
    });
  });

  describe('objectIsFrozen', () => {
    it('answers for objects', () => {
      expect(objectIsFrozen({})).toBe(false);
      expect(objectIsFrozen(Object.freeze({}))).toBe(true);
    });

    it('returns true for primitives instead of throwing', () => {
      expect(objectIsFrozen(1)).toBe(true);
      expect(objectIsFrozen('a')).toBe(true);
      expect(objectIsFrozen(null)).toBe(true);
    });
  });

  describe('objectPreventExtensions', () => {
    it('prevents extensions on an object and returns it', () => {
      const target = {};
      expect(objectPreventExtensions(target)).toBe(target);
      expect(Object.isExtensible(target)).toBe(false);
    });

    it('passes primitives straight back', () => {
      expect(objectPreventExtensions(1)).toBe(1);
      expect(objectPreventExtensions('a')).toBe('a');
      expect(objectPreventExtensions(null)).toBe(null);
    });
  });

  describe('objectSeal', () => {
    it('seals an object and returns it', () => {
      const target = { a: 1 };
      expect(objectSeal(target)).toBe(target);
      expect(Object.isSealed(target)).toBe(true);
    });

    it('passes primitives straight back', () => {
      expect(objectSeal(1)).toBe(1);
      expect(objectSeal('a')).toBe('a');
      expect(objectSeal(undefined)).toBe(undefined);
    });
  });
});
