// Existence-only: __defineGetter__ is either present and correct or absent.
export const isSupported = (): boolean => {
  try {
    return typeof (Object.prototype as any).__defineGetter__ === 'function';
  } catch {
    return false;
  }
};

export const isObjectDefineGetterSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-object.prototype.__defineGetter__
 * (Annex B, but universally relied on.)
 */
export const objectDefineGetter = function (this: any, key: any, getter: any): void {
  if (this === null || this === undefined) {
    throw new TypeError('Object.prototype.__defineGetter__ called on null or undefined');
  }
  if (typeof getter !== 'function') {
    throw new TypeError('Getter must be a function');
  }
  Object.defineProperty(Object(this), key, {
    get: getter,
    enumerable: true,
    configurable: true,
  });
};

if (!isSupported()) {
  Object.defineProperty((Object.prototype as any), '__defineGetter__', { value: objectDefineGetter, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((Object.prototype as any).__defineGetter__, 'name', { value: '__defineGetter__', configurable: true });
  Object.defineProperty((Object.prototype as any).__defineGetter__, '__polyfilled', {
    value: true,
  });
}
