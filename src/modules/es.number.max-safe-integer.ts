// Authored for spackle (no the prior implementation origin) -- based on core-js (es.number.max-safe-integer)

// Number.MAX_SAFE_INTEGER (2^53 - 1) -- Safari 7 lacks it. Value-check, not
// existence: a wrong constant would still be "present".
export const isSupported = (): boolean => {
  try {
    return Number.MAX_SAFE_INTEGER === 9007199254740991;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-number.max_safe_integer
 */
if (!isSupported()) {
  // inline constant -- primitive value, no __polyfilled marker possible
  (Number as any).MAX_SAFE_INTEGER = 9007199254740991;
}
