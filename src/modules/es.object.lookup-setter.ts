// Captured at module eval, before install-polyfills can replace it.
const nativeDefineSetter: any = (Object.prototype as any).__defineSetter__;

// core-js's object-prototype-accessors-forced: a native __defineSetter__ must
// throw on a null receiver (Chrome 41's defines on window instead).
export const isSupported = (): boolean => {
  try {
    if (typeof (Object.prototype as any).__lookupSetter__ !== 'function' || typeof nativeDefineSetter !== 'function') return false;
    const key = '__spackle_probe__' + Math.random();
    try {
      nativeDefineSetter.call(null, key, function () {});
    } catch (e) {
      return true;
    }
    delete (window as any)[key];
    return false;
  } catch {
    return false;
  }
};

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

