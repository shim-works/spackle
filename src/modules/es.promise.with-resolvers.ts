export const isSupported = (): boolean => {
  try {
    return typeof Promise !== 'undefined' && typeof Promise.withResolvers === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-promise.withresolvers */

const isObject = (value: any): boolean =>
  value !== null && (typeof value === 'object' || typeof value === 'function');
const hasOwn = Object.prototype.hasOwnProperty;
// IsConstructor, best ES5 approximation: ordinary and built-in constructors carry
// an own prototype; bound functions are constructors without one.
const isConstructor = (C: any): boolean =>
  typeof C === 'function' && (hasOwn.call(C, 'prototype') || /^bound /.test(C.name || ''));

/*
 * Built-in closures (resolve element functions, capability wrappers) are not
 * constructors and have no prototype. ES5 function expressions always are, so
 * where the engine parses arrows, wrap in one (length 1, name '').
 */
let arrowWrap: any = null;
try {
  arrowWrap = new Function('f', 'return (x) => f(x)');
} catch (e) {
  /* no arrow syntax (or CSP): plain functions, the ES5 best */
}
const builtinClosure = (fn: (x: any) => any): any =>
  arrowWrap ? arrowWrap(fn) : function (x: any) { return fn(x); };

// NewPromiseCapability(C), with GetCapabilitiesExecutor's checks.
const newPromiseCapability = (C: any): any => {
  if (!isConstructor(C)) throw new TypeError('Promise capability: not a constructor');
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
  return capability;
};

export const promiseWithResolvers = function withResolvers(this: any): any {
  const capability = newPromiseCapability(this);
  // a fresh plain object, keys in spec order
  return { promise: capability.promise, resolve: capability.resolve, reject: capability.reject };
};
