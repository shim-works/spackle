// Object.is: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof Object.is === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.is */
export const objectIs = (first: any, second: any): boolean => {
  if (first === second) {
    // === already said equal. the only gotcha left is +0 vs -0, which === can't
    // tell apart. dividing by them does: 1/+0 is Infinity, 1/-0 is -Infinity.
    return first !== 0 || 1 / first === 1 / second;
  }
  // not === equal. the one case that should still count as "same" is NaN vs
  // NaN — and NaN is the only value that isn't equal to itself.
  return first !== first && second !== second;
};

