// Object.entries: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof Object.entries === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.entries */
export const objectEntries = function <T>(
  obj: Record<string, T>
): [string, T][] {
  if (obj == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  const object = Object(obj);
  const keys = Object.keys(object);
  const pairs: [string, T][] = [];
  for (let i = 0; i < keys.length; i++) {
    pairs[pairs.length] = [keys[i], object[keys[i]]];
  }
  return pairs;
};

