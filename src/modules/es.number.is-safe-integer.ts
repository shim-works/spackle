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
const MAX_SAFE_INTEGER = 9007199254740991; // 2^53 - 1

export const numberIsSafeInteger = (value: any): boolean => {
  return (
    typeof value === 'number' &&
    value - value === 0 &&  // x - x === 0: false for NaN and ±Infinity, and no global isFinite call
    Math.floor(value) === value && // it's a whole number...
    Math.abs(value) <= MAX_SAFE_INTEGER // ...and small enough to trust
  );
};

