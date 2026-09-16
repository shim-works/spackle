// Existence-only probe: getOrInsert is absent everywhere on the floor, so
// there is no partial-implementation case to detect.
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

export const isMapGetOrInsertSupported = isSupported;

/**
 * Spec: https://tc39.es/proposal-upsert/#sec-map.prototype.getorinsert
 *
 * Goes through the live Map's own has/get/set rather than reaching into
 * internal storage, so this rides on whichever Map is installed -- native, or
 * the es.map island if that replaced it. SameValueZero key matching and -0
 * normalisation are the underlying Map's job either way.
 */
// Map canonicalises -0 to +0 on insert; the callback and the stored key must
// both see the canonical form, not the raw argument.
const canonicalKey = (key: any): any => (key === 0 ? 0 : key);

export const mapGetOrInsert = function (this: any, key: any, value: any): any {
  const normalized = canonicalKey(key);
  if (this.has(normalized)) {
    return this.get(normalized);
  }
  this.set(normalized, value);
  return value;
};

if (typeof Map !== 'undefined' && Map.prototype && !isSupported()) {
  Object.defineProperty((Map.prototype as any), 'getOrInsert', { value: mapGetOrInsert, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((Map.prototype as any).getOrInsert, 'name', { value: 'getOrInsert', configurable: true });
  Object.defineProperty((Map.prototype as any).getOrInsert, '__polyfilled', { value: true });
}
