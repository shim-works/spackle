export const isSupported = (): boolean => {
  try {
    return typeof Math.tanh === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-math.tanh
 * Inspired by: core-js ((expm1(x) - expm1(-x)) / (expm1(x) + expm1(-x) + 2))
 */

export const mathTanh = (x: number): number => {
  const numeric = +x;
  // NaN and ±0 pass through (keeps -0)
  if (numeric !== numeric || numeric === 0) {
    return numeric;
  }
  // per call, not at load: the expm1 island may install after this one
  const hasExpm1 = typeof Math.expm1 === 'function';
  const negated = -numeric;
  // inlined: expm1(numeric)
  const a = hasExpm1 ? Math.expm1(numeric) : numeric > -1e-6 && numeric < 1e-6 ? numeric + (numeric * numeric) / 2 : Math.exp(numeric) - 1;
  // large |x| saturates: exp overflowed to Infinity, answer is the sign
  if (a === Infinity) {
    return 1;
  }
  // inlined: expm1(-numeric)
  const b = hasExpm1 ? Math.expm1(negated) : negated > -1e-6 && negated < 1e-6 ? negated + (negated * negated) / 2 : Math.exp(negated) - 1;
  if (b === Infinity) {
    return -1;
  }
  // tanh = sinh/cosh with both rewritten in expm1 terms — precise near zero
  return (a - b) / (a + b + 2);
};

