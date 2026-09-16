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

export const isErrorCauseSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-error-message
 *
 * Each wrapper builds a REAL native error and hands it back (a constructor
 * returning an object overrides `this`), then shares the native's prototype
 * object outright. That's what keeps this from being a wholesale swap:
 *
 *   - `instanceof` works in both directions, for the wrapper and for Error
 *   - `.stack` is genuine, not borrowed from a throwaway
 *   - Error.prototype is untouched, so es.error.to-string and friends are
 *     unaffected
 *   - existing `e instanceof TypeError` checks anywhere in the app keep working
 *
 * AggregateError is deliberately not in the list -- es.aggregate-error.ts
 * already reads options.cause itself.
 *
 * Known limitations:
 * - [scope] `Error.call(this, msg)`, which is what downlevelled
 *   `class X extends Error` emits, still returns a fresh error rather than
 *   initialising `this`. That is exactly what native ES5 does; not a regression.
 */

const setCause = (error: any, options: any): void => {
  if (options !== null && typeof options === 'object' && 'cause' in options) {
    Object.defineProperty(error, 'cause', {
      value: options.cause,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
};

export const wrapErrorConstructor = function (Native: any): any {
  const Wrapped = function (this: any, message?: any, options?: any): any {
    const error = message === undefined ? new Native() : new Native(message);
    setCause(error, options);
    return error;
  } as any;

  // Same prototype OBJECT, not a copy -- this is the whole trick.
  Wrapped.prototype = Native.prototype;

  // Carry across own statics (captureStackTrace, stackTraceLimit, and on the
  // base Error our own isError from es.error.is-error if it landed first).
  const names = Object.getOwnPropertyNames(Native);
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (name === 'prototype' || name === 'length' || name === 'name') continue;
    try {
      const descriptor = Object.getOwnPropertyDescriptor(Native, name);
      if (descriptor) Object.defineProperty(Wrapped, name, descriptor);
    } catch {
      /* non-configurable static -- skip it rather than abort the wrap */
    }
  }

  return Wrapped;
};

if (typeof window !== 'undefined' && !isSupported()) {
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
