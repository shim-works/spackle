// Ported from: the prior implementation (symbol.ts + is-symbol-supported.ts)

/* eslint-disable compat/compat */
// Symbol — behavioral: a real Symbol is a genuine primitive type a shim can't
// fully fake. Check the constructor exists, values report typeof 'symbol',
// Symbol.iterator is real, two same-description symbols stay distinct, and the
// Symbol.for registry returns the same symbol for the same key.
export const isSupported = (): boolean => {
  try {
    // is there a Symbol constructor at all?
    if (typeof Symbol !== 'function') {
      return false;
    }

    // real symbols report typeof 'symbol' — a shim usually can't
    const testSymbol = Symbol('test');
    if (typeof testSymbol !== 'symbol') {
      return false;
    }

    // the well-known Symbol.iterator should itself be a real symbol
    if (typeof Symbol.iterator !== 'symbol') {
      return false;
    }

    // two symbols with the same description must still be distinct
    const testSymbol1 = Symbol('key');
    const testSymbol2 = Symbol('key');
    if ((testSymbol1 as any) === (testSymbol2 as any)) {
      return false;
    }

    // the global registry (Symbol.for) needs to exist...
    if (typeof Symbol.for !== 'function') {
      return false;
    }

    // ...and return the SAME symbol for the same key every time
    /* eslint-disable no-self-compare */
    if (Symbol.for('registry') !== Symbol.for('registry')) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export const isSymbolSupported = isSupported;

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

const objectProto = Object.prototype;
const defineProperty = Object.defineProperty;

// Every symbol gets a unique `@@<desc>` key. Bracket assignment `obj[sym] = v`
// coerces `sym` to that string, producing an ordinary ENUMERABLE own property.
//
// This used to install a per-symbol setter on Object.prototype so the write
// landed non-enumerably. That worked, but it grew Object.prototype without
// bound -- every Symbol() call added an accessor, permanently, which slows
// property lookup for every object in the program, not just symbol users.
//
// Instead the write stays enumerable and the key is filtered out of everything
// that enumerates (see hideSymbolKeys below). Dumb, but bounded.
const usedNames: any = Object.create(null);
const generateName = (description: string): string => {
  let postfix = 0;
  while (usedNames[description + (postfix || '')]) {
    postfix++;
  }
  const unique = description + (postfix || '');
  usedNames[unique] = true;
  return '@@' + unique;
};

// A polyfilled symbol key is any string starting with '@@'.
export const isPolyfilledSymbolKey = (key: any): boolean =>
  typeof key === 'string' && key.charAt(0) === '@' && key.charAt(1) === '@';

const withoutSymbolKeys = (keys: any[]): any[] => {
  const out: any[] = [];
  for (let i = 0; i < keys.length; i++) {
    if (!isPolyfilledSymbolKey(keys[i])) out.push(keys[i]);
  }
  return out;
};

/**
 * Hide '@@' keys from every API that enumerates own properties.
 *
 * Gated on "did we polyfill Symbol", NOT on "is Object.keys broken" -- any
 * engine old enough to need a Symbol polyfill has a perfectly good native
 * Object.keys, so the es.object.* islands never install there and cannot carry
 * this filter themselves.
 *
 * `for..in` is deliberately not covered: it is syntax and cannot be wrapped.
 * That is survivable because every symbol-keyed property spackle installs
 * itself goes through Object.defineProperty with enumerable:false, so nothing
 * enumerable ever lands on a prototype. Only an object the caller symbol-keyed
 * directly can surface a '@@' key in for..in.
 *
 * Known limitations:
 * - [incomplete] A real property literally named '@@foo' is hidden too.
 */
export const hideSymbolKeys = (): void => {
  const nativeKeys = Object.keys;
  Object.keys = function (target: any): string[] {
    return withoutSymbolKeys(nativeKeys(target));
  };

  const nativeNames = Object.getOwnPropertyNames;
  if (typeof nativeNames === 'function') {
    Object.getOwnPropertyNames = function (target: any): string[] {
      return withoutSymbolKeys(nativeNames(target));
    };
  }

  const nativeEntries = (Object as any).entries;
  if (typeof nativeEntries === 'function') {
    (Object as any).entries = function (target: any): any[] {
      const out: any[] = [];
      const pairs = nativeEntries(target);
      for (let i = 0; i < pairs.length; i++) {
        if (!isPolyfilledSymbolKey(pairs[i][0])) out.push(pairs[i]);
      }
      return out;
    };
  }

  const nativeValues = (Object as any).values;
  if (typeof nativeValues === 'function') {
    (Object as any).values = function (target: any): any[] {
      const out: any[] = [];
      const keys = nativeKeys(target);
      for (let i = 0; i < keys.length; i++) {
        if (!isPolyfilledSymbolKey(keys[i])) out.push(target[keys[i]]);
      }
      return out;
    };
  }

  const nativeAssign = (Object as any).assign;
  if (typeof nativeAssign === 'function') {
    (Object as any).assign = function (target: any): any {
      for (let i = 1; i < arguments.length; i++) {
        const source = arguments[i];
        if (source === null || source === undefined) continue;
        const keys = nativeKeys(Object(source));
        for (let k = 0; k < keys.length; k++) {
          if (!isPolyfilledSymbolKey(keys[k])) target[keys[k]] = source[keys[k]];
        }
      }
      return target;
    };
  }

  // JSON.stringify walks own enumerable string keys. The replacer hook is the
  // cheapest way in: returning undefined omits the property.
  if (typeof JSON !== 'undefined' && typeof JSON.stringify === 'function') {
    const nativeStringify = JSON.stringify;
    JSON.stringify = function (value: any, replacer?: any, space?: any): any {
      // the array form is already a whitelist, so '@@' keys can't sneak in
      if (Object.prototype.toString.call(replacer) === '[object Array]') {
        return nativeStringify(value, replacer, space);
      }
      return nativeStringify(
        value,
        function (this: any, key: string, val: any): any {
          if (isPolyfilledSymbolKey(key)) return undefined;
          return typeof replacer === 'function' ? replacer.call(this, key, val) : val;
        },
        space,
      );
    };
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

export const SymbolPolyfill: any = function Symbol(this: any, description?: any): any {
  if (this instanceof (SymbolPolyfill as any)) {
    throw new TypeError('Symbol is not a constructor');
  }
  const symbol = Object.create(symbolProto);
  const desc = description === undefined ? '' : String(description);
  defineProperty(symbol, '__description__', { value: desc });
  defineProperty(symbol, '__name__', { value: generateName(desc) });
  return symbol;
};

// Well-known symbols — unique values, non-enumerable/non-writable like native.
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

if (!isSupported()) {
  (window as any).Symbol = null;
  delete (window as any).Symbol;
  Object.defineProperty((window as any), 'Symbol', { value: SymbolPolyfill, writable: true, enumerable: false, configurable: true });
  hideSymbolKeys();
  Object.defineProperty((window as any).Symbol, 'name', { value: 'Symbol', configurable: true });
  Object.defineProperty((window as any).Symbol, '__polyfilled', { value: true });
}
