/**
 * Spec: https://tc39.es/ecma262/#sec-object.fromentries
 * Ported from: the prior implementation (object-from-entries.ts + is-object-from-entries-supported.ts)
 *
 * Known limitations:
 * - [incomplete] Does not handle generic iterables (Symbol.iterator protocol).
 *   Only Array-of-pairs and Map/Set-like objects with a forEach(value, key)
 *   method are supported. Generators, custom iterables, etc. are not.
 */

export const isSupported = (): boolean => {
  try {
    return typeof Object.fromEntries === 'function';
  } catch {
    return false;
  }
};

export const isObjectFromEntriesSupported = isSupported;

let warnedGenericIterable = false;

export const objectFromEntries = (iterable: any) => {
  const result: Record<string, any> = {};
  if (Array.isArray(iterable)) {
    for (let i = 0; i < iterable.length; i++) {
      result[iterable[i][0]] = iterable[i][1];
    }
  } else if (typeof iterable.forEach === 'function') {
    iterable.forEach((value: any, key: string) => {
      result[key] = value;
    });
  } else {
    if (!warnedGenericIterable) {
      warnedGenericIterable = true;
      console.warn(
        '[spackle] Object.fromEntries: generic iterables are not implemented — only arrays of pairs and forEach-bearing collections; returning {}'
      );
    }
  }
  return result;
};

if (!isSupported()) {
  Object.defineProperty(Object, 'fromEntries', { value: objectFromEntries, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.fromEntries, 'name', { value: 'fromEntries', configurable: true });
  Object.defineProperty((Object.fromEntries as any), '__polyfilled', { value: true });
}
