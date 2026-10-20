// Existence-only: absent everywhere on the floor.
export const isSupported = (): boolean => {
  try {
    return (
      typeof Map !== 'undefined' &&
      typeof (Map.prototype as any).getOrInsertComputed === 'function'
    );
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/proposal-upsert/#sec-map.prototype.getorinsertcomputed
 *
 * Uses the live Map's has/get/set, native or the es.map island.
 */
export const mapGetOrInsertComputed = function (
  this: any,
  key: any,
  callbackfn: any
): any {
  if (typeof callbackfn !== 'function') {
    throw new TypeError('Map.prototype.getOrInsertComputed: callback is not callable');
  }
  // inlined: canonicalKey(key) -- -0 becomes +0, as Map stores it
  const normalized = key === 0 ? 0 : key;
  if (this.has(normalized)) {
    return this.get(normalized);
  }
  const value = callbackfn(normalized);
  // The callback can mutate the map -- including inserting this very key. The
  // spec re-checks afterwards and writes the computed value regardless, so a
  // plain set() is the correct resolution rather than a second has() guard.
  this.set(normalized, value);
  return value;
};

