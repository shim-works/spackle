import { describe, expect, it, vi } from 'vitest';

describe('__polyfilled tag', () => {
  it('is defined non-enumerably, so it never shows up in Object.keys / for..in', async () => {
    const native = Array.prototype.flat;
    delete (Array.prototype as any).flat;
    try {
      vi.resetModules();
      await import('../src/modules/es.array.flat.js');

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
      vi.resetModules();
      await import('../src/modules/es.array.flat.js');

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
      vi.resetModules();
      await import('../src/modules/es.array.from-async.js');

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
      vi.resetModules();
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
      vi.resetModules();
      await import('../src/modules/es.regexp.flags.js');
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
      vi.resetModules();
      await import('../src/modules/es.regexp.dot-all.js');
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
      vi.resetModules();
      await import('../src/modules/es.array.species.js');
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
      vi.resetModules();
      await import('../src/modules/es.date.to-primitive.js');
      expect((Date.prototype as any)[Symbol.toPrimitive].name).toBe('[Symbol.toPrimitive]');
    } finally {
      (Date.prototype as any)[Symbol.toPrimitive] = native;
    }
  });

  it('String.prototype[Symbol.iterator] is named "[Symbol.iterator]"', async () => {
    const native = (String.prototype as any)[Symbol.iterator];
    delete (String.prototype as any)[Symbol.iterator];
    try {
      vi.resetModules();
      await import('../src/modules/es.string.iterator.js');
      expect((String.prototype as any)[Symbol.iterator].name).toBe('[Symbol.iterator]');
    } finally {
      (String.prototype as any)[Symbol.iterator] = native;
    }
  });
});

describe('installPolyfills', () => {
  it('does nothing until called (importing install.ts has no side effect)', async () => {
    // If this ran eagerly, Array.prototype.flat would already be
    // non-configurable/native-tagged by the time we get here regardless of
    // whether we ever call installPolyfills -- instead, confirm nothing
    // about the environment changed just from importing the module.
    const before = (Array.prototype.flat as any).__polyfilled;
    await import('../src/install.js');
    const after = (Array.prototype.flat as any).__polyfilled;
    expect(after).toBe(before);
  });

  // installPolyfills() dynamic-imports every registered module one at a time
  // (deliberately: that's what makes it fault-isolated). At 272 modules that
  // comfortably outruns vitest's 5s default once the rest of the suite is
  // running in parallel, so these two get their own budget. Raise it again
  // rather than parallelising the install — the sequencing is the feature.
  const INSTALL_TIMEOUT = 30000;

  it('is callable and installs polyfills (isSupported-gated, same as every module)', async () => {
    const { installPolyfills } = await import('../src/install.js');
    await installPolyfills();
    // Node already has Array.prototype.flat natively, so this specific
    // assertion just confirms the call completed without throwing and the
    // native method is still intact (isSupported() correctly no-opped).
    expect(typeof Array.prototype.flat).toBe('function');
  }, INSTALL_TIMEOUT);

  it('is safe to call more than once', async () => {
    const { installPolyfills } = await import('../src/install.js');
    await installPolyfills();
    await installPolyfills();
    expect(typeof Array.prototype.flat).toBe('function');
  }, INSTALL_TIMEOUT);
});
