// Ported from: the prior implementation (number-is-integer.ts + is-number-is-integer-supported.ts)

// Number.isInteger — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken isInteger, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof Number.isInteger === 'function';
  } catch {
    return false;
  }
};

export const isNumberIsIntegerSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-number.isinteger
 * GC: pure function, zero allocations.
 */
export const numberIsInteger = (value: any): boolean => {
  return (
    typeof value === 'number' && isFinite(value) && Math.floor(value) === value
  );
};

if (!isSupported()) {
  Object.defineProperty(Number, 'isInteger', { value: numberIsInteger as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Number.isInteger, 'name', { value: 'isInteger', configurable: true });
  Object.defineProperty((Number.isInteger as any), '__polyfilled', { value: true });
}
