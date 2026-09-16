// Ported from: the prior implementation (math-sinh.ts + is-math-sinh-supported.ts)

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

// Native-first: expm1 ships alongside sinh, so on a gap engine we inline the
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
    return (expm1(numeric) - expm1(-numeric)) / 2;
  }
  return (Math.exp(numeric) - Math.exp(-numeric)) / 2;
};

if (!isSupported()) {
  Object.defineProperty(Math, 'sinh', { value: mathSinh as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Math.sinh, 'name', { value: 'sinh', configurable: true });
  Object.defineProperty((Math.sinh as any), '__polyfilled', { value: true });
}
