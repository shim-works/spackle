// Object.assign — behavioral, following core-js's forced-native checks:
// symbol copying, own-key order, and getter/mutation ordering.
export const isSupported = (): boolean => {
  try {
    if (typeof Object.assign !== 'function') {
      return false; // not there at all
    }

    // A getter on an earlier source changes a later property's enumerability.
    // Object.assign must observe the key list before copying values.
    if (typeof Object.defineProperty === 'function') {
      const first: any = {};
      Object.defineProperty(first, 'a', {
        enumerable: true,
        get: function () {
          Object.defineProperty(this, 'b', { value: 3, enumerable: false });
          return 0;
        },
      });
      if (Object.assign({ b: 1 }, first, { b: 2 }).b !== 1) return false;
    }

    // Detect engines whose own-key enumeration order is not preserved.
    let ordered: any = {};
    const alphabet = 'abcdefghijklmnopqrst';
    for (let i = 0; i < alphabet.length; i++) ordered[alphabet.charAt(i)] = i;
    if (Object.keys(Object.assign({}, ordered)).join('') !== alphabet) return false;

    // Only real symbols test native symbol copying; the string-key Symbol shim
    // cannot tell us whether this native handles symbol keys.
    if (
      typeof Symbol === 'function' &&
      typeof Symbol('assign detection') === 'symbol' &&
      typeof Object.getOwnPropertySymbols === 'function'
    ) {
      const symbol = Symbol('assign detection');
      const source: any = {};
      source[symbol] = 7;
      if (Object.assign({}, source)[symbol] !== 7) return false;
    }

    return true;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.assign */
// genuine natives, captured before any polyfill (or the symbols stub) can install
const hasOwn = Object.prototype.hasOwnProperty;
const propIsEnumerable = Object.prototype.propertyIsEnumerable;
const nativeGetOwnPropertySymbols = Object.getOwnPropertySymbols;
// Decided at load, when Symbol can only be native. Without real symbols there's
// nothing to copy, and getOwnPropertySymbols would allocate per source.
const NATIVE_SYMBOLS =
  typeof Symbol === 'function' &&
  typeof Symbol() === 'symbol' &&
  typeof nativeGetOwnPropertySymbols === 'function';

/*
 * `arguments`, not a rest parameter: rest downlevels to an array per call.
 * The unread second parameter makes `Object.assign.length` 2, per spec.
 */
export const objectAssign = function (target: any, _source?: any): any {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  const to = Object(target);
  for (let index = 1; index < arguments.length; index++) {
    const nextSource = arguments[index];
    if (nextSource == null) {
      continue;
    }

    for (const key in nextSource) {
      if (hasOwn.call(nextSource, key)) {
        to[key] = nextSource[key];
      }
    }

    if (NATIVE_SYMBOLS) {
      /*
       * Object() the source: Chrome 41-49's ES5 getOwnPropertySymbols throws on a
       * primitive. A no-op for objects.
       */
      const symbols = nativeGetOwnPropertySymbols(Object(nextSource));
      for (let symbolIndex = 0; symbolIndex < symbols.length; symbolIndex++) {
        const symbolKey = symbols[symbolIndex];
        // Own enumerable only — mirror native Object.assign.
        if (propIsEnumerable.call(nextSource, symbolKey)) {
          to[symbolKey] = nextSource[symbolKey];
        }
      }
    }
  }
  return to;
};
