// Ported from: the prior implementation (object-keys.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Object.keys === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-object.keys
 *
 * Known limitations:
 * - [scope] installed only if the native is missing entirely; the ES5-era
 *   throw-on-primitive quirk on live natives is left alone (the wrapper would
 *   sit on a hot path for a pedantic delta).
 */

// ES5 natives threw on primitives; ES2015 boxes them first
const nativeKeys = typeof Object.keys === 'function' ? Object.keys : null;

export const objectKeys = function (target: any): string[] {
  // ToObject still rejects null/undefined — Object() would box them to {}
  if (target === null || target === undefined) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  const object = Object(target);
  if (nativeKeys) {
    return nativeKeys(object);
  }
  // inline ES3 fallback: own enumerable string keys
  const keys: string[] = [];
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      keys.push(key);
    }
  }
  return keys;
};

if (!isSupported()) {
  Object.defineProperty(Object, 'keys', { value: objectKeys as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.keys, 'name', { value: 'keys', configurable: true });
  Object.defineProperty((Object.keys as any), '__polyfilled', { value: true });
}
