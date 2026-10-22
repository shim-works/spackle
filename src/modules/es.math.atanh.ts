export const isSupported = (): boolean => {
  try {
    // atanh(-0) must be -0 (core-js)
    return typeof Math.atanh === 'function' && 1 / Math.atanh(-0) < 0;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-math.atanh
 * Inspired by: core-js (log((1 + x) / (1 - x)) / 2)
 */
export const mathAtanh = (x: number): number => {
  const numeric = +x;
  // NaN and ±0 pass through (keeps -0)
  if (numeric !== numeric || numeric === 0) {
    return numeric;
  }
  // domain is [-1, 1]; the formula handles the rest — ±1 gives ±Infinity
  // (log of Infinity / log of 0), |x| > 1 gives NaN (log of a negative)
  return Math.log((1 + numeric) / (1 - numeric)) / 2;
};

