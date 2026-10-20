// Behavioural: ES5 threw on a primitive; ES2015 reports it sealed.
export const isSupported = (): boolean => {
  try {
    return Object.isSealed(1 as any) === true;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.issealed */

const nativeIsSealed = Object.isSealed;

// ES5 natives threw on primitives; ES2015 says primitives count as sealed
export const objectIsSealed = function (target: any): boolean {
  if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
    return true;
  }
  return nativeIsSealed ? nativeIsSealed(target) : false;
};

