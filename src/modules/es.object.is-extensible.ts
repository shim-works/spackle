// Ported from: the prior implementation (object-is-extensible.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Object.isExtensible === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-object.isextensible
 */

const nativeIsExtensible = Object.isExtensible;

// ES5 natives threw on primitives; ES2015 says primitives are simply not
// extensible
export const objectIsExtensible = function (target: any): boolean {
  if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
    return false;
  }
  return nativeIsExtensible ? nativeIsExtensible(target) : true;
};

if (!isSupported()) {
  Object.defineProperty(Object, 'isExtensible', { value: objectIsExtensible as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.isExtensible, 'name', { value: 'isExtensible', configurable: true });
  Object.defineProperty((Object.isExtensible as any), '__polyfilled', { value: true });
}
