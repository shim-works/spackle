// Behavioural: Chrome 38-40 returns 2.9999999999999996 for log2(8).
export const isSupported = (): boolean => {
  try {
    return Math.log2(8) === 3 && Math.log2(1 / 2) === -1;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-math.log2 */
export const mathLog2 = (x: number): number => {
  // change-of-base: ln(x) * LOG2E
  const approx = Math.log(x) * Math.LOG2E;

  // Change-of-base misses exact powers of two: snap those back.
  //
  // limit: last-ULP drift remains for non-powers of two; the spec permits it.
  const rounded = Math.round(approx);
  return Math.pow(2, rounded) === x ? rounded : approx;
};

