export const isSupported = (): boolean => {
  try {
    // core-js DOES_NOT_WORK_WITH_PRIMITIVES
    return typeof Map.groupBy === 'function' && (Map as any).groupBy('ab', function (it: any) { return it; }).get('a').length === 1;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-map.groupby */

// One descriptor for building each group's array (CreateArrayFromList), reused.
const LIST: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };

const isObject = (value: any): boolean =>
  value !== null && (typeof value === 'object' || typeof value === 'function');

const addToGroup = (groups: any, key: any, value: any): void => {
  // SameValueZero: -0 buckets with +0
  const normalized = key === 0 ? 0 : key;
  let elements = groups.get(normalized);
  if (!elements) {
    elements = [];
    groups.set(normalized, elements);
  }
  LIST.value = value;
  Object.defineProperty(elements, elements.length, LIST);
  LIST.value = undefined;
};

export const mapGroupBy = function groupBy(items: any, callbackfn: any): any {
  if (items === null || items === undefined) {
    throw new TypeError('Map.groupBy requires an iterable of items');
  }
  if (typeof callbackfn !== 'function') {
    throw new TypeError('Map.groupBy callback is not a function');
  }
  // The live global on purpose: this static gets installed ONTO whatever Map is
  // live (native or the island — the mount gates Map first), so constructing off
  // it keeps `Map.groupBy(x) instanceof Map` true either way.
  const groups = new Map();
  const iteratorKey = typeof Symbol !== 'undefined' ? (Symbol as any).iterator : undefined;
  if (iteratorKey) {
    // GetIterator(items, sync): not iterable is a TypeError
    const method = items[iteratorKey];
    if (typeof method !== 'function') throw new TypeError('Map.groupBy argument is not iterable');
    const iterator = method.call(items);
    if (!isObject(iterator)) throw new TypeError('Result of the Symbol.iterator method is not an object');
    const next = iterator.next;
    let k = 0;
    for (;;) {
      const step = next.call(iterator);
      if (!isObject(step)) throw new TypeError('Iterator result is not an object');
      if (step.done) return groups;
      const value = step.value;
      let key: any;
      try {
        if (k >= 9007199254740991) throw new TypeError('Map.groupBy: too many elements');
        key = callbackfn(value, k);
      } catch (error) {
        // the callback failed: close the source, then rethrow its error
        try {
          const ret = iterator['return'];
          if (ret !== undefined && ret !== null) ret.call(iterator);
        } catch (e) {
          /* the original error wins */
        }
        throw error;
      }
      addToGroup(groups, key, value);
      k++;
    }
  }
  // Engines without Symbol: nothing is iterable, so read an array-like.
  if (typeof items.length === 'number') {
    for (let i = 0; i < items.length; i++) addToGroup(groups, callbackfn(items[i], i), items[i]);
    return groups;
  }
  throw new TypeError('Map.groupBy argument is not iterable');
};
