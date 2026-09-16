// Authored for spackle (no the prior implementation origin) -- based on core-js (es.number.epsilon)

// Number.EPSILON -- Safari 7 lacks it. A plain data value, so value-check
// rather than existence (a wrong constant would still be "present").
export const isSupported = (): boolean => {
  try {
    return Number.EPSILON === 2.220446049250313e-16;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-number.epsilon
 */
if (!isSupported()) {
  // inline constant -- primitive value, no __polyfilled marker possible
  (Number as any).EPSILON = 2.220446049250313e-16;
}
