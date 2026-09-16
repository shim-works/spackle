// Ported from: the prior implementation (math-cosh.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Math.cosh === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-math.cosh
 */
export const mathCosh = (x: number): number => {
  const numeric = +x;
  if (numeric !== numeric) {
    return numeric;
  }
  // even function: cosh(±Infinity) is +Infinity, cosh(±0) is 1 — the formula
  // below already lands both, so no special-casing needed
  const e = Math.exp(numeric);
  return (e + 1 / e) / 2;
};

if (!isSupported()) {
  Object.defineProperty(Math, 'cosh', { value: mathCosh as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Math.cosh, 'name', { value: 'cosh', configurable: true });
  Object.defineProperty((Math.cosh as any), '__polyfilled', { value: true });
}
