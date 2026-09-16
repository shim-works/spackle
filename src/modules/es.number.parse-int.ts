// Ported from: the prior implementation (number-parse-int.ts + is-number-parse-int-supported.ts)

// Number.parseInt — ES2015 just re-homed the global parseInt onto Number, so if
// they're the same reference we're already good.
export const isSupported = (): boolean => {
  try {
    return Number.parseInt === parseInt;
  } catch {
    return false;
  }
};

export const isNumberParseIntSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-number.parseint
 * GC: zero — just a reference copy.
 */
export const numberParseInt = parseInt;

if (!isSupported()) {
  Object.defineProperty(Number, 'parseInt', { value: numberParseInt as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Number.parseInt, 'name', { value: 'parseInt', configurable: true });
  Object.defineProperty((Number.parseInt as any), '__polyfilled', { value: true });
}
