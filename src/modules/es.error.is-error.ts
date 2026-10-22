// Existence-only: Error.isError is a new static, absent everywhere on the floor.
export const isSupported = (): boolean => {
  try {
    const isError = (Error as any).isError;
    if (typeof isError !== 'function') return false;
    // core-js: DOMExceptions and errors with a function cause count; an object
    // that merely inherits from Error.prototype does not
    const DOMExceptionCtor = (window as any).DOMException;
    if (typeof DOMExceptionCtor === 'function' && !isError(new DOMExceptionCtor('DOMException'))) return false;
    if (!isError(new (Error as any)('Error', { cause: function () {} }))) return false;
    return !isError(Object.create(Error.prototype));
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

// A DOMException carries [[ErrorData]] too (WebIDL), but its builtin tag is not
// "Error". Its prototype's name getter brand-checks: it throws on anything that
// is not a real DOMException, so calling it is the slot test.
const domExceptionName: any = (function () {
  try {
    const D = (window as any).DOMException;
    const d = D && getOwnDesc(D.prototype, 'name');
    return d && typeof d.get === 'function' ? d.get : null;
  } catch (e) {
    return null;
  }
})();
const isDOMException = (value: any): boolean => {
  if (domExceptionName === null) return false;
  try {
    domExceptionName.call(value);
    return true;
  } catch (e) {
    return false;
  }
};

export const errorIsError = function isError(value: any): boolean {
  if (value === null || (typeof value !== 'object' && typeof value !== 'function')) return false;
  if (isDOMException(value)) return true;
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
