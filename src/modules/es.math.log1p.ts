// Ported from: the prior implementation (math-log1p.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Math.log1p === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-math.log1p
 * Inspired by: core-js (tiny-x series guard around log(1 + x))
 */
export const mathLog1p = (x: number): number => {
  const numeric = +x;
  // NaN and ±0 pass through (keeps -0)
  if (numeric !== numeric || numeric === 0) {
    return numeric;
  }
  // near zero log(1 + x) cancels to garbage — two series terms are exact enough
  if (numeric > -1e-8 && numeric < 1e-8) {
    return numeric - (numeric * numeric) / 2;
  }
  // Math.log handles the rest: -1 gives -Infinity, x < -1 gives NaN
  return Math.log(1 + numeric);
};

if (!isSupported()) {
  Object.defineProperty(Math, 'log1p', { value: mathLog1p as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Math.log1p, 'name', { value: 'log1p', configurable: true });
  Object.defineProperty((Math.log1p as any), '__polyfilled', { value: true });
}
