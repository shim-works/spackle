// Ported from: the prior implementation (number-is-safe-integer.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Number.isSafeInteger === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-number.issafeinteger
 * Inspired by: MDN / core-js
 */
// biggest whole number JS can represent without two different integers
// colliding onto the same float — anything past this is "unsafe"
const MAX_SAFE_INTEGER = 9007199254740991; // 2^53 - 1

export const numberIsSafeInteger = (value: any): boolean => {
  return (
    typeof value === 'number' &&
    isFinite(value) &&
    Math.floor(value) === value && // it's a whole number...
    Math.abs(value) <= MAX_SAFE_INTEGER // ...and small enough to trust
  );
};

if (!isSupported()) {
  Object.defineProperty(Number, 'isSafeInteger', { value: numberIsSafeInteger as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Number.isSafeInteger, 'name', { value: 'isSafeInteger', configurable: true });
  Object.defineProperty((Number.isSafeInteger as any), '__polyfilled', { value: true });
}
