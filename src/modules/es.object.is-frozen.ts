// Behavioural: ES5 threw on a primitive; ES2015 reports it frozen.
export const isSupported = (): boolean => {
  try {
    return Object.isFrozen(1 as any) === true;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.isfrozen */

const nativeIsFrozen = Object.isFrozen;

// ES5 natives threw on primitives; ES2015 says primitives count as frozen
export const objectIsFrozen = function (target: any): boolean {
  if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
    return true;
  }
  return nativeIsFrozen ? nativeIsFrozen(target) : false;
};

