// Behavioural: ES5 threw on a primitive; ES2015 reports it not extensible.
export const isSupported = (): boolean => {
  try {
    return Object.isExtensible(1 as any) === false;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.isextensible */

const nativeIsExtensible = Object.isExtensible;

// ES5 natives threw on primitives; ES2015 says primitives are simply not
// extensible
export const objectIsExtensible = function (target: any): boolean {
  if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
    return false;
  }
  return nativeIsExtensible ? nativeIsExtensible(target) : true;
};

