// Ported from: the prior implementation (map-group-by.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Map.groupBy === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-map.groupby
 */

export const mapGroupBy = (items: any, callbackfn: any): any => {
  if (items == null) {
    throw new TypeError('Map.groupBy requires an iterable of items');
  }
  if (typeof callbackfn !== 'function') {
    throw new TypeError('Map.groupBy callback is not a function');
  }
  // The live global on purpose: this static gets installed ONTO whatever Map is
  // live (native or the island — the mount gates Map first), so constructing off
  // it keeps `Map.groupBy(x) instanceof Map` true either way.
  const groups = new Map();
  const addTo = (key: any, value: any) => {
    // SameValueZero: -0 buckets with +0
    const normalized = key === 0 ? 0 : key;
    const existing = groups.get(normalized);
    if (existing) {
      existing.push(value);
    } else {
      groups.set(normalized, [value]);
    }
  };
  // iterator protocol when one is live (native Symbol or the island)
  if (
    typeof Symbol !== 'undefined' &&
    (Symbol as any).iterator &&
    typeof items[(Symbol as any).iterator] === 'function'
  ) {
    const it = items[(Symbol as any).iterator]();
    let index = 0;
    let step = it.next();
    while (!step.done) {
      addTo(callbackfn(step.value, index++), step.value);
      step = it.next();
    }
    return groups;
  }
  // ES5 fallback: array-like
  if (typeof items.length === 'number') {
    for (let i = 0; i < items.length; i++) {
      addTo(callbackfn(items[i], i), items[i]);
    }
    return groups;
  }
  throw new TypeError('Map.groupBy argument is not iterable');
};

if (!isSupported()) {
  Object.defineProperty(Map, 'groupBy', { value: mapGroupBy as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Map.groupBy, 'name', { value: 'groupBy', configurable: true });
  Object.defineProperty((Map.groupBy as any), '__polyfilled', { value: true });
}
