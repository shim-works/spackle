export const isSupported = (): boolean => {
  try {
    return typeof Math.log10 === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-math.log10 */
export const mathLog10 = (x: number): number => {
  // same change-of-base trick as log2: ln(x) * log10(e), one multiply
  return Math.log(x) * Math.LOG10E;
};

