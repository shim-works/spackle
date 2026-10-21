// Behavioral, not existence: the Error constructors have always existed --
// what's new is honouring the options bag. An existence check would never fire.
// Reached through window, never by bare name: esbuild renames a declaration that
// shadows a global the same file uses, which would turn the shells' `function
// Error` below into `Error2`.
export const isSupported = (): boolean => {
  try {
    const w: any = window;
    return new w.Error('m', { cause: 1 }).cause === 1 && new w.TypeError('m', { cause: 1 }).cause === 1;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-error-message
 *
 * Each wrapper builds a real native error and returns it, sharing the native's
 * prototype object: instanceof works both ways, `.stack` is genuine and
 * Error.prototype is untouched. AggregateError reads options.cause itself.
 *
 * Known limitations:
 * - [scope] `Error.call(this, msg)` (downlevelled `class X extends Error`) still
 *   returns a fresh error rather than initialising `this`, as native ES5 does.
 */

// Reused descriptor: no allocation per call.
const CAUSE: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: true };

// The one body every shell below runs.
const build = function (Native: any, message: any, options: any): any {
  const error = message === undefined ? new Native() : new Native(message);
  // inlined: setCause(error, options)
  if (options !== null && typeof options === 'object' && 'cause' in options) {
    CAUSE.value = options.cause;
    Object.defineProperty(error, 'cause', CAUSE);
    CAUSE.value = undefined; // never pin the last cause
  }
  return error;
};

/*
 * One named shell per constructor. Chrome < 43 and Safari 7.1 can't redefine a
 * function's name or length, so both come from the source: the name from the
 * function expression, the spec length of 1 from the one declared param (core-js
 * builds its wrappers the same way). options is read from arguments, which is
 * never passed on. esbuild and swc rename a shell that shadows a global the
 * bundle uses (TypeError2): accepted, core-js's wrappers get the same.
 */
const SHELLS: { [name: string]: (Native: any) => any } = {
  Error: function (N: any) {
    return function Error(message?: any) { return build(N, message, arguments.length > 1 ? arguments[1] : undefined); };
  },
  TypeError: function (N: any) {
    return function TypeError(message?: any) { return build(N, message, arguments.length > 1 ? arguments[1] : undefined); };
  },
  RangeError: function (N: any) {
    return function RangeError(message?: any) { return build(N, message, arguments.length > 1 ? arguments[1] : undefined); };
  },
  SyntaxError: function (N: any) {
    return function SyntaxError(message?: any) { return build(N, message, arguments.length > 1 ? arguments[1] : undefined); };
  },
  ReferenceError: function (N: any) {
    return function ReferenceError(message?: any) { return build(N, message, arguments.length > 1 ? arguments[1] : undefined); };
  },
  EvalError: function (N: any) {
    return function EvalError(message?: any) { return build(N, message, arguments.length > 1 ? arguments[1] : undefined); };
  },
  URIError: function (N: any) {
    return function URIError(message?: any) { return build(N, message, arguments.length > 1 ? arguments[1] : undefined); };
  },
};

// Any other constructor (a test's own): same body, no name to give it.
const anonymousShell = function (N: any) {
  return function (message?: any) { return build(N, message, arguments.length > 1 ? arguments[1] : undefined); };
};

export const wrapErrorConstructor = function (Native: any): any {
  // Native constructors keep their real name on every engine in range.
  const shell = Object.prototype.hasOwnProperty.call(SHELLS, Native.name) ? SHELLS[Native.name] : anonymousShell;
  const Wrapped = shell(Native) as any;

  // Same prototype OBJECT, not a copy -- this is the whole trick.
  Wrapped.prototype = Native.prototype;

  // `.constructor` on every instance -- native-thrown ones included -- now
  // names the global the app sees, so `new TypeError().constructor === TypeError`.
  try {
    Object.defineProperty(Native.prototype, 'constructor', { value: Wrapped, writable: true, enumerable: false, configurable: true });
  } catch {
    /* locked prototype: identity stays with the native */
  }

  // Forward own statics (captureStackTrace, stackTraceLimit, ...) as accessors to
  // the native: the engine reads them off its own intrinsic.
  const names = Object.getOwnPropertyNames(Native);
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (name === 'prototype' || name === 'length' || name === 'name') continue;
    try {
      const descriptor = Object.getOwnPropertyDescriptor(Native, name);
      if (!descriptor) continue;
      Object.defineProperty(Wrapped, name, {
        get: function () {
          return Native[name];
        },
        set: function (value: any) {
          Native[name] = value;
        },
        enumerable: descriptor.enumerable,
        configurable: true,
      });
    } catch {
      /* non-configurable static -- skip it rather than abort the wrap */
    }
  }

  return Wrapped;
};

export const install = (): void => {
  if (typeof window !== 'undefined') {
    const targets = [
      'Error',
      'TypeError',
      'RangeError',
      'SyntaxError',
      'ReferenceError',
      'EvalError',
      'URIError',
    ];
    const NativeError = (window as any).Error;
    for (let i = 0; i < targets.length; i++) {
      const name = targets[i];
      const Native = (window as any)[name];
      if (typeof Native !== 'function') continue;
      const Wrapped = wrapErrorConstructor(Native);
      Object.defineProperty((window as any), name, { value: Wrapped, writable: true, enumerable: false, configurable: true });
      Object.defineProperty(Wrapped, '__polyfilled', { value: true });
    }
    /*
     * Every NativeError's [[Prototype]] is %Error% -- now the wrapper. Re-point
     * the wrapped ones, and the subclasses built on the native before this ran
     * (AggregateError, SuppressedError).
     */
    const WrappedError = (window as any).Error;
    if (NativeError !== WrappedError) {
      const setProto =
        Object.setPrototypeOf ||
        function (target: any, proto: any) {
          target.__proto__ = proto;
          return target;
        };
      const children = targets.slice(1).concat(['AggregateError', 'SuppressedError']);
      for (let i = 0; i < children.length; i++) {
        const ctor = (window as any)[children[i]];
        if (typeof ctor !== 'function') continue;
        const wrapped = i < targets.length - 1;
        try {
          if (wrapped || Object.getPrototypeOf(ctor) === NativeError) setProto(ctor, WrappedError);
        } catch (e) { /* engine refuses: instanceof still holds */ }
      }
    }
  }
};
