export const isSupported = (): boolean => {
  try {
    return typeof Object.groupBy === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.groupby */

export const objectGroupBy = (items: any, callbackfn: any): any => {
  if (items == null) {
    throw new TypeError('Object.groupBy requires an iterable of items');
  }
  if (typeof callbackfn !== 'function') {
    throw new TypeError('Object.groupBy callback is not a function');
  }
  // null prototype per spec — group names can't collide with Object.prototype
  const groups = Object.create(null);
  // ToPropertyKey: native symbols pass through untouched, everything else strings
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
      // inlined: addTo(callbackfn(step.value, index++), step.value) -- ToPropertyKey: native symbols pass through
      const key = callbackfn(step.value, index++);
      const propertyKey = typeof key === 'symbol' ? key : String(key);
      if (groups[propertyKey]) groups[propertyKey].push(step.value);
      else groups[propertyKey] = [step.value];
      step = it.next();
    }
    return groups;
  }
  // ES5 fallback: array-like
  if (typeof items.length === 'number') {
    for (let i = 0; i < items.length; i++) {
      // inlined: addTo(callbackfn(items[i], i), items[i]) -- ToPropertyKey: native symbols pass through
      const key = callbackfn(items[i], i);
      const propertyKey = typeof key === 'symbol' ? key : String(key);
      if (groups[propertyKey]) groups[propertyKey].push(items[i]);
      else groups[propertyKey] = [items[i]];
    }
    return groups;
  }
  throw new TypeError('Object.groupBy argument is not iterable');
};

