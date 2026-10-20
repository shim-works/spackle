// ids: es.symbol, es.symbol.async-dispose, es.symbol.async-iterator, es.symbol.description,
//   es.symbol.dispose, es.symbol.has-instance, es.symbol.is-concat-spreadable,
//   es.symbol.iterator, es.symbol.match, es.symbol.match-all, es.symbol.replace,
//   es.symbol.search, es.symbol.species, es.symbol.split, es.symbol.to-primitive,
//   es.symbol.to-string-tag, es.symbol.unscopables

/* eslint-disable compat/compat */
// Behavioural: a real Symbol is a primitive a shim can't fully fake.
import { define } from '../define.js';

export const isSupported = (): boolean => {
  try {
    if (typeof Symbol !== 'function') {
      return false;
    }

    const testSymbol = Symbol('test');
    if (typeof testSymbol !== 'symbol') {
      return false;
    }

    if (typeof Symbol.iterator !== 'symbol') {
      return false;
    }

    const testSymbol1 = Symbol('key');
    const testSymbol2 = Symbol('key');
    if ((testSymbol1 as any) === (testSymbol2 as any)) {
      return false;
    }

    if (typeof Symbol.for !== 'function') {
      return false;
    }

    /* eslint-disable no-self-compare */
    if (Symbol.for('registry') !== Symbol.for('registry')) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-symbol-objects
 * Inspired by: es6-symbol (medikoo) — lean ES5 rewrite, no es5-ext
 *
 * Known limitations (identical to es6-symbol, so parity not regression):
 * - [unfixable] `typeof aSymbol === 'object'`, never `'symbol'` — ES5 cannot add
 *   a primitive type. Code branching on `typeof x === 'symbol'` won't see these.
 * - [unfixable] Native engine syntax (`for..of`, spread, `instanceof` via
 *   `hasInstance`) won't honour these well-knowns; only code that READS the
 *   property does (the local islands, Babel helpers, React internals).
 */

const defineProperty = Object.defineProperty;

// Each symbol gets a unique `@@<desc>_<n>` key from a counter (O(1), nothing
// retained). `obj[sym] = v` makes an ordinary enumerable property; the key is
// filtered out of enumeration (hideSymbolKeys) rather than growing
// Object.prototype with a setter per symbol.
let symbolCounter = 0;

// A polyfilled symbol key is any string starting with '@@'.
export const isPolyfilledSymbolKey = (key: any): boolean =>
  typeof key === 'string' && key.charAt(0) === '@' && key.charAt(1) === '@';

/*
 * Look before copying: scan for '@@' keys (two charCode checks each) and return
 * the native array untouched when there are none, which is almost always.
 * Not gated on Symbol() having been called: well-known symbols put '@@' keys on
 * objects from install onward.
 */

/**
 * Hide '@@' keys from every API that enumerates own properties. Gated on "did we
 * polyfill Symbol": engines that need the shim have a working native
 * Object.keys, so the es.object.* islands can't carry this filter.
 * `for..in` can't be wrapped; spackle's own symbol keys are non-enumerable.
 *
 * Known limitations:
 * - [incomplete] A real property literally named '@@foo' is hidden too.
 */
export const hideSymbolKeys = (): void => {
  // Each replacement carries the __polyfilled marker, so spackle-verify sees it as ours.
  const replace = (owner: any, key: string, value: any): void => {
    defineProperty(value, '__polyfilled', { value: true });
    owner[key] = value;
  };

  const nativeKeys = Object.keys;
  replace(Object, 'keys', function (target: any): string[] {
    const keys = nativeKeys(target);
    // inlined: withoutSymbolKeys(keys) -- keys are always strings here
    let firstHit = -1;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64) {
        firstHit = i;
        break;
      }
    }
    if (firstHit === -1) return keys;
    const out: any[] = [];
    for (let before = 0; before < firstHit; before++) out[out.length] = keys[before];
    for (let after = firstHit + 1; after < keys.length; after++) {
      const key = keys[after];
      if (!(key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64)) out[out.length] = key;
    }
    return out;
  });

  const nativeNames = Object.getOwnPropertyNames;
  if (typeof nativeNames === 'function') {
    replace(Object, 'getOwnPropertyNames', function (target: any): string[] {
      const keys = nativeNames(target);
      // inlined: withoutSymbolKeys(keys) -- keys are always strings here
      let firstHit = -1;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64) {
          firstHit = i;
          break;
        }
      }
      if (firstHit === -1) return keys;
      const out: any[] = [];
      for (let before = 0; before < firstHit; before++) out[out.length] = keys[before];
      for (let after = firstHit + 1; after < keys.length; after++) {
        const key = keys[after];
        if (!(key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64)) out[out.length] = key;
      }
      return out;
    });
  }

  const nativeEntries = (Object as any).entries;
  if (typeof nativeEntries === 'function') {
    replace(Object, 'entries', function (target: any): any[] {
      const pairs = nativeEntries(target);
      // Look before copying, as above.
      let hit = -1;
      for (let i = 0; i < pairs.length; i++) {
        const key = pairs[i][0]; // inlined: isPolyfilledSymbolKey(key)
        if (key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64) { hit = i; break; }
      }
      if (hit === -1) return pairs;
      const out: any[] = [];
      for (let before = 0; before < hit; before++) out[out.length] = pairs[before];
      for (let after = hit + 1; after < pairs.length; after++) {
        const key = pairs[after][0]; // inlined: isPolyfilledSymbolKey(key)
        if (!(key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64)) out[out.length] = pairs[after];
      }
      return out;
    });
  }

  const nativeValues = (Object as any).values;
  if (typeof nativeValues === 'function') {
    replace(Object, 'values', function (target: any): any[] {
      const keys = nativeKeys(target);
      let hasSymbolKey = false;
      for (let scan = 0; scan < keys.length; scan++) {
        const key = keys[scan]; // inlined: isPolyfilledSymbolKey(key)
        if (key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64) { hasSymbolKey = true; break; }
      }
      if (!hasSymbolKey) return nativeValues(target);
      const out: any[] = [];
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]; // inlined: isPolyfilledSymbolKey(key)
        if (!(key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64)) out[out.length] = target[key];
      }
      return out;
    });
  }

  const nativeAssign = (Object as any).assign;
  if (typeof nativeAssign === 'function') {
    /*
     * Reimplemented, not wrapped: filtering the sources first would copy each one.
     * The one API here that must NOT filter: Object.assign copies symbol keys too,
     * so '@@' keys are copied across.
     */
    const copyingAssign = function (target: any): any {
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      const to = Object(target);
      for (let i = 1; i < arguments.length; i++) {
        const source = arguments[i];
        // A primitive source contributes its boxed own keys and must never
        // abort the sources that follow it.
        if (source === null || source === undefined) continue;
        const keys = nativeKeys(Object(source));
        for (let k = 0; k < keys.length; k++) {
          to[keys[k]] = source[keys[k]];
        }
      }
      return to;
    };
    replace(Object, 'assign', copyingAssign);
  }

  // JSON.stringify walks own enumerable string keys. The replacer hook is the
  // cheapest way in: returning undefined omits the property.
  if (typeof JSON !== 'undefined' && typeof JSON.stringify === 'function') {
    const nativeStringify = JSON.stringify;
    replace(JSON, 'stringify', function (value: any, replacer?: any, space?: any): any {
      // the array form is already a whitelist, so '@@' keys can't sneak in
      if (Object.prototype.toString.call(replacer) === '[object Array]') {
        return nativeStringify(value, replacer, space);
      }
      return nativeStringify(
        value,
        function (this: any, key: string, val: any): any {
          // inlined: isPolyfilledSymbolKey(key)
          if (key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64) return undefined;
          return typeof replacer === 'function' ? replacer.call(this, key, val) : val;
        },
        space,
      );
    });
  }
};

