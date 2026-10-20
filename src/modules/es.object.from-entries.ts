
export const isSupported = (): boolean => {
  try {
    return typeof Object.fromEntries === 'function';
  } catch {
    return false;
  }
};

/*
 * Spec: https://tc39.es/ecma262/#sec-object.fromentries
 *
 * Keys go in by CreateDataPropertyOrThrow, so '__proto__' becomes an own key.
 * Any iterable; a non-object entry is a TypeError and closes the iterator.
 */
const ENTRY: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };

const ObjectPrototype = Object.prototype;

const closeQuietly = (iterator: any): void => {
  try {
    const ret = iterator.return;
    if (typeof ret === 'function') ret.call(iterator);
  } catch (e) {
    /* the original error is the one that propagates */
  }
};

export const objectFromEntries = (iterable: any) => {
  if (iterable === null || iterable === undefined) {
    throw new TypeError('Object.fromEntries requires an iterable');
  }
  const result: Record<string, any> = {};
  const iteratorKey =
    typeof Symbol !== 'undefined' && (Symbol as any).iterator ? (Symbol as any).iterator : '@@iterator';
  const method = iterable[iteratorKey];

  // An array still iterated by the built-in values(): walk it by index, same
  // observable result without an iterator and a step object per entry.
  if (Array.isArray(iterable) && method === Array.prototype.values) {
    for (let i = 0; i < iterable.length; i++) {
      const entry = iterable[i];
      if (entry === null || (typeof entry !== 'object' && typeof entry !== 'function')) {
        throw new TypeError('Iterator value ' + String(entry) + ' is not an entry object');
      }
      // A plain store is exact for a fresh {} unless Object.prototype has the key
      // (__proto__, toString, an app's setter); only those need the define.
      // inlined: put(result, entry[0], entry[1])
      const key = entry[0];
      const value = entry[1];
      const propertyKey = typeof key === 'symbol' ? key : String(key);
      if (!(propertyKey in ObjectPrototype)) {
        (result as any)[propertyKey] = value;
      } else {
        ENTRY.value = value;
        Object.defineProperty(result, propertyKey, ENTRY);
        ENTRY.value = undefined; // never pin the last value
      }
    }
    return result;
  }

  if (typeof method !== 'function') {
    throw new TypeError('Object.fromEntries requires an iterable');
  }
  const iterator = method.call(iterable);
  for (;;) {
    const step = iterator.next();
    if (step.done) return result;
    const entry = step.value;
    if (entry === null || (typeof entry !== 'object' && typeof entry !== 'function')) {
      closeQuietly(iterator);
      throw new TypeError('Iterator value ' + String(entry) + ' is not an entry object');
    }
    try {
      // inlined: put(result, entry[0], entry[1])
      const key = entry[0];
      const value = entry[1];
      const propertyKey = typeof key === 'symbol' ? key : String(key);
      if (!(propertyKey in ObjectPrototype)) {
        (result as any)[propertyKey] = value;
      } else {
        ENTRY.value = value;
        Object.defineProperty(result, propertyKey, ENTRY);
        ENTRY.value = undefined; // never pin the last value
      }
    } catch (error) {
      closeQuietly(iterator);
      throw error;
    }
  }
};

