// Ported from: the prior implementation (math-expm1.ts + is-math-expm1-supported.ts)

// Math.expm1 — behavioral, because V8 right around Chromium 38 (our floor)
// shipped an expm1 that loses the answer entirely for tiny negative inputs.
export const isSupported = (): boolean => {
  try {
    if (typeof Math.expm1 !== 'function') {
      return false;
    }
    // tiny x is the whole point of expm1 — a healthy engine hands it straight back
    return Math.expm1(-2e-17) === -2e-17;
  } catch {
    return false;
  }
};

export const isMathExpm1Supported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-math.expm1
 * Inspired by: core-js (tiny-x series guard around exp(x) - 1)
 */
export const mathExpm1 = (x: number): number => {
  const numeric = +x;
  // NaN, ±0 pass through (keeps -0); +Infinity too
  if (numeric !== numeric || numeric === 0 || numeric === Infinity) {
    return numeric;
  }
  if (numeric === -Infinity) {
    return -1;
  }
  // near zero exp(x) - 1 cancels to garbage — two series terms are exact enough
  if (numeric > -1e-6 && numeric < 1e-6) {
    return numeric + (numeric * numeric) / 2;
  }
  return Math.exp(numeric) - 1;
};

if (!isSupported()) {
  Object.defineProperty(Math, 'expm1', { value: mathExpm1 as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Math.expm1, 'name', { value: 'expm1', configurable: true });
  Object.defineProperty((Math.expm1 as any), '__polyfilled', { value: true });
}
