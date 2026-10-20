import { WeakMap as WeakMapPolyfill, installSymbolWeakKeys } from '../src/modules/es.weak-map.js';
import { weakMapGetOrInsert } from '../src/modules/es.weak-map.get-or-insert.js';
import { noToStringTag } from './engine-capabilities.js';

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
    it.skipIf(noToStringTag())('reports [object WeakMap]', () => {
      expect(Object.prototype.toString.call(new WeakMapPolyfill())).toBe(
        '[object WeakMap]',
      );
    });

    it.skipIf(noToStringTag())('is non-writable, unlike ordinary methods (from test262)', () => {
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

/**
 * Symbols as weak keys — the Chrome 36-107 / Safari <16.4 gap.
 *
 * Every engine in that range has a WeakMap that passes es.weak-map's
 * isSupported() in full and still throws on `wm.set(Symbol('x'), 1)`, because
 * symbol weak keys are ES2023. Found on Chrome 48 and 55, where
 * WeakMap.prototype.getOrInsert accepted a non-registered symbol (correctly)
 * and then handed it to a native set() that rejected it.
 *
 * Tested against a stub rather than the live WeakMap: jsdom and every
 * automatable browser are new enough to accept symbol keys natively, so the
 * patched path would never execute under test.
 */
describe('installSymbolWeakKeys — symbol weak keys on a pre-ES2023 native', () => {
  /** A WeakMap that behaves like Chrome 48's: objects fine, symbols rejected. */
  const makeLegacyWeakMap = () => {
    const store = new WeakMap();
    class LegacyWeakMap {
      set(key: any, value: any) {
        if (typeof key !== 'object' && typeof key !== 'function') {
          throw new TypeError('Invalid value used as weak map key');
        }
        store.set(key, value);
        return this;
      }
      get(key: any) {
        return typeof key === 'object' || typeof key === 'function' ? store.get(key) : undefined;
      }
      has(key: any) {
        return (typeof key === 'object' || typeof key === 'function') && store.has(key);
      }
      delete(key: any) {
        return (typeof key === 'object' || typeof key === 'function') && store.delete(key);
      }
    }
    // getOrInsert brand-checks its receiver, and a real native answers
    // [object WeakMap]. Without this the stub reads [object Object] and the
    // last test fails on the brand check instead of on the behaviour.
    Object.defineProperty(LegacyWeakMap.prototype, Symbol.toStringTag, {
      value: 'WeakMap',
      configurable: true,
    });
    return LegacyWeakMap as any;
  };

  let Legacy: any;

  beforeEach(() => {
    Legacy = makeLegacyWeakMap();
    installSymbolWeakKeys(Legacy);
  });

  it('is what the unpatched native does — the bug being fixed', () => {
    const Unpatched = makeLegacyWeakMap();
    expect(() => new Unpatched().set(Symbol('weak'), 1)).toThrow(TypeError);
  });

  it('round-trips a non-registered symbol key', () => {
    const wm = new Legacy();
    const key = Symbol('weak');
    wm.set(key, 1);
    expect(wm.has(key)).toBe(true);
    expect(wm.get(key)).toBe(1);
  });

  it('overwrites rather than duplicating on a repeat set', () => {
    const wm = new Legacy();
    const key = Symbol('weak');
    wm.set(key, 1);
    wm.set(key, 2);
    expect(wm.get(key)).toBe(2);
  });

  it('keeps distinct symbols with the same description apart', () => {
    const wm = new Legacy();
    const a = Symbol('same');
    const b = Symbol('same');
    wm.set(a, 'a');
    wm.set(b, 'b');
    expect(wm.get(a)).toBe('a');
    expect(wm.get(b)).toBe('b');
  });

  it('deletes a symbol key and reports whether it was there', () => {
    const wm = new Legacy();
    const key = Symbol('weak');
    wm.set(key, 1);
    expect(wm.delete(key)).toBe(true);
    expect(wm.has(key)).toBe(false);
    expect(wm.get(key)).toBe(undefined);
    expect(wm.delete(key)).toBe(false);
  });

  it('keeps each instance separate', () => {
    const a = new Legacy();
    const b = new Legacy();
    const key = Symbol('weak');
    a.set(key, 'a');
    expect(b.has(key)).toBe(false);
    expect(a.get(key)).toBe('a');
  });

  it('still rejects a REGISTERED symbol — it can never be collected', () => {
    const wm = new Legacy();
    expect(() => wm.set(Symbol.for('registered'), 1)).toThrow(TypeError);
  });

  it('leaves object keys on the native path', () => {
    const wm = new Legacy();
    const key = {};
    wm.set(key, 1);
    expect(wm.get(key)).toBe(1);
    expect(wm.delete(key)).toBe(true);
  });

  it('still rejects the primitives that were never valid keys', () => {
    const wm = new Legacy();
    expect(() => wm.set('x', 1)).toThrow(TypeError);
    expect(() => wm.set(1, 1)).toThrow(TypeError);
  });

  it('makes getOrInsert work on a symbol key, which is the reported failure', () => {
    const wm = new Legacy();
    const key = Symbol('weak');
    expect(weakMapGetOrInsert.call(wm, key, 1)).toBe(1);
    expect(weakMapGetOrInsert.call(wm, key, 99)).toBe(1);
  });
});

describe('WeakMap#set — overwrite and non-extensible keys', () => {
  it('overwrites an existing entry', () => {
    const wm = new WeakMapPolyfill();
    const k = {};
    wm.set(k, 1);
    wm.set(k, 2);
    expect(wm.get(k)).toBe(2);
    expect(wm.has(k)).toBe(true);
  });

  it('warns and throws TypeError on a frozen key, and keeps working after', () => {
    const wm = new WeakMapPolyfill();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      expect(() => wm.set(Object.freeze({}), 1)).toThrow(TypeError);
      expect(warn).toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
    const k = {};
    wm.set(k, 'ok');
    expect(wm.get(k)).toBe('ok');
  });
});
