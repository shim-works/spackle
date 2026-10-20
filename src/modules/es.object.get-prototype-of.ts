/**
 * Behavioural: ES5 natives throw on a primitive; ES2015 boxes it through ToObject.
 */
export const isSupported = (): boolean => {
  try {
    if (typeof Object.getPrototypeOf !== 'function') {
      return false;
    }
    // ES5 natives throw right here; ES2015 sees the boxed String.
    return Object.getPrototypeOf('a' as any) === String.prototype;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.getprototypeof */

const nativeGetPrototypeOf = Object.getPrototypeOf;

export const objectGetPrototypeOf = function (target: any): any {
  // ToObject still rejects null/undefined — Object() would box them to {}
  if (target === null || target === undefined) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  return nativeGetPrototypeOf(Object(target));
};

