// Ported from: the prior implementation (math-sign.ts + is-math-sign-supported.ts)

// Math.sign — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken Math.sign, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof Math.sign === 'function';
  } catch {
    return false;
  }
};

export const isMathSignSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-math.sign
 * GC: pure function, zero allocations.
 */
export const mathSign = (x: number): number => {
  const numeric = +x;
  // ±0 and NaN pass straight through untouched
  if (numeric === 0 || numeric !== numeric) {
    return numeric;
  }
  return numeric > 0 ? 1 : -1;
};

if (!isSupported()) {
  Object.defineProperty(Math, 'sign', { value: mathSign as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Math.sign, 'name', { value: 'sign', configurable: true });
  Object.defineProperty((Math.sign as any), '__polyfilled', { value: true });
}
