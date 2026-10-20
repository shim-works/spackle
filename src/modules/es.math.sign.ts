// Math.sign: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof Math.sign === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-math.sign */
export const mathSign = (x: number): number => {
  const numeric = +x;
  // ±0 and NaN pass straight through untouched
  if (numeric === 0 || numeric !== numeric) {
    return numeric;
  }
  return numeric > 0 ? 1 : -1;
};

