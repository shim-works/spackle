export const isSupported = (): boolean => {
  try {
    return typeof Map.groupBy === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-map.groupby */

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
      // inlined: addTo(callbackfn(step.value, index++), step.value) -- SameValueZero: -0 buckets with +0
      const key = callbackfn(step.value, index++);
      const normalized = key === 0 ? 0 : key;
      const existing = groups.get(normalized);
      if (existing) existing.push(step.value);
      else groups.set(normalized, [step.value]);
      step = it.next();
    }
    return groups;
  }
  // ES5 fallback: array-like
  if (typeof items.length === 'number') {
    for (let i = 0; i < items.length; i++) {
      // inlined: addTo(callbackfn(items[i], i), items[i]) -- SameValueZero: -0 buckets with +0
      const key = callbackfn(items[i], i);
      const normalized = key === 0 ? 0 : key;
      const existing = groups.get(normalized);
      if (existing) existing.push(items[i]);
      else groups.set(normalized, [items[i]]);
    }
    return groups;
  }
  throw new TypeError('Map.groupBy argument is not iterable');
};

