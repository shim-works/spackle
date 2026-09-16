// Existence-only: Error.isError is a new static, absent everywhere on the floor.
export const isSupported = (): boolean => {
  try {
    return typeof (Error as any).isError === 'function';
  } catch {
    return false;
  }
};

export const isErrorIsErrorSupported = isSupported;

/**
 * Spec: https://tc39.es/proposal-is-error/
 *
 * Known limitations:
 * - [incomplete] The spec tests for an [[ErrorData]] internal slot, which ES5
 *   cannot see. This uses the brand string instead, which is the closest
 *   observable proxy. Consequences: an object with a forged
 *   Symbol.toStringTag of 'Error' reads as true, and a DOMException reads as
 *   false even though the spec says true (it brands as [object DOMException]).
 *   Cross-realm errors work correctly, which is the case that actually
 *   motivated the proposal.
 */
export const errorIsError = function (value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Error]';
};

if (!isSupported()) {
  Object.defineProperty((Error as any), 'isError', { value: errorIsError, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((Error as any).isError, 'name', { value: 'isError', configurable: true });
  Object.defineProperty((Error as any).isError, '__polyfilled', { value: true });
}
