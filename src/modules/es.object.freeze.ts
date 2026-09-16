// Ported from: the prior implementation (object-freeze.ts + is-object-freeze-supported.ts)

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

export const isObjectFreezeSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-object.freeze
 */

// the genuine native freeze, captured before anything can shadow it
const nativeFreeze = Object.freeze;

export const objectFreeze = <T>(obj: T): T => {
  // primitives can't be frozen (or mutated) — hand them straight back
  if (typeof obj !== 'object' && typeof obj !== 'function') return obj;
  return nativeFreeze(obj);
};

if (!isSupported()) {
  Object.defineProperty(Object, 'freeze', { value: objectFreeze as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.freeze, 'name', { value: 'freeze', configurable: true });
  Object.defineProperty((Object.freeze as any), '__polyfilled', { value: true });
}
