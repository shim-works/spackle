// Ported from: the prior implementation (array-of.ts + is-array-of-supported.ts)

// Array.of — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken Array.of, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof Array.of === 'function';
  } catch {
    return false;
  }
};

export const isArrayOfSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-array.of
 * GC: single array allocation.
 */
export const arrayOf = (...args: any[]): any[] => args;

if (!isSupported()) {
  Object.defineProperty(Array, 'of', { value: arrayOf as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.of, 'name', { value: 'of', configurable: true });
  Object.defineProperty((Array.of as any), '__polyfilled', { value: true });
}
