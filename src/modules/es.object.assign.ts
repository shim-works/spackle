// Ported from: the prior implementation (object-assign.ts + is-object-assign-supported.ts)

// Object.assign — behavioral, because some early natives copied string keys but
// quietly skipped Symbol-keyed ones. So we don't just check it exists: we hand it
// a source with a Symbol key and confirm the value actually came across.
export const isSupported = (): boolean => {
  try {
    if (typeof Object.assign !== 'function') {
      return false; // not there at all
    }

    // stash a value under a Symbol key, assign it across, check it survived
    const symbol = Symbol('test');
    const source: any = {};
    source[symbol] = 1;
    const target = Object.assign({}, source);
    return target[symbol] === 1;
  } catch {
    return false;
  }
};

export const isObjectAssignSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-object.assign
 */
// genuine natives, captured before any polyfill (or the symbols stub) can install
const hasOwn = Object.prototype.hasOwnProperty;
const propIsEnumerable = Object.prototype.propertyIsEnumerable;
const nativeGetOwnPropertySymbols = Object.getOwnPropertySymbols;

export const objectAssign = (target: any, ...sources: any[]) => {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  const to = Object(target);
  // Symbol-key copy only when the runtime really had native Symbols +
  // getOwnPropertySymbols at load (engines without them have no Symbol keys to
  // copy anyway). Guarding on the captured ref keeps us off any later stub.
  const symbolsSupported =
    typeof Symbol !== 'undefined' &&
    typeof nativeGetOwnPropertySymbols === 'function';

  for (let index = 0; index < sources.length; index++) {
    const nextSource = sources[index];
    if (nextSource == null) {
      continue;
    }

    for (const key in nextSource) {
      if (hasOwn.call(nextSource, key)) {
        to[key] = nextSource[key];
      }
    }

    if (symbolsSupported) {
      const symbols = nativeGetOwnPropertySymbols(nextSource);
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

if (!isSupported()) {
  Object.defineProperty(Object, 'assign', { value: objectAssign as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.assign, 'name', { value: 'assign', configurable: true });
  Object.defineProperty((Object.assign as any), '__polyfilled', { value: true });
}
