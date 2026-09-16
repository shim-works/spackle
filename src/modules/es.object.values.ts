// Ported from: the prior implementation (object-values.ts + is-object-values-supported.ts)

// Object.values — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken values, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof Object.values === 'function';
  } catch {
    return false;
  }
};

export const isObjectValuesSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-object.values
 */
export const objectValues = function <T>(obj: Record<string, T>): T[] {
  if (obj == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  const object = Object(obj);
  const keys = Object.keys(object);
  const values: T[] = [];
  for (let i = 0; i < keys.length; i++) {
    values[values.length] = object[keys[i]];
  }
  return values;
};

if (!isSupported()) {
  Object.defineProperty(Object, 'values', { value: objectValues as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.values, 'name', { value: 'values', configurable: true });
  Object.defineProperty((Object.values as any), '__polyfilled', { value: true });
}
