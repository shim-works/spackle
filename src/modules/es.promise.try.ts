// Ported from: the prior implementation (promise-try.ts)

export const isSupported = (): boolean => {
  try {
    return typeof Promise !== 'undefined' && typeof Promise.try === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-promise.try
 */
export const promiseTry = function (
  this: any,
  callback: (...args: any[]) => any,
  ...args: any[]
): any {
  return new this(function (resolve: any): void {
    // If callback throws here, the executor throws → the promise rejects with
    // that error, which is exactly the behaviour we want.
    resolve(callback.apply(undefined, args));
  });
};

if (typeof Promise !== 'undefined' && !isSupported()) {
  Object.defineProperty(Promise, 'try', { value: promiseTry as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Promise.try, 'name', { value: 'try', configurable: true });
  Object.defineProperty((Promise.try as any), '__polyfilled', { value: true });
}
