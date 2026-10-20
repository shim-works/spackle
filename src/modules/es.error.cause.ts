// Behavioral, not existence: the Error constructors have always existed --
// what's new is honouring the options bag. An existence check would never fire.
export const isSupported = (): boolean => {
  try {
    return (
      (new Error('m', { cause: 1 } as any) as any).cause === 1 &&
      (new TypeError('m', { cause: 1 } as any) as any).cause === 1
    );
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

export const wrapErrorConstructor = function (Native: any): any {
  const Wrapped = function (this: any, message?: any, options?: any): any {
    const error = message === undefined ? new Native() : new Native(message);
    // inlined: setCause(error, options)
    if (options !== null && typeof options === 'object' && 'cause' in options) {
      CAUSE.value = options.cause;
      Object.defineProperty(error, 'cause', CAUSE);
      CAUSE.value = undefined; // never pin the last cause
    }
    return error;
  } as any;

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
    for (let i = 0; i < targets.length; i++) {
      const name = targets[i];
      const Native = (window as any)[name];
      if (typeof Native !== 'function') continue;
      const Wrapped = wrapErrorConstructor(Native);
      Object.defineProperty((window as any), name, { value: Wrapped, writable: true, enumerable: false, configurable: true });
      Object.defineProperty(Wrapped, '__polyfilled', { value: true });
    }
  }
};
