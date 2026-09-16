import { WeakMap as WeakMapPolyfill } from '../src/modules/es.weak-map.js';

/**
 * test262-derived conformance suite for the local WeakMap polyfill island.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/WeakMap/
 * https://github.com/tc39/test262/tree/main/test/built-ins/WeakMap
 *
 *   - constructor requires `new`; consumes an iterable of [object, value] pairs
 *   - set throws TypeError on a non-object key; get/has/delete tolerate them
 *   - set is chainable; delete returns boolean
 *   - object keys are distinct by identity; same object overwrites
 *   - the implementation marker is a non-enumerable hidden property on the key
 *   - Object.prototype.toString tag is "[object WeakMap]"
 *
 * This island uses the hidden-property technique (value stored on the key
 * object, GC'd with the key), which sheds the es6-weak-map dependency chain but
 * carries one inherent gap — see KNOWN LIMITATIONS.
 */
describe('WeakMap — test262 conformance', () => {
  describe('constructor', () => {
    it('throws without new', () => {
      expect(() => (WeakMapPolyfill as any)()).toThrow(TypeError);
    });

    it('builds from an array of [object, value] pairs', () => {
      const a = {};
      const b = {};
      const wm = new WeakMapPolyfill([
        [a, 1],
        [b, 2],
      ]);
      expect(wm.get(a)).toBe(1);
      expect(wm.get(b)).toBe(2);
    });

    it('treats null/undefined iterable as empty', () => {
      const k = {};
      expect(new WeakMapPolyfill(null as any).has(k)).toBe(false);
      expect(new WeakMapPolyfill(undefined).has(k)).toBe(false);
    });
  });

  describe('set / get / has / delete', () => {
    it('set throws TypeError on a non-object key', () => {
      const wm = new WeakMapPolyfill();
      expect(() => wm.set('x' as any, 1)).toThrow(TypeError);
      expect(() => wm.set(1 as any, 1)).toThrow(TypeError);
    });

    it('round-trips an object key', () => {
      const wm = new WeakMapPolyfill();
      const k = {};
      wm.set(k, 42);
      expect(wm.has(k)).toBe(true);
      expect(wm.get(k)).toBe(42);
    });

    it('set is chainable', () => {
      const wm = new WeakMapPolyfill();
      const a = {};
      const b = {};
      expect(wm.set(a, 1)).toBe(wm);
      wm.set(a, 1).set(b, 2);
      expect(wm.get(b)).toBe(2);
    });

    it('delete removes and returns boolean', () => {
      const wm = new WeakMapPolyfill();
      const k = {};
      wm.set(k, 1);
      expect(wm.delete(k)).toBe(true);
      expect(wm.delete(k)).toBe(false);
      expect(wm.has(k)).toBe(false);
    });

    it('get/has tolerate absent and non-object keys without throwing', () => {
      const wm = new WeakMapPolyfill();
      expect(wm.get({})).toBeUndefined();
      expect(wm.has({})).toBe(false);
      expect(wm.get('x' as any)).toBeUndefined();
      expect(wm.has('x' as any)).toBe(false);
      expect(wm.delete('x' as any)).toBe(false);
    });

    it('distinguishes object keys by identity; same object overwrites', () => {
      const wm = new WeakMapPolyfill();
      const a = {};
      const b = {};
      wm.set(a, 'a').set(b, 'b').set(a, 'a2');
      expect(wm.get(a)).toBe('a2');
      expect(wm.get(b)).toBe('b');
    });
  });

  describe('hidden marker', () => {
    it('stores via a non-enumerable property (invisible to keys/for-in)', () => {
      const wm = new WeakMapPolyfill();
      const k: any = {};
      wm.set(k, 1);
      expect(Object.keys(k)).toEqual([]);
      const inForIn: string[] = [];
      for (const p in k) inForIn.push(p);
      expect(inForIn).toEqual([]);
    });
  });

  describe('toStringTag', () => {
    it('reports [object WeakMap]', () => {
      expect(Object.prototype.toString.call(new WeakMapPolyfill())).toBe(
        '[object WeakMap]',
      );
    });

    it('is non-writable, unlike ordinary methods (from test262)', () => {
      const desc = Object.getOwnPropertyDescriptor(WeakMapPolyfill.prototype, Symbol.toStringTag)!;
      expect(desc.writable).toBe(false);
      expect(desc.configurable).toBe(true);
    });
  });

  describe('KNOWN LIMITATIONS (documented divergence from spec)', () => {
    // The hidden-property technique stores the value via defineProperty on the
    // key object. A frozen / non-extensible key rejects new properties, so it
    // cannot be used. Native WeakMap handles frozen keys; this polyfill (like
    // es6-weak-map) cannot. Asserted so the gap is explicit.
    it('cannot use a frozen key (defineProperty throws)', () => {
      const wm = new WeakMapPolyfill();
      const frozen = Object.freeze({});
      expect(() => wm.set(frozen, 1)).toThrow();
    });
  });
});
