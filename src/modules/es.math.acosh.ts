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
  const arg = t + Math.sqrt(t) * Math.sqrt(numeric + 1);
  // inlined: log1p(arg) -- native when present (checked per call: the log1p
  // island may install after this one)
  if (typeof Math.log1p === 'function') return Math.log1p(arg);
  return arg > -1e-8 && arg < 1e-8 ? arg - (arg * arg) / 2 : Math.log(1 + arg);
};

