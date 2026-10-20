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
 * Known limitations:
 * - [incomplete] Uses the brand string, since ES5 can't see [[ErrorData]]: a forged
 *   Symbol.toStringTag of 'Error' reads true, and a DOMException reads false.
 */
export const errorIsError = function (value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Error]';
};

