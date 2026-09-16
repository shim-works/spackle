// Ported from: the prior implementation (object-is-frozen.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Object.isFrozen === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-object.isfrozen
 */

const nativeIsFrozen = Object.isFrozen;

// ES5 natives threw on primitives; ES2015 says primitives count as frozen
export const objectIsFrozen = function (target: any): boolean {
  if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
    return true;
  }
  return nativeIsFrozen ? nativeIsFrozen(target) : false;
};

if (!isSupported()) {
  Object.defineProperty(Object, 'isFrozen', { value: objectIsFrozen as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.isFrozen, 'name', { value: 'isFrozen', configurable: true });
  Object.defineProperty((Object.isFrozen as any), '__polyfilled', { value: true });
}
