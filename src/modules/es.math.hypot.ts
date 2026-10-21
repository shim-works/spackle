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
// The coerced arguments, reused across calls (no array per call). A valueOf that
// calls hypot re-entrantly gets its own array instead of clobbering this one.
const scratch: number[] = [];
let depth = 0;

// Declared (value1, value2) for the spec length of 2; every argument comes from arguments.
export const mathHypot = function hypot(_value1?: any, _value2?: any): number {
  const count = arguments.length;
  const values = depth === 0 ? scratch : new Array(count);
  depth++;
  let max = 0;
  let hasInfinity = false;
  let hasNaN = false;
  try {
    // ToNumber every argument exactly once, in order, before any arithmetic
    for (let i = 0; i < count; i++) {
      const numeric = +arguments[i];
      values[i] = numeric;
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
  } finally {
    depth--;
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
  for (let i = 0; i < count; i++) {
    const scaled = values[i] / max;
    sumOfSquares += scaled * scaled;
  }
  return max * Math.sqrt(sumOfSquares);
};

