// Ported from: the prior implementation (promise-finally.ts + is-promise-finally-supported.ts)

// Promise.prototype.finally — existence is enough; if it's missing we patch just
// this method onto the native constructor (never swap the whole Promise).
export const isSupported = (): boolean => {
  try {
    return typeof Promise !== 'undefined' && typeof Promise.prototype.finally === 'function';
  } catch {
    return false;
  }
};

export const isPromiseFinallySupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-promise.prototype.finally
 * GC: handles callback promises by chaining via the constructor.
 */
export const promiseFinally = function <T>(
  this: Promise<T>,
  callback: () => any
): Promise<T> {
  // use the promise's own constructor (subclass-friendly), else the global
  const PromiseCtor =
    typeof (this as any).constructor === 'function' ? (this as any).constructor : Promise;
  return this.then(
    function (value: T) {
      return PromiseCtor.resolve(callback()).then(function () {
        return value; // keep the original resolved value
      });
    },
    function (reason: any) {
      return PromiseCtor.resolve(callback()).then(function () {
        throw reason; // keep the original rejection
      });
    }
  );
};

if (typeof Promise !== 'undefined' && !isSupported()) {
  Object.defineProperty(Promise.prototype, 'finally', { value: promiseFinally as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Promise.prototype.finally, 'name', { value: 'finally', configurable: true });
  Object.defineProperty((Promise.prototype.finally as any), '__polyfilled', { value: true });
}
