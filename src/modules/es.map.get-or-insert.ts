// Existence-only: absent everywhere on the floor.
export const isSupported = (): boolean => {
  try {
    return (
      typeof Map !== 'undefined' &&
      typeof (Map.prototype as any).getOrInsert === 'function'
    );
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/proposal-upsert/#sec-map.prototype.getorinsert
 *
 * Uses the live Map's has/get/set, native or the es.map island.
 */
export const mapGetOrInsert = function (this: any, key: any, value: any): any {
  // inlined: canonicalKey(key) -- -0 becomes +0, as Map stores it
  const normalized = key === 0 ? 0 : key;
  if (this.has(normalized)) {
    return this.get(normalized);
  }
  this.set(normalized, value);
  return value;
};

