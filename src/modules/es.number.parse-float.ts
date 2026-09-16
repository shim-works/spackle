// Ported from: the prior implementation (number-parse-float.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Number.parseFloat === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-number.parsefloat
 * Inspired by: core-js (same-reference alias, mirrors number-parse-int)
 */
export const numberParseFloat = parseFloat;

if (!isSupported()) {
  Object.defineProperty(Number, 'parseFloat', { value: numberParseFloat as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Number.parseFloat, 'name', { value: 'parseFloat', configurable: true });
  Object.defineProperty((Number.parseFloat as any), '__polyfilled', { value: true });
}
