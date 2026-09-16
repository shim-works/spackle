// Ported from: the prior implementation (object-seal.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Object.seal === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-object.seal
 */

const nativeSeal = Object.seal;

// ES5 natives threw on primitives; ES2015 passes them straight back
export const objectSeal = function <T>(target: T): T {
  if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
    return target;
  }
  return nativeSeal ? nativeSeal(target) : target;
};

if (!isSupported()) {
  Object.defineProperty(Object, 'seal', { value: objectSeal as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.seal, 'name', { value: 'seal', configurable: true });
  Object.defineProperty((Object.seal as any), '__polyfilled', { value: true });
}
