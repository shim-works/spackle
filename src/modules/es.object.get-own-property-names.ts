/**
 * Behavioural: ES5 natives (Chrome 38, Safari 8) throw on a primitive; ES2015
 * boxes it through ToObject.
 */
export const isSupported = (): boolean => {
  try {
    if (typeof Object.getOwnPropertyNames !== 'function') {
      return false;
    }
    // ES5 natives throw right here; ES2015 sees the boxed String.
    const names = Object.getOwnPropertyNames('ab' as any);
    return !!names && names.indexOf('0') !== -1 && names.indexOf('length') !== -1;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.getownpropertynames */

const nativeGetOwnPropertyNames = Object.getOwnPropertyNames;

export const objectGetOwnPropertyNames = function (target: any): string[] {
  // ToObject still rejects null/undefined — Object() would box them to {}
  if (target === null || target === undefined) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  return nativeGetOwnPropertyNames(Object(target));
};

