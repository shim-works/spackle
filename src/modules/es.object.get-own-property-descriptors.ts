// Ported from: the prior implementation (object-get-own-property-descriptors.ts + is-object-get-own-property-descriptors-supported.ts)

// Object.getOwnPropertyDescriptors — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken getOwnPropertyDescriptors, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof Object.getOwnPropertyDescriptors === 'function';
  } catch {
    return false;
  }
};

export const isObjectGetOwnPropertyDescriptorsSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
 */

// genuine natives, captured before any polyfill (or the symbols stub) can install
const nativeGetOwnPropertyNames = Object.getOwnPropertyNames;
const nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const nativeGetOwnPropertySymbols = Object.getOwnPropertySymbols;

export const objectGetOwnPropertyDescriptors = (
  obj: any
): PropertyDescriptorMap => {
  const keys = nativeGetOwnPropertyNames(obj);
  const result: PropertyDescriptorMap = {};
  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = nativeGetOwnPropertyDescriptor(obj, keys[i])!;
  }

  // Symbol-keyed own properties — only when the runtime really had native
  // Symbols + getOwnPropertySymbols at load (Chrome 38 / Safari 9+).
  if (
    typeof Symbol !== 'undefined' &&
    typeof nativeGetOwnPropertySymbols === 'function'
  ) {
    const symbols = nativeGetOwnPropertySymbols(obj);
    for (let symbolIndex = 0; symbolIndex < symbols.length; symbolIndex++) {
      (result as any)[symbols[symbolIndex]] = nativeGetOwnPropertyDescriptor(
        obj,
        symbols[symbolIndex]
      )!;
    }
  }
  return result;
};

if (!isSupported()) {
  Object.defineProperty(Object, 'getOwnPropertyDescriptors', { value: objectGetOwnPropertyDescriptors as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.getOwnPropertyDescriptors, 'name', { value: 'getOwnPropertyDescriptors', configurable: true });
  Object.defineProperty((Object.getOwnPropertyDescriptors as any), '__polyfilled', { value: true });
}
