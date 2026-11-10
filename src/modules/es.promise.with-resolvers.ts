export const isSupported = (): boolean => {
  try {
    return typeof Promise !== 'undefined' && typeof Promise.withResolvers === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-promise.withresolvers */

const hasOwn = Object.prototype.hasOwnProperty;

export const promiseWithResolvers = function withResolvers(this: any): any {
  const C = this;
  // inlined: newPromiseCapability(C), with GetCapabilitiesExecutor's checks
  // inlined: isConstructor(C) -- ordinary and built-in constructors carry an own
  // prototype; bound functions are constructors without one
  if (!(typeof C === 'function' && (hasOwn.call(C, 'prototype') || /^bound /.test(C.name || '')))) {
    throw new TypeError('Promise capability: not a constructor');
  }
  const capability: any = { promise: undefined, resolve: undefined, reject: undefined };
  const executor = function (resolve: any, reject: any): void {
    if (capability.resolve !== undefined) throw new TypeError('Promise executor has already been invoked with non-undefined arguments');
    if (capability.reject !== undefined) throw new TypeError('Promise executor has already been invoked with non-undefined arguments');
    capability.resolve = resolve;
    capability.reject = reject;
  };
  capability.promise = new C(executor);
  if (typeof capability.resolve !== 'function') throw new TypeError('Promise resolve function is not callable');
  if (typeof capability.reject !== 'function') throw new TypeError('Promise reject function is not callable');
  // a fresh plain object, keys in spec order
  return { promise: capability.promise, resolve: capability.resolve, reject: capability.reject };
};
