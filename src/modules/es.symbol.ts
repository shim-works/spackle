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
    // the bundler may rename a function expression; the spec name is the key
    try {
      defineProperty(value, 'name', { value: key, configurable: true });
    } catch (e) { /* Function#name non-configurable pre-ES6 */ }
    owner[key] = value;
  };

  const nativeKeys = Object.keys;
  replace(Object, 'keys', function keys(target: any): string[] {
    const keys = nativeKeys(target);
    // inlined: withoutSymbolKeys(keys) -- strings, except where an old engine hands back a number (Safari 7.1)
    let firstHit = -1;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (typeof key === 'string' && key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64) {
        firstHit = i;
        break;
      }
    }
    if (firstHit === -1) return keys;
    const out: any[] = [];
    for (let before = 0; before < firstHit; before++) out[out.length] = keys[before];
    for (let after = firstHit + 1; after < keys.length; after++) {
      const key = keys[after];
      if (!(typeof key === 'string' && key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64)) out[out.length] = key;
    }
    return out;
  });

  const nativeNames = Object.getOwnPropertyNames;
  if (typeof nativeNames === 'function') {
    replace(Object, 'getOwnPropertyNames', function getOwnPropertyNames(target: any): string[] {
      const keys = nativeNames(target);
      // inlined: withoutSymbolKeys(keys) -- strings, except where an old engine hands back a number (Safari 7.1)
      let firstHit = -1;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (typeof key === 'string' && key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64) {
          firstHit = i;
          break;
        }
      }
      if (firstHit === -1) return keys;
      const out: any[] = [];
      for (let before = 0; before < firstHit; before++) out[out.length] = keys[before];
      for (let after = firstHit + 1; after < keys.length; after++) {
        const key = keys[after];
        if (!(typeof key === 'string' && key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64)) out[out.length] = key;
      }
      return out;
    });
  }

  // entries/values: EnumerableOwnProperties over the native names, skipping the
  // shim's '@@' keys. Each key is re-checked just before it is read.
  const isEnumerable = Object.prototype.propertyIsEnumerable;
  const toObject = Object;
  const listDesc: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };
  if (typeof (Object as any).entries === 'function') {
    replace(Object, 'entries', function entries(target: any): any[] {
      if (target === null || target === undefined) throw new TypeError('Cannot convert undefined or null to object');
      const object = toObject(target);
      const names = nativeNames(object);
      const out: any[] = [];
      let count = 0;
      for (let i = 0; i < names.length; i++) {
        const key = names[i]; // inlined: isPolyfilledSymbolKey(key)
        if (!(typeof key === 'string' && key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64) && isEnumerable.call(object, key)) {
          listDesc.value = [key, object[key]];
          defineProperty(out, count++, listDesc);
        }
      }
      listDesc.value = undefined;
      return out;
    });
  }

  if (typeof (Object as any).values === 'function') {
    replace(Object, 'values', function values(target: any): any[] {
      if (target === null || target === undefined) throw new TypeError('Cannot convert undefined or null to object');
      const object = toObject(target);
      const names = nativeNames(object);
      const out: any[] = [];
      let count = 0;
      for (let i = 0; i < names.length; i++) {
        const key = names[i]; // inlined: isPolyfilledSymbolKey(key)
        if (!(typeof key === 'string' && key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64) && isEnumerable.call(object, key)) {
          listDesc.value = object[key];
          defineProperty(out, count++, listDesc);
        }
      }
      listDesc.value = undefined;
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
    // Declared (target, _source) for the spec length of 2.
    const copyingAssign = function assign(target: any, _source?: any): any {
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      const to = Object(target);
      // A String target's indices are read-only; old engines ignore the write
      const stringLength = typeof target === 'string' ? target.length : -1;
      for (let i = 1; i < arguments.length; i++) {
        const source = arguments[i];
        // A primitive source contributes its boxed own keys and must never
        // abort the sources that follow it.
        if (source === null || source === undefined) continue;
        const from = Object(source);
        // every own key, '@@' symbol keys included, each checked for
        // enumerability just before it is copied
        const keys = nativeNames(from);
        for (let k = 0; k < keys.length; k++) {
          const key = keys[k];
          if (!isEnumerable.call(from, key)) continue;
          if (stringLength > 0 && String(+key >>> 0) === key && +key < stringLength) {
            throw new TypeError("Cannot assign to read only property '" + key + "' of string");
          }
          to[key] = from[key];
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
    replace(JSON, 'stringify', function stringify(value: any, replacer?: any, space?: any): any {
      // the array form is already a whitelist, so '@@' keys can't sneak in
      if (Object.prototype.toString.call(replacer) === '[object Array]') {
        return nativeStringify(value, replacer, space);
      }
      return nativeStringify(
        value,
        function (this: any, key: string, val: any): any {
          // inlined: isPolyfilledSymbolKey(key)
          if (typeof key === 'string' && key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64) return undefined;
          return typeof replacer === 'function' ? replacer.call(this, key, val) : val;
        },
        space,
      );
    });
  }
};

// Instance prototype, kept separate from `SymbolPolyfill.prototype` so that
// `sym instanceof SymbolPolyfill` is false (matches native: symbols aren't
// instances of the Symbol wrapper). Its `toString` returns the private `@@name`
// so that property-key coercion resolves to the hidden key -- the one place the
// shim cannot follow the spec, since an ES5 engine converts keys with toString.
const symbolProto: any = {};
const hasOwnProp = Object.prototype.hasOwnProperty;
const objectIsPrototypeOf = Object.prototype.isPrototypeOf;
const isShimSymbol = (value: any): boolean =>
  value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === symbolProto && hasOwnProp.call(value, '__name__');
const thisSymbolValue = (value: any, method: string): any => {
  if (!isShimSymbol(value)) throw new TypeError(method + ' requires that \'this\' be a Symbol');
  return value;
};
const descriptionGetter = function (this: any): string | undefined {
  return thisSymbolValue(this, 'Symbol.prototype.description').__description__;
};
const METHOD: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: true };
METHOD.value = function toString(this: any) {
  return thisSymbolValue(this, 'Symbol.prototype.toString').__name__;
};
defineProperty(symbolProto, 'toString', METHOD);
METHOD.value = function valueOf(this: any) {
  return thisSymbolValue(this, 'Symbol.prototype.valueOf');
};
defineProperty(symbolProto, 'valueOf', METHOD);
METHOD.value = undefined;
defineProperty(symbolProto, 'description', { configurable: true, enumerable: false, get: descriptionGetter });

// Declared above SymbolPolyfill: the well-knowns below call it at module scope.
const SLOT: PropertyDescriptor = { value: undefined };

// Declared with no parameters for the spec length of 0; description from arguments.
export const SymbolPolyfill: any = function Symbol(this: any): any {
  if (this instanceof (SymbolPolyfill as any)) {
    throw new TypeError('Symbol is not a constructor');
  }
  const description = arguments.length > 0 ? arguments[0] : undefined;
  if (isShimSymbol(description)) {
    throw new TypeError('Cannot convert a Symbol value to a string');
  }
  const symbol = Object.create(symbolProto);
  // undefined stays undefined: Symbol().description is undefined, Symbol('') is ''
  const desc = description === undefined ? undefined : String(description);
  // One reused descriptor (non-writable, non-enumerable, non-configurable by
  // omission): two literals here were two extra objects per Symbol() call.
  SLOT.value = desc;
  defineProperty(symbol, '__description__', SLOT);
  // inlined: generateName(desc)
  SLOT.value = '@@' + (desc === undefined ? '' : desc) + '_' + ++symbolCounter;
  defineProperty(symbol, '__name__', SLOT);
  SLOT.value = undefined; // never pin the last description
  return symbol;
};

// Symbol.prototype: the spec members, brand-checked against shim symbols.
// toString here is the spec's "Symbol(desc)"; only the instance toString above
// returns the property key.
const SP: any = SymbolPolyfill.prototype;
METHOD.value = function toString(this: any) {
  const desc = thisSymbolValue(this, 'Symbol.prototype.toString').__description__;
  return 'Symbol(' + (desc === undefined ? '' : desc) + ')';
};
defineProperty(SP, 'toString', METHOD);
METHOD.value = function valueOf(this: any) {
  return thisSymbolValue(this, 'Symbol.prototype.valueOf');
};
defineProperty(SP, 'valueOf', METHOD);
METHOD.value = undefined;
try {
  defineProperty(descriptionGetter, 'name', { value: 'get description', configurable: true });
} catch (e) { /* Function#name non-configurable pre-ES6 */ }
defineProperty(SP, 'description', { configurable: true, enumerable: false, get: descriptionGetter });

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

// Symbol.prototype[@@toPrimitive] and [@@toStringTag], now that the well-knowns exist.
const symbolToPrimitive = function (this: any, _hint: any) {
  return thisSymbolValue(this, 'Symbol.prototype[Symbol.toPrimitive]');
};
try {
  defineProperty(symbolToPrimitive, 'name', { value: '[Symbol.toPrimitive]', configurable: true });
} catch (e) { /* Function#name non-configurable pre-ES6 */ }
defineProperty(SP, (SymbolPolyfill as any).toPrimitive, { value: symbolToPrimitive, writable: false, enumerable: false, configurable: true });
defineProperty(SP, (SymbolPolyfill as any).toStringTag, { value: 'Symbol', writable: false, enumerable: false, configurable: true });

// Global registry: Symbol.for interns by key; Symbol.keyFor reverses it.
const registry: any = Object.create(null);
METHOD.value = function (key: any) {
  if (isShimSymbol(key)) throw new TypeError('Cannot convert a Symbol value to a string');
  const k = String(key);
  const existing = registry[k];
  if (existing) {
    return existing;
  }
  const symbol = (SymbolPolyfill as any)(k);
  // the registry key lives on the symbol, so keyFor needs no search
  SLOT.value = k;
  defineProperty(symbol, '__registryKey__', SLOT);
  SLOT.value = undefined;
  registry[k] = symbol;
  return symbol;
};
try { defineProperty(METHOD.value, 'name', { value: 'for', configurable: true }); } catch (e) { /* pre-ES6 */ }
defineProperty(SymbolPolyfill, 'for', METHOD);
METHOD.value = function keyFor(symbol: any) {
  if (!isShimSymbol(symbol)) throw new TypeError(String(symbol) + ' is not a symbol');
  return hasOwnProp.call(symbol, '__registryKey__') ? symbol.__registryKey__ : undefined;
};
defineProperty(SymbolPolyfill, 'keyFor', METHOD);
METHOD.value = undefined;

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

/*
 * `Symbol('')` and `Symbol()` print alike, so the description getter can only
 * tell them apart if it saw the call: the description wrapper below files every
 * empty-string symbol here (core-js's EmptyStringDescriptionStore). Keyed by the
 * symbol itself; each `Symbol('')` stays referenced, as in core-js.
 */
const emptyDescriptions: any = {};

/**
 * Native but incomplete: Chrome 41 / Safari 8 ship Symbol.iterator but not
 * species, toStringTag, match/replace/search/split or isConcatSpreadable.
 * Backfill only what's missing, as real native symbols, then the prototype
 * halves core-js adds (es.symbol.to-primitive, es.symbol.to-string-tag) and its
 * description wrapper (es.symbol.description).
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

  const SymbolPrototype: any = NativeSymbol.prototype;
  const nativeValueOf = SymbolPrototype.valueOf;
  try {
    if (!hasOwnProp.call(SymbolPrototype, NativeSymbol.toPrimitive)) {
      // thisSymbolValue through the native valueOf: it throws on anything but a symbol or its wrapper
      const nativeSymbolToPrimitive = function (this: any, _hint: any): any {
        return nativeValueOf.call(this);
      };
      try { defineProperty(nativeSymbolToPrimitive, 'name', { value: '[Symbol.toPrimitive]', configurable: true }); } catch (e) { /* pre-ES6 */ }
      defineProperty(SymbolPrototype, NativeSymbol.toPrimitive, { value: nativeSymbolToPrimitive, writable: false, enumerable: false, configurable: true });
    }
    if (!hasOwnProp.call(SymbolPrototype, NativeSymbol.toStringTag)) {
      defineProperty(SymbolPrototype, NativeSymbol.toStringTag, { value: 'Symbol', writable: false, enumerable: false, configurable: true });
    }
  } catch (e) {
    /* frozen Symbol.prototype: nothing further we can do */
  }

  // core-js's es.symbol.description gate: no description, or Safari 12's
  // Symbol().description that is not undefined.
  try {
    if ('description' in SymbolPrototype && NativeSymbol().description === undefined) return;
  } catch (e) {
    return;
  }
  // Still real native symbols; only the constructor is ours. No parameters, so
  // length is 0 (the native's is 1 on Chrome 41).
  const SymbolWrapper: any = function Symbol(this: any): any {
    const arg = arguments[0];
    let description: string | undefined;
    if (arguments.length > 0 && arg !== undefined) {
      // inlined: ToString(arg) -- String() uses hint string; a Symbol throws
      if (typeof arg === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
      description = String(arg);
    }
    // `new Symbol()`: the native's own TypeError
    if (this !== undefined && this !== null && objectIsPrototypeOf.call(SymbolPrototype, this)) return new NativeSymbol(description);
    const result = description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') emptyDescriptions[result] = true;
    return result;
  };
  // core-js's copyConstructorProperties: every static the native has (well-knowns, for, keyFor)
  const names = Object.getOwnPropertyNames(NativeSymbol);
  for (let i = 0; i < names.length; i++) {
    if (hasOwnProp.call(SymbolWrapper, names[i])) continue;
    try { defineProperty(SymbolWrapper, names[i], Object.getOwnPropertyDescriptor(NativeSymbol, names[i])!); } catch (e) { /* skip */ }
  }
  // Symbol.for('') is an empty-string symbol too
  const nativeFor = NativeSymbol['for'];
  const symbolFor = function (key: any): any {
    const stringKey = String(key);
    const symbol = nativeFor.call(NativeSymbol, stringKey);
    if (stringKey === '') emptyDescriptions[symbol] = true;
    return symbol;
  };
  try { defineProperty(symbolFor, 'name', { value: 'for', configurable: true }); } catch (e) { /* pre-ES6 */ }
  try {
    defineProperty(SymbolWrapper, 'for', { value: symbolFor, writable: true, enumerable: false, configurable: true });
    SymbolWrapper.prototype = SymbolPrototype;
    defineProperty(SymbolPrototype, 'constructor', { value: SymbolWrapper, writable: true, enumerable: false, configurable: true });
    // Not define(): its __polyfilled stamp on Symbol switches on the '@@' key
    // filters, which only the shim needs.
    defineProperty(window, 'Symbol', { value: SymbolWrapper, writable: true, enumerable: false, configurable: true });
  } catch (e) {
    /* locked-down Symbol or window: keep the native */
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
 * Safari 9.1-11.1 ship Symbol without it. Recovered from toString(), with
 * `Symbol('')` told apart from `Symbol()` through emptyDescriptions.
 */
let descriptionValueOf: any;
export const symbolDescription = function (this: any): string | undefined {
  // thisSymbolValue: the native valueOf throws on anything but a symbol
  const symbol = descriptionValueOf.call(this);
  if (hasOwnProp.call(emptyDescriptions, symbol)) return '';
  // .call rather than this.toString(): a symbol-keyed object could shadow
  // toString, and the accessor must read the real one.
  const text = Symbol.prototype.toString.call(symbol);
  const description = text.slice(7, text.length - 1);
  return description === '' ? undefined : description;
};

const installDescription = (): void => {
  try {
    // core-js's gate: present, and Symbol().description undefined (Safari 12 gets it wrong)
    if (typeof Symbol === 'undefined' || ((Symbol as any)('probe').description === 'probe' && (Symbol as any)().description === undefined)) {
      return;
    }
    descriptionValueOf = (Symbol as any).prototype.valueOf;
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
