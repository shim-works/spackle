// Ported from: the prior implementation (number-is-nan.ts + is-number-is-nan-supported.ts)

// Number.isNaN — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken isNaN, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof Number.isNaN === 'function';
  } catch {
    return false;
  }
};

export const isNumberIsNaNSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-number.isnan
 * GC: pure function, zero allocations.
 */
export const numberIsNaN = (value: any): boolean => {
  return typeof value === 'number' && value !== value;
};

if (!isSupported()) {
  Object.defineProperty(Number, 'isNaN', { value: numberIsNaN as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Number.isNaN, 'name', { value: 'isNaN', configurable: true });
  Object.defineProperty((Number.isNaN as any), '__polyfilled', { value: true });
}
