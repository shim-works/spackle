// Ported from: the prior implementation (object-get-own-property-names.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Object.getOwnPropertyNames === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-object.getownpropertynames
 *
 * Known limitations:
 * - [scope] installed only if the native is missing entirely; the ES5-era
 *   throw-on-primitive quirk on live natives is left alone.
 */

// ES5 natives threw on primitives; ES2015 boxes them first
const nativeGetOwnPropertyNames = Object.getOwnPropertyNames;

export const objectGetOwnPropertyNames = function (target: any): string[] {
  // ToObject still rejects null/undefined — Object() would box them to {}
  if (target === null || target === undefined) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  return nativeGetOwnPropertyNames(Object(target));
};

if (!isSupported()) {
  Object.defineProperty(Object, 'getOwnPropertyNames', { value: objectGetOwnPropertyNames as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.getOwnPropertyNames, 'name', { value: 'getOwnPropertyNames', configurable: true });
  Object.defineProperty((Object.getOwnPropertyNames as any), '__polyfilled', { value: true });
}
