// Based on core-js (es.number.epsilon)
// Number.EPSILON -- Safari 7 lacks it. A plain data value, so value-check
// rather than existence (a wrong constant would still be "present").
export const isSupported = (): boolean => {
  try {
    return Number.EPSILON === 2.220446049250313e-16;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-number.epsilon */
export const install = (): void => {
  // Primitive value, so no __polyfilled marker. Non-writable, non-enumerable and
  // non-configurable, like the native constant.
  try {
    Object.defineProperty(Number, 'EPSILON', { value: 2.220446049250313e-16, writable: false, enumerable: false, configurable: false });
  } catch (e) {
    /* already defined non-configurable: leave it */
  }
};
