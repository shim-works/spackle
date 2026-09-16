// Ported from: the prior implementation (math-acosh.ts + is-math-acosh-supported.ts)

// Math.acosh — behavioral, because old V8 squared the input on the way in, so
// acosh(Number.MAX_VALUE) overflowed to NaN instead of landing near 710.48.
export const isSupported = (): boolean => {
  try {
    if (typeof Math.acosh !== 'function') {
      return false;
    }
    // the overflow-prone corner: the answer must come back finite
    const big = Math.acosh(1.7976931348623157e308);
    return big === big && big !== Infinity;
  } catch {
    return false;
  }
};

export const isMathAcoshSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-math.acosh
 * Inspired by: core-js (log1p form; log(x) + ln2 once x² would overflow)
 */

// Native-first: log1p ships alongside acosh, so on a gap engine we inline the
// same series-guarded fallback the log1p island uses (islands don't import
// each other — GUIDELINES §1).
const log1p = (x: number): number => {
  if (typeof Math.log1p === 'function') {
    return Math.log1p(x);
  }
  if (x > -1e-8 && x < 1e-8) {
    return x - (x * x) / 2;
  }
  return Math.log(1 + x);
};

export const mathAcosh = (x: number): number => {
  const numeric = +x;
  // domain is [1, Infinity) — below it (and NaN) the answer is NaN
  if (numeric !== numeric || numeric < 1) {
    return NaN;
  }
  if (numeric === Infinity) {
    return Infinity;
  }
  // past sqrt(MAX_VALUE), x² overflows — acosh(x) ~ log(2x) = log(x) + ln 2
  if (numeric > 94906265.62425156) {
    return Math.log(numeric) + Math.LN2;
  }
  // log1p form stays precise as x approaches 1 (where the answer approaches 0)
  const t = numeric - 1;
  return log1p(t + Math.sqrt(t) * Math.sqrt(numeric + 1));
};

if (!isSupported()) {
  Object.defineProperty(Math, 'acosh', { value: mathAcosh as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Math.acosh, 'name', { value: 'acosh', configurable: true });
  Object.defineProperty((Math.acosh as any), '__polyfilled', { value: true });
}
