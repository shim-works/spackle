// Existence-only: __defineSetter__ is either present and correct or absent.
export const isSupported = (): boolean => {
  try {
    return typeof (Object.prototype as any).__defineSetter__ === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-object.prototype.__defineSetter__
 * (Annex B, but universally relied on.)
 */
// Reused descriptor: no allocation per call.
const ACCESSOR: PropertyDescriptor = { set: undefined, enumerable: true, configurable: true };

export const objectDefineSetter = function (this: any, key: any, setter: any): void {
  if (this === null || this === undefined) {
    throw new TypeError('Object.prototype.__defineSetter__ called on null or undefined');
  }
  if (typeof setter !== 'function') {
    throw new TypeError('Setter must be a function');
  }
  // limit: no try/finally (not in the baseline). If defineProperty throws -- a
  // non-configurable key -- the descriptor holds this one function until the next
  // call overwrites it.
  ACCESSOR.set = setter;
  Object.defineProperty(Object(this), key, ACCESSOR);
  ACCESSOR.set = undefined; // never pin the user's function
};

