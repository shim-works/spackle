// Existence-only: __defineSetter__ is either present and correct or absent.
export const isSupported = (): boolean => {
  try {
    return typeof (Object.prototype as any).__defineSetter__ === 'function';
  } catch {
    return false;
  }
};

export const isObjectDefineSetterSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-object.prototype.__defineSetter__
 * (Annex B, but universally relied on.)
 */
export const objectDefineSetter = function (this: any, key: any, setter: any): void {
  if (this === null || this === undefined) {
    throw new TypeError('Object.prototype.__defineSetter__ called on null or undefined');
  }
  if (typeof setter !== 'function') {
    throw new TypeError('Setter must be a function');
  }
  Object.defineProperty(Object(this), key, {
    set: setter,
    enumerable: true,
    configurable: true,
  });
};

if (!isSupported()) {
  Object.defineProperty((Object.prototype as any), '__defineSetter__', { value: objectDefineSetter, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((Object.prototype as any).__defineSetter__, 'name', { value: '__defineSetter__', configurable: true });
  Object.defineProperty((Object.prototype as any).__defineSetter__, '__polyfilled', {
    value: true,
  });
}
