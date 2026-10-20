// Object.values: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof Object.values === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.values */
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

