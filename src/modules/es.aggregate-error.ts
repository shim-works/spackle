// ids: es.aggregate-error, es.aggregate-error.cause

import { define } from '../define.js';

export const isSupported = (): boolean => {
  try {
    // Read the global: the bare name `AggregateError` resolves to this module's own polyfill.
    const AggregateError = (window as any).AggregateError;
    return typeof AggregateError === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-aggregate-error-objects
 * Inspired by: es-shims/AggregateError
 *
 * Known limitations:
 * - [scope] Subclassing via `class extends AggregateError` gets the ES5
 *   prototype chain, not new.target plumbing — fine for the transpiled app.
 */

// Drain the errors argument into a fresh array: iterator protocol when one is
// live (native Symbol or the island), plain array-like as the ES5 fallback.
const drainErrors = (errors: any): any[] => {
  if (errors == null) {
    throw new TypeError('AggregateError requires an iterable of errors');
  }
  const out: any[] = [];
  if (
    typeof Symbol !== 'undefined' &&
    (Symbol as any).iterator &&
    typeof errors[(Symbol as any).iterator] === 'function'
  ) {
    const it = errors[(Symbol as any).iterator]();
    let step = it.next();
    while (!step.done) {
      out.push(step.value);
      step = it.next();
    }
    return out;
  }
  if (typeof errors.length === 'number') {
    for (let i = 0; i < errors.length; i++) {
      out.push(errors[i]);
    }
    return out;
  }
  throw new TypeError('AggregateError argument is not iterable');
};

// Instance props are data-defined non-enumerable to match native shape.
// Reused descriptor: no allocation per call.
const HIDDEN: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: true };

export const AggregateError = function AggregateError(
  this: any,
  errors: any,
  message?: any,
  options?: any,
): any {
  // callable with or without new, like the native Error family
  const self =
    this instanceof (AggregateError as any)
      ? this
      : Object.create((AggregateError as any).prototype);
  // spec order: message first, then cause, then the errors iterable
  if (message !== undefined) {
    // inlined: defineHidden(self, 'message', ...)
    HIDDEN.value = String(message);
    Object.defineProperty(self, 'message', HIDDEN);
    HIDDEN.value = undefined; // never pin the last value
  }
  if (options !== null && typeof options === 'object' && 'cause' in options) {
    // inlined: defineHidden(self, 'cause', ...)
    HIDDEN.value = options.cause;
    Object.defineProperty(self, 'cause', HIDDEN);
    HIDDEN.value = undefined; // never pin the last value
  }
  // inlined: defineHidden(self, 'errors', ...)
  HIDDEN.value = drainErrors(errors);
  Object.defineProperty(self, 'errors', HIDDEN);
  HIDDEN.value = undefined; // never pin the last value
  // borrow a stack from a throwaway Error so devtools traces still point home
  const stackCarrier = new Error(message);
  if (stackCarrier.stack) {
    // inlined: defineHidden(self, 'stack', ...)
    HIDDEN.value = stackCarrier.stack;
    Object.defineProperty(self, 'stack', HIDDEN);
    HIDDEN.value = undefined; // never pin the last value
  }
  return self;
} as any;

AggregateError.prototype = Object.create(Error.prototype);
Object.defineProperty(AggregateError.prototype, 'constructor', {
  value: AggregateError,
  writable: true,
  enumerable: false,
  configurable: true,
});
try {
  try {
    Object.defineProperty(AggregateError.prototype, 'name', {
      value: 'AggregateError',
      writable: true,
      enumerable: false,
      configurable: true,
    });
  } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
} catch (e) { /* Function#name non-configurable pre-ES6 */ }
Object.defineProperty(AggregateError.prototype, 'message', {
  value: '',
  writable: true,
  enumerable: false,
  configurable: true,
});

// Self-installs on import: other islands capture this constructor at module scope.
export const install = (): void => {
  define(window, 'AggregateError', AggregateError);
};
