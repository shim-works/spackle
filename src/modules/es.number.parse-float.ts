// Behavioural: Number.parseFloat must be the same function as parseFloat
// (Safari 9.1/10.1 ship a distinct one).
export const isSupported = (): boolean => {
  try {
    return Number.parseFloat === parseFloat;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-number.parsefloat
 * Inspired by: core-js (same-reference alias, mirrors number-parse-int)
 */
export const numberParseFloat = parseFloat;

