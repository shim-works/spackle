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

// Four or more arguments. Not inlined: holds a try/catch, and Chrome 41 (Crankshaft)
// won't optimise a function containing one. catch, not finally (not in the baseline):
// the latch must drop on a throwing valueOf too.
const hypotMany = (args: any): number => {
  const count = args.length;
  const values = depth === 0 ? scratch : new Array(count);
  depth++;
  let max = 0;
  let hasInfinity = false;
  let hasNaN = false;
  try {
    // ToNumber every argument exactly once, in order, before any arithmetic
    for (let i = 0; i < count; i++) {
      const numeric = +args[i];
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
  } catch (error) {
    depth--;
    throw error;
  }
  depth--;
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

// Declared (value1, value2) for the spec length of 2; every argument comes from arguments.
export const mathHypot = function hypot(_value1?: any, _value2?: any): number {
  const count = arguments.length;
  if (count > 3) return hypotMany(arguments);
  // Up to three arguments, the common case: coerced into locals, each exactly once
  // and in order. No scratch array, no latch and no try, so this stays optimisable.
  // A missing argument counts as +0, which changes neither the maximum nor the sum.
  const a = count > 0 ? +arguments[0] : 0;
  const b = count > 1 ? +arguments[1] : 0;
  const c = count > 2 ? +arguments[2] : 0;
  // spec quirk: any Infinity wins, even if a NaN is also in the mix
  if (a === Infinity || a === -Infinity || b === Infinity || b === -Infinity || c === Infinity || c === -Infinity) {
    return Infinity;
  }
  if (a !== a || b !== b || c !== c) {
    return NaN;
  }
  const x = a < 0 ? -a : a;
  const y = b < 0 ? -b : b;
  const z = c < 0 ? -c : c;
  let max = x > y ? x : y;
  if (z > max) max = z;
  if (max === 0) {
    return 0;
  }
  // scale by the largest value so huge inputs don't overflow
  const sx = x / max;
  const sy = y / max;
  const sz = z / max;
  return max * Math.sqrt(sx * sx + sy * sy + sz * sz);
};
