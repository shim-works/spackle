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

/** Spec: https://tc39.es/ecma262/#sec-math.hypot */
export const mathHypot = function (): number {
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
  // second pass: scale by the largest value so huge inputs don't overflow
  let sumOfSquares = 0;
  for (let i = 0; i < arguments.length; i++) {
    const scaled = +arguments[i] / max;
    sumOfSquares += scaled * scaled;
  }
  return max * Math.sqrt(sumOfSquares);
};

