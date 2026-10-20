// Number.isNaN: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof Number.isNaN === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-number.isnan */
export const numberIsNaN = (value: any): boolean => {
  return typeof value === 'number' && value !== value;
};

