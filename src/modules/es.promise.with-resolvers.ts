// Ported from: the prior implementation (promise-with-resolvers.ts)

export const isSupported = (): boolean => {
  try {
    return typeof Promise !== 'undefined' && typeof Promise.withResolvers === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-promise.withresolvers
 */
export const promiseWithResolvers = function (this: any): {
  promise: any;
  resolve: any;
  reject: any;
} {
  let resolve: any;
  let reject: any;
  const promise = new this(function (
    resolveFn: any,
    rejectFn: any,
  ): void {
    resolve = resolveFn;
    reject = rejectFn;
  });
  return { promise: promise, resolve: resolve, reject: reject };
};

if (typeof Promise !== 'undefined' && !isSupported()) {
  Object.defineProperty(Promise, 'withResolvers', { value: promiseWithResolvers as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Promise.withResolvers, 'name', { value: 'withResolvers', configurable: true });
  Object.defineProperty((Promise.withResolvers as any), '__polyfilled', { value: true });
}
