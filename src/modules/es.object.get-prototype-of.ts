// Ported from: the prior implementation (object-get-prototype-of.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Object.getPrototypeOf === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-object.getprototypeof
 *
 * Known limitations:
 * - [scope] installed only if the native is missing entirely; the ES5-era
 *   throw-on-primitive quirk on live natives is left alone.
 */

// ES5 natives threw on primitives; ES2015 boxes them first
const nativeGetPrototypeOf = Object.getPrototypeOf;

export const objectGetPrototypeOf = function (target: any): any {
  // ToObject still rejects null/undefined — Object() would box them to {}
  if (target === null || target === undefined) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  return nativeGetPrototypeOf(Object(target));
};

if (!isSupported()) {
  Object.defineProperty(Object, 'getPrototypeOf', { value: objectGetPrototypeOf as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.getPrototypeOf, 'name', { value: 'getPrototypeOf', configurable: true });
  Object.defineProperty((Object.getPrototypeOf as any), '__polyfilled', { value: true });
}
