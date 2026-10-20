export const isSupported = (): boolean => {
  try {
    return typeof Promise !== 'undefined' && typeof Promise.try === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-promise.try */
export const promiseTry = function (this: any, callback: (...args: any[]) => any): any {
  /* `arguments`, not a rest parameter: the common `Promise.try(fn)` needs no array. */
  const argCount = arguments.length;
  let args: any[] | null = null;
  if (argCount > 1) {
    args = [];
    for (let i = 1; i < argCount; i++) {
      args[i - 1] = arguments[i];
    }
  }

  return new this(function (resolve: any): void {
    // If callback throws here, the executor throws → the promise rejects with
    // that error, which is exactly the behaviour we want.
    resolve(args === null ? callback() : callback.apply(undefined, args));
  });
};

