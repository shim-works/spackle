// Existence-only: __lookupSetter__ is either present and correct or absent.
export const isSupported = (): boolean => {
  try {
    return typeof (Object.prototype as any).__lookupSetter__ === 'function';
  } catch {
    return false;
  }
};

export const isObjectLookupSetterSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-object.prototype.__lookupSetter__
 * (Annex B, but universally relied on.)
 */
export const objectLookupSetter = function (this: any, key: any): any {
  if (this === null || this === undefined) {
    throw new TypeError('Object.prototype.__lookupSetter__ called on null or undefined');
  }
  let object = Object(this);
  const propertyKey = typeof key === 'symbol' ? key : String(key);
  // walk the prototype chain -- the accessor may be inherited, and only the
  // first object that owns the key counts
  do {
    const descriptor = Object.getOwnPropertyDescriptor(object, propertyKey);
    if (descriptor) {
      return descriptor.set;
    }
    object = Object.getPrototypeOf(object);
  } while (object !== null);
  return undefined;
};

if (!isSupported()) {
  Object.defineProperty((Object.prototype as any), '__lookupSetter__', { value: objectLookupSetter, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((Object.prototype as any).__lookupSetter__, 'name', { value: '__lookupSetter__', configurable: true });
  Object.defineProperty((Object.prototype as any).__lookupSetter__, '__polyfilled', {
    value: true,
  });
}
