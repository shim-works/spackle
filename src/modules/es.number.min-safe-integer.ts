// Based on core-js (es.number.min-safe-integer)
// Number.MIN_SAFE_INTEGER (-(2^53 - 1)) -- Safari 7 lacks it. Value-check, not
// existence: a wrong constant would still be "present".
export const isSupported = (): boolean => {
  try {
    return Number.MIN_SAFE_INTEGER === -9007199254740991;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-number.min_safe_integer */
export const install = (): void => {
  // Primitive value, so no __polyfilled marker. Non-writable, non-enumerable and
  // non-configurable, like the native constant.
  try {
    Object.defineProperty(Number, 'MIN_SAFE_INTEGER', { value: -9007199254740991, writable: false, enumerable: false, configurable: false });
  } catch (e) {
    /* already defined non-configurable: leave it */
  }
};
