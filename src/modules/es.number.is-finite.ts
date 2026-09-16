// Ported from: the prior implementation (number-is-finite.ts + is-number-is-finite-supported.ts)

// Number.isFinite — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken isFinite, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof Number.isFinite === 'function';
  } catch {
    return false;
  }
};

export const isNumberIsFiniteSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-number.isfinite
 * GC: pure function, zero allocations.
 */
export const numberIsFinite = (value: any): boolean => {
  return typeof value === 'number' && isFinite(value);
};

if (!isSupported()) {
  Object.defineProperty(Number, 'isFinite', { value: numberIsFinite as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Number.isFinite, 'name', { value: 'isFinite', configurable: true });
  Object.defineProperty((Number.isFinite as any), '__polyfilled', { value: true });
}
