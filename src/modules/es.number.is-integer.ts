// Number.isInteger: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof Number.isInteger === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-number.isinteger */
export const numberIsInteger = (value: any): boolean => {
  return (
    typeof value === 'number' && value - value === 0 && Math.floor(value) === value  // x - x === 0: false for NaN and ±Infinity, and no global isFinite call
  );
};

