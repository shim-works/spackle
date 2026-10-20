export const isSupported = (): boolean => {
  try {
    return typeof Object.hasOwn === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.hasown */

// the genuine native hasOwnProperty, captured before any polyfill could install
const nativeHasOwnProperty = Object.prototype.hasOwnProperty;

export const objectHasOwn = (target: any, key: any): boolean => {
  if (target === null || target === undefined) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  // box the target so primitives work, then ask the native directly
  return nativeHasOwnProperty.call(Object(target), key);
};

