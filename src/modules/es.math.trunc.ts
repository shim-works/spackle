export const isSupported = (): boolean => {
  try {
    return typeof Math.trunc === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-math.trunc */
export const mathTrunc = (x: number): number => {
  const numeric = +x;
  // NaN, ±0 and ±Infinity truncate to themselves — bail early
  if (numeric !== numeric || numeric === 0 || numeric === Infinity || numeric === -Infinity) {
    return numeric;
  }
  // "truncate" just means chop the decimals off, aka round toward zero:
  // negatives round up, positives round down
  if (numeric < 0) {
    return Math.ceil(numeric);
  }
  return Math.floor(numeric);
};