// Instance prototype, kept separate from `SymbolPolyfill.prototype` so that
// `sym instanceof SymbolPolyfill` is false (matches native: symbols aren't
// instances of the Symbol wrapper). `toString` returns the private `@@name` so
// that property-key coercion resolves to the hidden key.
const symbolProto: any = {};
defineProperty(symbolProto, 'toString', {
  value: function (this: any) {
    return this.__name__;
  },
});
defineProperty(symbolProto, 'valueOf', {
  value: function (this: any) {
    return this;
  },
});
defineProperty(symbolProto, 'description', {
  configurable: true,
  get: function (this: any) {
    return this.__description__;
  },
});

// Declared above SymbolPolyfill: the well-knowns below call it at module scope.
const SLOT: PropertyDescriptor = { value: undefined };

export const SymbolPolyfill: any = function Symbol(this: any, description?: any): any {
  if (this instanceof (SymbolPolyfill as any)) {
    throw new TypeError('Symbol is not a constructor');
  }
  const symbol = Object.create(symbolProto);
  const desc = description === undefined ? '' : String(description);
  // One reused descriptor (non-writable, non-enumerable, non-configurable by
  // omission): two literals here were two extra objects per Symbol() call.
  SLOT.value = desc;
  defineProperty(symbol, '__description__', SLOT);
  // inlined: generateName(desc)
  SLOT.value = '@@' + desc + '_' + ++symbolCounter;
  defineProperty(symbol, '__name__', SLOT);
  SLOT.value = undefined; // never pin the last description
  return symbol;
};

