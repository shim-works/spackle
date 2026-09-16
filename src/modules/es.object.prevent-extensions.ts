// Ported from: the prior implementation (object-prevent-extensions.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Object.preventExtensions === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-object.preventextensions
 */

const nativePreventExtensions = Object.preventExtensions;

// ES5 natives threw on primitives; ES2015 passes them straight back
export const objectPreventExtensions = function <T>(target: T): T {
  if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
    return target;
  }
  return nativePreventExtensions ? nativePreventExtensions(target) : target;
};

if (!isSupported()) {
  Object.defineProperty(Object, 'preventExtensions', { value: objectPreventExtensions as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.preventExtensions, 'name', { value: 'preventExtensions', configurable: true });
  Object.defineProperty((Object.preventExtensions as any), '__polyfilled', { value: true });
}
