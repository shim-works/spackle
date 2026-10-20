// Number.parseInt — ES2015 just re-homed the global parseInt onto Number, so if
// they're the same reference we're already good.
export const isSupported = (): boolean => {
  try {
    return Number.parseInt === parseInt;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-number.parseint */
export const numberParseInt = parseInt;

