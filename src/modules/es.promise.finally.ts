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


// PromiseResolve(C, x): x itself when it is already a promise made by C.
const promiseResolve = (C: any, x: any, Intrinsic: any): any => {
  if (typeof Intrinsic === 'function' && x instanceof Intrinsic && x.constructor === C) return x;
  return new C(function (resolve: any) {
    resolve(x);
  });
};

export const promiseFinally = function (this: any, onFinally: any): any {
  const promise: any = this;
  if (!isObject(promise)) {
    throw new TypeError('Promise.prototype.finally called on a non-object');
  }
  // SpeciesConstructor(promise, %Promise%)
  const Default: any = (window as any).Promise;
  let C: any = promise.constructor;
  if (C === undefined) {
    C = Default;
  } else {
    if (!isObject(C)) {
      throw new TypeError('Promise constructor is not an object');
    }
    const speciesKey = typeof Symbol !== 'undefined' ? (Symbol as any).species : undefined;
    const species = speciesKey ? C[speciesKey] : undefined;
    if (species === undefined || species === null) C = Default;
    else if (isConstructor(species)) C = species;
    else throw new TypeError('Promise @@species is not a constructor');
  }
  // Not callable: the argument passes straight through as both reactions
  // (Promise.resolve(1).finally() resolves to 1).
  if (typeof onFinally !== 'function') {
    return promise.then(onFinally, onFinally);
  }
  const thenFinally = builtinClosure(function (value: any) {
    const p = promiseResolve(C, onFinally(), Default);
    return p.then(function () {
      return value; // keep the original resolved value
    });
  });
  const catchFinally = builtinClosure(function (reason: any) {
    const p = promiseResolve(C, onFinally(), Default);
    return p.then(function () {
      throw reason; // keep the original rejection
    });
  });
  return promise.then(thenFinally, catchFinally);
};
