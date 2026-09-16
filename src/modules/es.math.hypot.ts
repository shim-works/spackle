// Ported from: the prior implementation (math-hypot.ts + is-math-hypot-supported.ts)

// Math.hypot — behavioral, because V8 up to Chrome 77 returned NaN for
// hypot(Infinity, NaN) where the spec says any Infinity wins outright.
export const isSupported = (): boolean => {
  try {
    if (typeof Math.hypot !== 'function') {
      return false;
    }
    // spec quirk under test: Infinity beats NaN, whatever order they arrive in
    return Math.hypot(Infinity, NaN) === Infinity;
  } catch {
    return false;
  }
};

export const isMathHypotSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-math.hypot
 */
export const mathHypot = function (): number {
  // hypot = square root of the sum of squares (Pythagoras with any number of
  // sides). two passes over the args, no array allocated.
  let max = 0;
  let hasInfinity = false;
  let hasNaN = false;
  for (let i = 0; i < arguments.length; i++) {
    const numeric = +arguments[i];
    if (numeric === Infinity || numeric === -Infinity) {
      hasInfinity = true;
    } else if (numeric !== numeric) {
      hasNaN = true;
    } else {
      const magnitude = numeric < 0 ? -numeric : numeric;
      if (magnitude > max) {
        max = magnitude;
      }
    }
  }
  // spec quirk: any Infinity wins, even if a NaN is also in the mix
  if (hasInfinity) {
    return Infinity;
  }
  if (hasNaN) {
    return NaN;
  }
  if (max === 0) {
    return 0;
  }
  // second pass: sum squares of everything scaled down by the biggest value,
  // so huge inputs (1e200) don't overflow to Infinity mid-sum — same trick
  // the natives use. scale back up at the end.
  let sumOfSquares = 0;
  for (let i = 0; i < arguments.length; i++) {
    const scaled = +arguments[i] / max;
    sumOfSquares += scaled * scaled;
  }
  return max * Math.sqrt(sumOfSquares);
};

if (!isSupported()) {
  Object.defineProperty(Math, 'hypot', { value: mathHypot as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Math.hypot, 'name', { value: 'hypot', configurable: true });
  Object.defineProperty((Math.hypot as any), '__polyfilled', { value: true });
}
