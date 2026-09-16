// Ported from: the prior implementation (math-fround.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Math.fround === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-math.fround
 * Inspired by: MDN / core-js (Float32Array round-trip)
 */

// our one-slot squishing box, grabbed once at load (native-first)
const float32 = typeof Float32Array !== 'undefined' ? new Float32Array(1) : null;

export const mathFround = (x: number): number => {
  const numeric = +x;
  // no box, or a value that can't be squished (NaN, ±0, ±Infinity) — hand it back as-is
  if (!float32 || numeric !== numeric || numeric === 0 || numeric === Infinity || numeric === -Infinity) {
    return numeric;
  }
  // put it in the box, take it back out, now it's 32-bit-rounded
  float32[0] = numeric;
  return float32[0];
};

if (!isSupported()) {
  Object.defineProperty(Math, 'fround', { value: mathFround as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Math.fround, 'name', { value: 'fround', configurable: true });
  Object.defineProperty((Math.fround as any), '__polyfilled', { value: true });
}
