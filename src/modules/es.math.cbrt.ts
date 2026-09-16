// Ported from: the prior implementation (math-cbrt.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Math.cbrt === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-math.cbrt
 * Inspired by: core-js (sign * pow(abs(x), 1/3))
 */
export const mathCbrt = (x: number): number => {
  const numeric = +x;
  // NaN, ±0 and ±Infinity all cube-root to themselves — bail early
  if (numeric !== numeric || numeric === 0 || numeric === Infinity || numeric === -Infinity) {
    return numeric;
  }
  // cube-root the magnitude, then put the sign back on
  const root = Math.pow(Math.abs(numeric), 1 / 3);
  if (numeric < 0) {
    return -root;
  }
  return root;
};

if (!isSupported()) {
  Object.defineProperty(Math, 'cbrt', { value: mathCbrt as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Math.cbrt, 'name', { value: 'cbrt', configurable: true });
  Object.defineProperty((Math.cbrt as any), '__polyfilled', { value: true });
}
