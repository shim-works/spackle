// Existence-only: Error.isError is a new static, absent everywhere on the floor.
export const isSupported = (): boolean => {
  try {
    return typeof (Error as any).isError === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/proposal-is-error/
 *
 * ES5 can't read [[ErrorData]] directly; Object.prototype.toString's builtin
 * tag is the same fact ("Error" exactly when the slot is there). A
 * Symbol.toStringTag anywhere on the chain would override it, so that tag is
 * shadowed with an own undefined one for the read, then put back -- found by
 * descriptor walk, so no getter runs.
 *
 * Known limitations:
 * - [incomplete] A value that carries a forged tag AND cannot take an own
 *   property (frozen, sealed, non-extensible) reads false.
 */
const objectToString = Object.prototype.toString;
const hasOwn = Object.prototype.hasOwnProperty;
const getProto = Object.getPrototypeOf;
const getOwnDesc = Object.getOwnPropertyDescriptor;
const defineProp = Object.defineProperty;
const tagKey = typeof Symbol !== 'undefined' ? (Symbol as any).toStringTag : undefined;
const shadow: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: true };

export const errorIsError = function isError(value: any): boolean {
  if (value === null || (typeof value !== 'object' && typeof value !== 'function')) return false;
  if (!tagKey) return objectToString.call(value) === '[object Error]';
  let tagged = false;
  let steps = 0;
  for (let o = value; o !== null && o !== undefined && steps < 100; o = getProto(o), steps++) {
    if (hasOwn.call(o, tagKey)) {
      tagged = true;
      break;
    }
  }
  if (!tagged) return objectToString.call(value) === '[object Error]';
  const own = getOwnDesc(value, tagKey);
  try {
    defineProp(value, tagKey, shadow);
  } catch (e) {
    return false;
  }
  try {
    return objectToString.call(value) === '[object Error]';
  } finally {
    if (own) defineProp(value, tagKey, own);
    else delete value[tagKey];
  }
};
