// Ported from: the prior implementation (math-log2.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Math.log2 === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-math.log2
 */
export const mathLog2 = (x: number): number => {
  // log-base-2 via change-of-base: ln(x) * log2(e). LOG2E is a built-in
  // constant, so this is one multiply — no division rounding woes.
  return Math.log(x) * Math.LOG2E;
};

if (!isSupported()) {
  Object.defineProperty(Math, 'log2', { value: mathLog2 as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Math.log2, 'name', { value: 'log2', configurable: true });
  Object.defineProperty((Math.log2 as any), '__polyfilled', { value: true });
}
