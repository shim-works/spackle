// Existence-only probe: getOrInsertComputed is absent everywhere on the floor,
// so there is no partial-implementation case to detect.
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

export const isMapGetOrInsertComputedSupported = isSupported;

/**
 * Spec: https://tc39.es/proposal-upsert/#sec-map.prototype.getorinsertcomputed
 *
 * Goes through the live Map's own has/get/set, so this rides on whichever Map
 * is installed -- native, or the es.map island if that replaced it.
 */
// Map canonicalises -0 to +0 on insert; the callback and the stored key must
// both see the canonical form, not the raw argument.
const canonicalKey = (key: any): any => (key === 0 ? 0 : key);

export const mapGetOrInsertComputed = function (
  this: any,
  key: any,
  callbackfn: any
): any {
  if (typeof callbackfn !== 'function') {
    throw new TypeError('Map.prototype.getOrInsertComputed: callback is not callable');
  }
  const normalized = canonicalKey(key);
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

if (typeof Map !== 'undefined' && Map.prototype && !isSupported()) {
  Object.defineProperty((Map.prototype as any), 'getOrInsertComputed', { value: mapGetOrInsertComputed, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((Map.prototype as any).getOrInsertComputed, 'name', { value: 'getOrInsertComputed', configurable: true });
  Object.defineProperty((Map.prototype as any).getOrInsertComputed, '__polyfilled', {
    value: true,
  });
}
