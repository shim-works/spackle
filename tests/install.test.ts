import { describe, expect, it } from 'vitest';
import { installPolyfills } from '../src/install-polyfills.js';

/**
 * Islands are pure implementations now: src/install-polyfills.ts decides what
 * installs and in what order. These tests delete a native and then run the
 * install run, which is exactly what the entry point does.
 */

describe('__polyfilled tag', () => {
  it('is defined non-enumerably, so it never shows up in Object.keys / for..in', async () => {
    const native = Array.prototype.flat;
    delete (Array.prototype as any).flat;
    try {
      installPolyfills();

      const flat = Array.prototype.flat as any;
      expect(flat.__polyfilled).toBe(true);
      expect(flat.propertyIsEnumerable('__polyfilled')).toBe(false);
      expect(Object.keys(flat)).not.toContain('__polyfilled');
    } finally {
      Array.prototype.flat = native;
    }
  });
});

describe('installed members are non-enumerable', () => {
  /**
   * A plain `Proto.method = fn` assignment creates an ENUMERABLE property,
   * where every native method is non-enumerable. That difference is visible:
   * a polyfilled method would show up in `for..in` over any instance, and
   * test262's prop-desc tests fail on it. Installs must go through
   * Object.defineProperty. This caught 46 real failures across test262.
   */
  it('does not leak a polyfilled prototype method into for..in', async () => {
    const native = Array.prototype.flat;
    delete (Array.prototype as any).flat;
    try {
      installPolyfills();

      const descriptor = Object.getOwnPropertyDescriptor(Array.prototype, 'flat')!;
      expect(descriptor.enumerable).toBe(false);
      // writable + configurable match a real built-in, so user code can still
      // replace or delete it
      expect(descriptor.writable).toBe(true);
      expect(descriptor.configurable).toBe(true);

      const seen: string[] = [];
      for (const key in [1, 2]) seen.push(key);
      expect(seen).not.toContain('flat');
    } finally {
      Array.prototype.flat = native;
    }
  });

  it('does not leak a polyfilled static into Object.keys', async () => {
    const native = (Array as any).fromAsync;
    delete (Array as any).fromAsync;
    try {
      installPolyfills();

      expect(typeof (Array as any).fromAsync).toBe('function');
      expect(Object.getOwnPropertyDescriptor(Array, 'fromAsync')!.enumerable).toBe(false);
      expect(Object.keys(Array)).not.toContain('fromAsync');
    } finally {
      if (native === undefined) delete (Array as any).fromAsync;
      else (Array as any).fromAsync = native;
    }
  });
});

