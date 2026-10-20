// Number.isFinite: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof Number.isFinite === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-number.isfinite */
export const numberIsFinite = (value: any): boolean => {
  return typeof value === 'number' && value - value === 0; // x - x === 0: false for NaN and ±Infinity, and no global isFinite call
};

