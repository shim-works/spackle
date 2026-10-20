// Promise.prototype.finally — existence is enough; if it's missing we patch just
// this method onto the native constructor (never swap the whole Promise).
export const isSupported = (): boolean => {
  try {
    return typeof Promise !== 'undefined' && typeof Promise.prototype.finally === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-promise.prototype.finally */
// PromiseResolve(C, x): x itself when it is already a C, else a new C.
export const promiseFinally = function <T>(
  this: Promise<T>,
  callback: () => any
): Promise<T> {
  const promise: any = this;
  if (promise === null || (typeof promise !== 'object' && typeof promise !== 'function')) {
    throw new TypeError('Promise.prototype.finally called on a non-object');
  }
  // SpeciesConstructor(promise, %Promise%)
  const Default: any = (window as any).Promise;
  let C: any = promise.constructor;
  if (C === undefined) {
    C = Default;
  } else {
    if (C === null || (typeof C !== 'object' && typeof C !== 'function')) {
      throw new TypeError('Promise constructor is not an object');
    }
    const speciesKey = typeof Symbol !== 'undefined' ? (Symbol as any).species : undefined;
    const species = speciesKey ? C[speciesKey] : undefined;
    C = species === undefined || species === null ? Default : species;
  }
  // Not callable: the argument passes straight through as both reactions
  // (Promise.resolve(1).finally() resolves to 1).
  if (typeof callback !== 'function') {
    return promise.then(callback, callback);
  }
  return promise.then(
    function (value: T) {
      const result = callback();
      // inlined: promiseResolve(C, result)
      const settled =
        result !== null && typeof result === 'object' && result.constructor === C
          ? result
          : new C(function (resolve: any) {
            resolve(result);
          });
      return settled.then(function () {
        return value; // keep the original resolved value
      });
    },
    function (reason: any) {
      const result = callback();
      // inlined: promiseResolve(C, result)
      const settled =
        result !== null && typeof result === 'object' && result.constructor === C
          ? result
          : new C(function (resolve: any) {
            resolve(result);
          });
      return settled.then(function () {
        throw reason; // keep the original rejection
      });
    }
  );
};

