// Ported from: the prior implementation (object-entries.ts + is-object-entries-supported.ts)

// Object.entries — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken entries, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof Object.entries === 'function';
  } catch {
    return false;
  }
};

export const isObjectEntriesSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-object.entries
 */
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

if (!isSupported()) {
  Object.defineProperty(Object, 'entries', { value: objectEntries as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.entries, 'name', { value: 'entries', configurable: true });
  Object.defineProperty((Object.entries as any), '__polyfilled', { value: true });
}
