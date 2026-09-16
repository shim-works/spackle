// Ported from: the prior implementation (math-log10.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Math.log10 === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-math.log10
 */
export const mathLog10 = (x: number): number => {
  // same change-of-base trick as log2: ln(x) * log10(e), one multiply
  return Math.log(x) * Math.LOG10E;
};

if (!isSupported()) {
  Object.defineProperty(Math, 'log10', { value: mathLog10 as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Math.log10, 'name', { value: 'log10', configurable: true });
  Object.defineProperty((Math.log10 as any), '__polyfilled', { value: true });
}
