// Math.sinh — behavioral, because the same V8-near-Chromium-38 expm1 bug leaks
// into sinh (it's built on expm1 internally), zeroing out tiny inputs.
export const isSupported = (): boolean => {
  try {
    if (typeof Math.sinh !== 'function') {
      return false;
    }
    // sinh(x) ~ x for tiny x — a healthy engine keeps every digit
    return Math.sinh(-2e-17) === -2e-17;
  } catch {
    return false;
  }
};

export const isMathSinhSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-math.sinh
 * Inspired by: core-js (expm1-based near zero to keep precision)
 */

export const mathSinh = (x: number): number => {
  const numeric = +x;
  // NaN, ±0 and ±Infinity all sinh to themselves — bail early (keeps -0)
  if (
    numeric !== numeric ||
    numeric === 0 ||
    numeric === Infinity ||
    numeric === -Infinity
  ) {
    return numeric;
  }
  // small |x|: (exp(x) - exp(-x)) / 2 cancels — expm1 keeps the digits
  if (numeric > -1 && numeric < 1) {
    // per call, not at load: the expm1 island may install after this one
    const hasExpm1 = typeof Math.expm1 === 'function';
    const negated = -numeric;
    // inlined: expm1(numeric), expm1(-numeric)
    const a = hasExpm1 ? Math.expm1(numeric) : numeric > -1e-6 && numeric < 1e-6 ? numeric + (numeric * numeric) / 2 : Math.exp(numeric) - 1;
    const b = hasExpm1 ? Math.expm1(negated) : negated > -1e-6 && negated < 1e-6 ? negated + (negated * negated) / 2 : Math.exp(negated) - 1;
    return (a - b) / 2;
  }
  return (Math.exp(numeric) - Math.exp(-numeric)) / 2;
};

