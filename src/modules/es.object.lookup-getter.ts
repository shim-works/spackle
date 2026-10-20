// Existence-only: __lookupGetter__ is either present and correct or absent.
export const isSupported = (): boolean => {
  try {
    return typeof (Object.prototype as any).__lookupGetter__ === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-object.prototype.__lookupGetter__
 * (Annex B, but universally relied on.)
 */
export const objectLookupGetter = function (this: any, key: any): any {
  if (this === null || this === undefined) {
    throw new TypeError('Object.prototype.__lookupGetter__ called on null or undefined');
  }
  let object = Object(this);
  const propertyKey = typeof key === 'symbol' ? key : String(key);
  // walk the prototype chain -- the accessor may be inherited, and only the
  // first object that owns the key counts
  do {
    const descriptor = Object.getOwnPropertyDescriptor(object, propertyKey);
    if (descriptor) {
      return descriptor.get;
    }
    object = Object.getPrototypeOf(object);
  } while (object !== null);
  return undefined;
};

