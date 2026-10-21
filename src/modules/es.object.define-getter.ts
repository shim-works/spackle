// Captured at module eval, before install-polyfills can replace it.
const nativeDefineSetter: any = (Object.prototype as any).__defineSetter__;

// core-js's object-prototype-accessors-forced: a native __defineSetter__ must
// throw on a null receiver (Chrome 41's defines on window instead).
export const isSupported = (): boolean => {
  try {
    if (typeof (Object.prototype as any).__defineGetter__ !== 'function' || typeof nativeDefineSetter !== 'function') return false;
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
 * Spec: https://tc39.es/ecma262/#sec-object.prototype.__defineGetter__
 * (Annex B, but universally relied on.)
 */
// Reused descriptor: no allocation per call.
const ACCESSOR: PropertyDescriptor = { get: undefined, enumerable: true, configurable: true };

export const objectDefineGetter = function (this: any, key: any, getter: any): void {
  if (this === null || this === undefined) {
    throw new TypeError('Object.prototype.__defineGetter__ called on null or undefined');
  }
  if (typeof getter !== 'function') {
    throw new TypeError('Getter must be a function');
  }
  // limit: no try/finally (not in the baseline). If defineProperty throws -- a
  // non-configurable key -- the descriptor holds this one function until the next
  // call overwrites it.
  ACCESSOR.get = getter;
  Object.defineProperty(Object(this), key, ACCESSOR);
  ACCESSOR.get = undefined; // never pin the user's function
};

