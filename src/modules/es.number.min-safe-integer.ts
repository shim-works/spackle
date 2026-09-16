// Authored for spackle (no the prior implementation origin) -- based on core-js (es.number.min-safe-integer)

// Number.MIN_SAFE_INTEGER (-(2^53 - 1)) -- Safari 7 lacks it. Value-check, not
// existence: a wrong constant would still be "present".
export const isSupported = (): boolean => {
  try {
    return Number.MIN_SAFE_INTEGER === -9007199254740991;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-number.min_safe_integer
 */
if (!isSupported()) {
  // inline constant -- primitive value, no __polyfilled marker possible
  (Number as any).MIN_SAFE_INTEGER = -9007199254740991;
}