describe('accessor / symbol-keyed function names (from test262)', () => {
  /**
   * Spec: "Functions that are specified as get or set accessor functions of
   * built-in properties have 'get '/'set ' prepended to the property name
   * string" -- and symbol-keyed methods get the bracketed [Symbol.x] form.
   * Method-shorthand `get(){}` inside a descriptor object names the function
   * "get" (the shorthand key), not "get <property>" -- easy to miss since it
   * looks named already. None of these are covered by the hand-written suite
   * elsewhere because the fix only fires once the install gate opens, which
   * requires the native to be gone first.
   */
  it('Map.prototype.size getter is named "get size", not "get"', async () => {
    const native = (globalThis as any).Map;
    delete (globalThis as any).Map;
    try {
      // es.map self-installs on import (other islands capture Map at module
      // scope), so the polyfill object exists without running the whole list.
      const { Map: MapPolyfill } = await import('../src/modules/es.map.js');
      const getter = Object.getOwnPropertyDescriptor(MapPolyfill.prototype, 'size')!.get!;
      expect(getter.name).toBe('get size');
    } finally {
      (globalThis as any).Map = native;
    }
  });

  // No Set.prototype.size counterpart here: deleting the real global `Set`
  // in-process (unlike Map) reliably breaks something the test runner's own
  // module loader needs, well before es.set.ts even evaluates. The fix is
  // byte-identical to the Map one above (same shorthand-`get(){}` bug, same
  // patch shape) and es.set.ts's own suite exercises the polyfill directly.

  it('RegExp.prototype.flags getter is named "get flags"', async () => {
    const native = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags');
    delete (RegExp.prototype as any).flags;
    try {
      installPolyfills();
      const getter = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags')!.get!;
      expect(getter.name).toBe('get flags');
    } finally {
      Object.defineProperty(RegExp.prototype, 'flags', native!);
    }
  });

  it('RegExp.prototype.dotAll getter is named "get dotAll"', async () => {
    const native = Object.getOwnPropertyDescriptor(RegExp.prototype, 'dotAll');
    delete (RegExp.prototype as any).dotAll;
    try {
      installPolyfills();
      const getter = Object.getOwnPropertyDescriptor(RegExp.prototype, 'dotAll')!.get!;
      expect(getter.name).toBe('get dotAll');
    } finally {
      Object.defineProperty(RegExp.prototype, 'dotAll', native!);
    }
  });

  it('Array[Symbol.species] getter is named "get [Symbol.species]"', async () => {
    const native = Object.getOwnPropertyDescriptor(Array, Symbol.species);
    delete (Array as any)[Symbol.species];
    try {
      installPolyfills();
      const getter = Object.getOwnPropertyDescriptor(Array, Symbol.species)!.get!;
      expect(getter.name).toBe('get [Symbol.species]');
    } finally {
      if (native) Object.defineProperty(Array, Symbol.species, native);
    }
  });

  it('Date.prototype[Symbol.toPrimitive] is named "[Symbol.toPrimitive]"', async () => {
    const native = (Date.prototype as any)[Symbol.toPrimitive];
    delete (Date.prototype as any)[Symbol.toPrimitive];
    try {
      installPolyfills();
      expect((Date.prototype as any)[Symbol.toPrimitive].name).toBe('[Symbol.toPrimitive]');
    } finally {
      // non-writable per spec, so restore by redefining, not assigning
      Object.defineProperty(Date.prototype, Symbol.toPrimitive, { value: native, writable: false, enumerable: false, configurable: true });
    }
  });

  it('String.prototype[Symbol.iterator] is named "[Symbol.iterator]"', async () => {
    const native = (String.prototype as any)[Symbol.iterator];
    delete (String.prototype as any)[Symbol.iterator];
    try {
      installPolyfills();
      expect((String.prototype as any)[Symbol.iterator].name).toBe('[Symbol.iterator]');
    } finally {
      (String.prototype as any)[Symbol.iterator] = native;
    }
  });
});

/**
 * The 2-arg ES2023 forms of has()/delete() live in their own islands, and each
 * snapshots whatever has()/delete() is live so it can delegate the 1-arg call.
 *
 * On an engine with no native URLSearchParams that snapshot has to happen at
 * INSTALL time: web.url-search-params installs the constructor from the body of
 * installPolyfills(), long after these two islands' module bodies evaluated.
 * Taken at module-evaluation time the snapshot is undefined, the install gate
 * never opens, and the 2-arg forms silently never land.
 *
 * Nothing else catches this -- jsdom and both Playwright engines ship a native
 * URLSearchParams, so the eager snapshot always found one.
 */
describe('URLSearchParams 2-arg has/delete, with no native to capture', () => {
  it('installs onto the polyfilled constructor', async () => {
    const native = (window as any).URLSearchParams;
    delete (window as any).URLSearchParams;
    // No re-import: a browser serves the already-evaluated module. That is
    // fine -- the bug guarded here is about INSTALL-time snapshots, and a
    // second installPolyfills() call with the native gone reproduces it.
    try {
      const fresh = await import('../src/install-polyfills.js');
      fresh.installPolyfills();

      const USP = (window as any).URLSearchParams;
      expect(typeof USP).toBe('function');

      const params = new USP('a=1&a=2');
      // 1-arg form still works through the delegate
      expect(params.has('a')).toBe(true);
      // 2-arg form is the ES2023 addition these islands exist for
      expect(params.has('a', '2')).toBe(true);
      expect(params.has('a', '3')).toBe(false);

      params.delete('a', '1');
      expect(params.has('a', '1')).toBe(false);
      expect(params.has('a', '2')).toBe(true);
    } finally {
      (window as any).URLSearchParams = native;
    }
  });
});
