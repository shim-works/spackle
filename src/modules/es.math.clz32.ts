// Ported from: the prior implementation (math-clz32.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Math.clz32 === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-math.clz32
 * Inspired by: core-js (log2 + 0.5 correction)
 */
export const mathClz32 = (x: number): number => {
  // force it into a plain 32-bit whole number first
  const uint32 = x >>> 0;
  if (uint32 === 0) {
    // nothing but zeros, so all 32 slots are empty
    return 32;
  }
  // log2 is a quick way to find which slot the first 1 lives in; 31 minus that
  // is how many empty slots came before it. the `+ 0.5` is a tiny fudge so
  // floating-point rounding doesn't miscount right at the powers of two.
  return 31 - Math.floor(Math.log(uint32 + 0.5) * Math.LOG2E);
};

if (!isSupported()) {
  Object.defineProperty(Math, 'clz32', { value: mathClz32 as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Math.clz32, 'name', { value: 'clz32', configurable: true });
  Object.defineProperty((Math.clz32 as any), '__polyfilled', { value: true });
}