// Well-known symbols. Installed before any other island evaluates, because
// islands read these as property keys at evaluation time: keep new well-knowns
// in this list. Symbol.prototype.description is an accessor, installed separately.
const wellKnown = [
  'hasInstance',
  'isConcatSpreadable',
  'iterator',
  'asyncIterator',
  'match',
  'matchAll',
  'replace',
  'search',
  'species',
  'split',
  'toPrimitive',
  'toStringTag',
  'unscopables',
  'dispose',
  'asyncDispose',
];
for (let i = 0; i < wellKnown.length; i++) {
  defineProperty(SymbolPolyfill, wellKnown[i], {
    value: (SymbolPolyfill as any)(wellKnown[i]),
  });
}

// Global registry: Symbol.for interns by key; Symbol.keyFor reverses it.
const registry: any = Object.create(null);
defineProperty(SymbolPolyfill, 'for', {
  value: function (key: any) {
    const k = String(key);
    if (registry[k]) {
      return registry[k];
    }
    registry[k] = (SymbolPolyfill as any)(k);
    return registry[k];
  },
});
defineProperty(SymbolPolyfill, 'keyFor', {
  value: function (symbol: any) {
    for (const key in registry) {
      if (registry[key] === symbol) {
        return key;
      }
    }
    return undefined;
  },
});

/**
 * Everything Symbol, in one call, run first (see src/index.ts): other islands
 * read Symbol.iterator and friends as property keys while evaluating. The '@@'
 * key filters run last instead; see applySymbolKeyFilters.
 */
/** No Symbol at all: supply the whole shim. */
export const installSymbolPolyfill = (): void => {
  (window as any).Symbol = null;
  delete (window as any).Symbol;
  define((window as any), 'Symbol', SymbolPolyfill);
};

/**
 * Native but incomplete: Chrome 41 / Safari 8 ship Symbol.iterator but not
 * species, toStringTag, match/replace/search/split or isConcatSpreadable.
 * Backfill only what's missing, as real native symbols.
 */
const installSymbolExtensionsOnNative = (): void => {
  const NativeSymbol: any = (window as any).Symbol;
  for (let i = 0; i < wellKnown.length; i++) {
    const key = wellKnown[i];
    if (typeof NativeSymbol[key] !== 'undefined') {
      continue;
    }
    try {
      defineProperty(NativeSymbol, key, { value: NativeSymbol('Symbol.' + key) });
    } catch (e) {
      /* frozen or non-extensible Symbol: nothing further we can do */
    }
  }
};

export const install = (): void => {
  if (!isSupported()) installSymbolPolyfill();
  else installSymbolExtensionsOnNative();
  // Either way: a native that passes isSupported() can still lack `description`
  // (Chrome 38-69, Safari 9.1-11.1), and the shim needs it attached too.
  installDescription();
};

/**
 * `Symbol.prototype.description` (ES2019). Separate gate: Chrome 38-69 and
 * Safari 9.1-11.1 ship Symbol without it. Recovered from toString().
 *
 * Known limitations:
 * - [unfixable] `Symbol()` and `Symbol('')` both stringify to `"Symbol()"`, so
 *   this returns `''` for both where the spec wants `undefined` for the first.
 */
export const symbolDescription = function (this: any): string | undefined {
  // .call rather than this.toString(): a symbol-keyed object could shadow
  // toString, and the accessor must read the real one.
  const text = Symbol.prototype.toString.call(this);
  return text.slice(7, text.length - 1);
};

const installDescription = (): void => {
  try {
    if (typeof Symbol === 'undefined' || (Symbol as any)('probe').description === 'probe') {
      return;
    }
  } catch (e) {
    return;
  }

  try {
    // Stamped on the getter: an accessor has no value to mark afterwards, and
    // reading Symbol.prototype.description to inspect it throws.
    defineProperty(symbolDescription, '__polyfilled', { value: true });
    defineProperty((Symbol as any).prototype, 'description', {
      configurable: true,
      enumerable: false,
      get: symbolDescription,
    });
  } catch (e) {
    /* frozen Symbol.prototype -- nothing further we can do */
  }
};

/**
 * The '@@' key filters, run by src/index.ts after every island has installed:
 * they wrap whatever Object.keys/assign/JSON.stringify finally are
 * (es.object.assign installs late on Safari 7.1), so applied early they'd be
 * overwritten.
 */
export const applySymbolKeyFilters = (): void => {
  try {
    const live: any = (window as any).Symbol;
    if (typeof live === 'function' && live.__polyfilled === true) {
      hideSymbolKeys();
    }
  } catch (e) {
    /* no window, or a Symbol that throws on read: nothing to filter */
  }
};

// Self-installs on import: other islands capture this constructor at module
// scope. Guarded, since a throw during import would abort the module graph.
try {
  install();
} catch (e) {
  /* locked-down engine: nothing further we can do here */
}
