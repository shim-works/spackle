// Object.freeze — behavioral, because Chrome <44 THREW when you froze a primitive
// instead of just handing it back. So we freeze a number: a healthy engine
// no-ops and returns it, a broken one throws and we fall through to the polyfill.
export const isSupported = (): boolean => {
  try {
    Object?.freeze(1);
    return true;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.freeze */

// the genuine native freeze, captured before anything can shadow it
const nativeFreeze = Object.freeze;

export const objectFreeze = <T>(obj: T): T => {
  // Primitives come straight back. Object(x) !== x also catches null, which
  // typeof misses.
  if (Object(obj) !== obj) return obj;
  return nativeFreeze(obj);
};

