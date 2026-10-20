/**
 * Behavioural: ES5 natives throw on a primitive (Chrome 38: Object.keys('ab'));
 * ES2015 boxes it through ToObject.
 */
export const isSupported = (): boolean => {
  try {
    if (typeof Object.keys !== 'function') {
      return false;
    }
    // ES5 natives throw right here; ES2015 sees the boxed String.
    const keys = Object.keys('ab' as any);
    return !!keys && keys.length === 2 && keys[0] === '0' && keys[1] === '1';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.keys */

const nativeKeys = typeof Object.keys === 'function' ? Object.keys : null;

export const objectKeys = function (target: any): string[] {
  // ToObject still rejects null/undefined — Object() would box them to {}
  if (target === null || target === undefined) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  const object = Object(target);
  if (nativeKeys) {
    return nativeKeys(object);
  }
  // inline ES3 fallback: own enumerable string keys
  const keys: string[] = [];
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      keys.push(key);
    }
  }
  return keys;
};

