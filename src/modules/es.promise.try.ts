export const isSupported = (): boolean => {
  try {
    if (typeof Promise === 'undefined' || typeof Promise.try !== 'function') return false;
    // core-js: the callback gets the extra arguments, and a returned promise of
    // the same constructor comes back as is (PromiseResolve)
    let argument: any;
    const p = Promise.resolve();
    return (Promise as any).try(function (a: any) { argument = a; return p; }, 8) === p && argument === 8;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-promise.try */

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

// Declared (callbackfn) for the spec length of 1; the arguments follow it.
export const promiseTry = function (this: any, callbackfn: any): any {
  const C = this;
  if (!isObject(C)) throw new TypeError('Promise.try called on a non-object');
  /* `arguments`, not a rest parameter: the common `Promise.try(fn)` needs no array. */
  const argCount = arguments.length;
  let value: any;
  try {
    if (typeof callbackfn !== 'function') throw new TypeError('Promise.try callback is not a function');
    if (argCount <= 1) {
      value = callbackfn();
    } else {
      const args: any[] = [];
      for (let i = 1; i < argCount; i++) args[i - 1] = arguments[i];
      value = callbackfn.apply(undefined, args);
    }
  } catch (error) {
    const rejected = newPromiseCapability(C);
    rejected.reject(error);
    return rejected.promise;
  }
  // PromiseResolve (tc39/ecma262#3883): a promise of this constructor comes back as is
  if (isObject(value) && value.constructor === C) return value;
  const capability = newPromiseCapability(C);
  capability.resolve(value);
  return capability.promise;
};
