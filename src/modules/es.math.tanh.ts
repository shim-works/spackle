// Ported from: the prior implementation (math-tanh.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
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

// Native-first: expm1 ships alongside tanh, so on a gap engine we inline the
// same series-guarded fallback the expm1 island uses (islands don't import
// each other — GUIDELINES §1).
const expm1 = (x: number): number => {
  if (typeof Math.expm1 === 'function') {
    return Math.expm1(x);
  }
  if (x > -1e-6 && x < 1e-6) {
    return x + (x * x) / 2;
  }
  return Math.exp(x) - 1;
};

export const mathTanh = (x: number): number => {
  const numeric = +x;
  // NaN and ±0 pass through (keeps -0)
  if (numeric !== numeric || numeric === 0) {
    return numeric;
  }
  const a = expm1(numeric);
  // large |x| saturates: exp overflowed to Infinity, answer is the sign
  if (a === Infinity) {
    return 1;
  }
  const b = expm1(-numeric);
  if (b === Infinity) {
    return -1;
  }
  // tanh = sinh/cosh with both rewritten in expm1 terms — precise near zero
  return (a - b) / (a + b + 2);
};

if (!isSupported()) {
  Object.defineProperty(Math, 'tanh', { value: mathTanh as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Math.tanh, 'name', { value: 'tanh', configurable: true });
  Object.defineProperty((Math.tanh as any), '__polyfilled', { value: true });
}
