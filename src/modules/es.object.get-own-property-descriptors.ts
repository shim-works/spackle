// Object.getOwnPropertyDescriptors: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof Object.getOwnPropertyDescriptors === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.getownpropertydescriptors */

// genuine natives, captured before any polyfill (or the symbols stub) can install
const nativeGetOwnPropertyNames = Object.getOwnPropertyNames;
const nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const nativeGetOwnPropertySymbols = Object.getOwnPropertySymbols;

export const objectGetOwnPropertyDescriptors = (
  obj: any
): PropertyDescriptorMap => {
  // ToObject still rejects null/undefined — Object() would box them to {}
  if (obj === null || obj === undefined) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  /* Box once: Chrome 41-49's ES5 getOwnPropertyNames/Symbols throw on a primitive. */
  const object = Object(obj);

  const keys = nativeGetOwnPropertyNames(object);
  const result: PropertyDescriptorMap = {};
  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = nativeGetOwnPropertyDescriptor(object, keys[i])!;
  }

  // Symbol-keyed own properties — only when the runtime really had native
  // Symbols + getOwnPropertySymbols at load (Chrome 38 / Safari 9+).
  if (
    typeof Symbol !== 'undefined' &&
    typeof nativeGetOwnPropertySymbols === 'function'
  ) {
    const symbols = nativeGetOwnPropertySymbols(object);
    for (let symbolIndex = 0; symbolIndex < symbols.length; symbolIndex++) {
      (result as any)[symbols[symbolIndex]] = nativeGetOwnPropertyDescriptor(
        object,
        symbols[symbolIndex]
      )!;
    }
  }
  return result;
};

