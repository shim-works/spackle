export const isSupported = (): boolean => {
  try {
    return typeof Math.asinh === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-math.asinh
 * Inspired by: core-js (log(x + sqrt(x² + 1)) with odd-symmetry fold)
 */
export const mathAsinh = (x: number): number => {
  const numeric = +x;
  // NaN, ±0 and ±Infinity all asinh to themselves — bail early; the formula
  // would turn -Infinity into log(-Inf + Inf) = NaN
  if (
    numeric !== numeric ||
    numeric === 0 ||
    numeric === Infinity ||
    numeric === -Infinity
  ) {
    return numeric;
  }
  // odd function: fold negatives through the positive branch
  if (numeric < 0) {
    return -mathAsinh(-numeric);
  }
  return Math.log(numeric + Math.sqrt(numeric * numeric + 1));
};

