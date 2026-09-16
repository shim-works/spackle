// Behavioral, not existence: Object.isSealed has existed since ES5, but ES5
// threw a TypeError on a primitive where ES2015 says primitives are sealed.
// An existence check would never fire, so probe the actual difference.
export const isSupported = (): boolean => {
  try {
    return Object.isSealed(1 as any) === true;
  } catch {
    return false;
  }
};

export const isObjectIsSealedSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-object.issealed
 */

const nativeIsSealed = Object.isSealed;

// ES5 natives threw on primitives; ES2015 says primitives count as sealed
export const objectIsSealed = function (target: any): boolean {
  if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
    return true;
  }
  return nativeIsSealed ? nativeIsSealed(target) : false;
};

if (!isSupported()) {
  Object.defineProperty(Object, 'isSealed', { value: objectIsSealed as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.isSealed, 'name', { value: 'isSealed', configurable: true });
  Object.defineProperty((Object.isSealed as any), '__polyfilled', { value: true });
}
