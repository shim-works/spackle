export const isSupported = (): boolean => {
  try {
    // cosh(710) overflows a naive (e^x + e^-x) / 2 (core-js)
    return typeof Math.cosh === 'function' && Math.cosh(710) !== Infinity;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-math.cosh */
export const mathCosh = (x: number): number => {
  const numeric = +x;
  if (numeric !== numeric) {
    return numeric;
  }
  // even function: cosh(±Infinity) is +Infinity, cosh(±0) is 1. Scaled by e^-1
  // first (core-js), so e^|x| does not overflow before cosh itself does (x = 710).
  const t = Math.exp((numeric < 0 ? -numeric : numeric) - 1);
  return (t + 1 / (t * Math.E * Math.E)) * (Math.E / 2);
};

