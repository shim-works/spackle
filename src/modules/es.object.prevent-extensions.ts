// Behavioural: ES5 threw on a primitive; ES2015 returns it.
export const isSupported = (): boolean => {
  try {
    return Object.preventExtensions(1 as any) === 1;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.preventextensions */

const nativePreventExtensions = Object.preventExtensions;

// ES5 natives threw on primitives; ES2015 passes them straight back
export const objectPreventExtensions = function <T>(target: T): T {
  if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
    return target;
  }
  return nativePreventExtensions ? nativePreventExtensions(target) : target;
};

