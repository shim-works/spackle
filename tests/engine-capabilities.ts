/**
 * Capability predicates for tests that CANNOT pass on some engines, no matter
 * how good the polyfill is.
 *
 * These are not bugs and not skips-for-convenience. An ES5 shim can hand you a
 * `Symbol.species` object, but it cannot make the engine's own `Array.prototype
 * .map` consult it — that lookup happens in native code against a real symbol,
 * and a shimmed symbol is just a string key. Same for `@@toStringTag` (read
 * from an internal slot by `Object.prototype.toString`), the `String.prototype`
 * dispatch symbols, and detecting a detached ArrayBuffer.
 *
 * On a modern engine every one of these tests passes and is worth running, so
 * they must stay conditional rather than deleted. Used with `it.skipIf(...)`,
 * they report as skipped on the engines where they are impossible and run
 * normally everywhere else.
 *
 * See the "unfixable" notes in DESIGN.md / es.symbol.ts.
 */

const w: any = typeof window !== 'undefined' ? window : globalThis;

/**
 * True when Symbol is spackle's shim rather than the engine's own.
 *
 * Detected by behaviour: a real symbol reports `typeof 'symbol'`, and nothing
 * in ES5 can fake that.
 */
export const symbolIsShimmed = (): boolean => {
  try {
    if (typeof w.Symbol !== 'function') return true;
    return typeof w.Symbol('probe') !== 'symbol';
  } catch {
    return true;
  }
};

/*
 * Having Symbol is NOT the same as the built-ins honouring it.
 *
 * Chrome 41 has genuine native symbols -- `typeof Symbol('x') === 'symbol'` --
 * but its Array, String and Object built-ins predate the ES6 symbol protocols
 * by several releases. `Array.prototype.map` never looks up @@species,
 * `Object.prototype.toString` never reads @@toStringTag, and
 * `String.prototype.match` never dispatches to @@match. No polyfill can change
 * that: the lookups happen inside native code.
 *
 * So each protocol is probed for directly, rather than inferred from whether
 * Symbol exists.
 */

/** Does Object.prototype.toString read @@toStringTag? */
export const honoursToStringTag = (): boolean => {
  try {
    if (typeof w.Symbol !== 'function' || !w.Symbol.toStringTag) return false;
    const probe: any = {};
    probe[w.Symbol.toStringTag] = 'SpackleProbe';
    return Object.prototype.toString.call(probe) === '[object SpackleProbe]';
  } catch {
    return false;
  }
};

/** Do String.prototype.match/replace/search/split dispatch to @@match etc.? */
export const honoursSymbolDispatch = (): boolean => {
  try {
    if (typeof w.Symbol !== 'function' || !w.Symbol.match) return false;
    const matcher: any = {};
    matcher[w.Symbol.match] = function (): string {
      return 'dispatched';
    };
    return ('abc' as any).match(matcher) === 'dispatched';
  } catch {
    return false;
  }
};

/**
 * Does the engine expose @@toPrimitive at all?
 *
 * Unlike the protocols above this is not about whether a built-in *honours* the
 * symbol — it is about whether the key exists to hang anything on. Chrome 41
 * predates Symbol.toPrimitive (Chrome 47), and spackle deliberately does not
 * fabricate it: doing so would advertise a coercion protocol the engine's own
 * ToPrimitive cannot consult. With no key, Date.prototype[@@toPrimitive] has
 * nowhere to install.
 */
export const honoursToPrimitive = (): boolean => {
  try {
    return typeof w.Symbol === 'function' && !!w.Symbol.toPrimitive;
  } catch {
    return false;
  }
};

/**
 * Can Function#name be redefined?
 *
 * Pre-ES6 it is non-configurable, so every `defineProperty(fn, 'name', ...)` in
 * the modules is swallowed by its try/catch and the function keeps whatever name
 * the engine inferred from the assignment. Tests asserting a spec name cannot
 * pass there.
 */
export const canRenameFunctions = (): boolean => {
  try {
    const probe = function () {};
    Object.defineProperty(probe, 'name', { value: 'renamed', configurable: true });
    return (probe as any).name === 'renamed';
  } catch {
    return false;
  }
};

export const noToStringTag = (): boolean => !honoursToStringTag();
export const noSymbolDispatch = (): boolean => !honoursSymbolDispatch();
export const noToPrimitive = (): boolean => !honoursToPrimitive();
export const noFunctionNameRename = (): boolean => !canRenameFunctions();

/**
 * Detaching an ArrayBuffer is observable only through APIs that do not exist
 * pre-ES2024 (`transfer`, `structuredClone` transfer lists). Without one there
 * is no way to detect detachment, so the spec's "throws on a detached buffer"
 * requirements cannot be implemented.
 */
export const canDetectDetachedBuffers = (): boolean => {
  try {
    const buffer: any = new ArrayBuffer(8);
    return typeof buffer.transfer === 'function';
  } catch {
    return false;
  }
};

export const noDetachDetection = (): boolean => !canDetectDetachedBuffers();

/**
 * Whether the engine's OWN view constructors refuse a detached buffer.
 *
 * Separate question from the one above. Chrome 38 / V8 3.28 neuters a buffer to
 * zero bytes and then builds a DataView over it without complaint, so spackle
 * tracks detachment itself (the `__spackleDetached` flag) -- but it cannot make
 * a native constructor throw, and never replaces natives. Tests asserting that
 * throw are asserting an engine trait.
 */
export const viewsEnforceDetachment = (): boolean => {
  try {
    const buffer: any = new ArrayBuffer(8);
    if (typeof buffer.transfer !== 'function') {
      return false;
    }
    buffer.transfer();
    try {
      new DataView(buffer);
    } catch {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const noViewDetachEnforcement = (): boolean => !viewsEnforceDetachment();
