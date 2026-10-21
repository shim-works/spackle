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

const isObject = (value: any): boolean =>
  value !== null && (typeof value === 'object' || typeof value === 'function');

// ToString: String(symbol) returns "Symbol(...)"; the spec throws a TypeError.
const toStr = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return typeof value === 'string' ? value : String(value);
};

// Instance props are data-defined non-enumerable to match native shape.
// Reused descriptors: no allocation per call.
const HIDDEN: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: true };
const LIST: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };

/*
 * IterableToList(errors) -> CreateArrayFromList: GetMethod(@@iterator) (absent is
 * a TypeError), next read once, every result an Object. Engines with no Symbol
 * at all fall back to reading an array-like.
 */
const drainErrors = (errors: any): any[] => {
  if (errors === null || errors === undefined) {
    throw new TypeError('AggregateError requires an iterable of errors');
  }
  const out: any[] = [];
  let count = 0;
  const iteratorKey = typeof Symbol !== 'undefined' ? (Symbol as any).iterator : undefined;
  if (iteratorKey) {
    const method = errors[iteratorKey];
    if (method === undefined || method === null) throw new TypeError('AggregateError argument is not iterable');
    const iterator = method.call(errors);
    if (!isObject(iterator)) throw new TypeError('Result of the Symbol.iterator method is not an object');
    const next = iterator.next;
    while (true) {
      const step = next.call(iterator);
      if (!isObject(step)) throw new TypeError('Iterator result is not an object');
      if (step.done) break;
      LIST.value = step.value;
      Object.defineProperty(out, count++, LIST);
    }
    LIST.value = undefined;
    return out;
  }
  if (typeof errors.length === 'number') {
    for (let i = 0; i < errors.length; i++) {
      LIST.value = errors[i];
      Object.defineProperty(out, count++, LIST);
    }
    LIST.value = undefined;
    return out;
  }
  throw new TypeError('AggregateError argument is not iterable');
};

const setProto =
  Object.setPrototypeOf ||
  function (o: any, proto: any) {
    o.__proto__ = proto;
    return o;
  };

// Declared (errors, message) for the spec length of 2; options comes from arguments.
export const AggregateError = function AggregateError(this: any, errors: any, message?: any): any {
  const options = arguments.length > 2 ? arguments[2] : undefined;
  // spec order: ToString(message) once, then InstallErrorCause, then the errors iterable
  const msg = message === undefined ? undefined : toStr(message);
  /*
   * Built on a real Error so it carries [[ErrorData]] (Object.prototype.toString
   * says "Error", Error.isError agrees) and a native stack. Callable with or
   * without new; a subclass instance keeps its own prototype.
   */
  const self: any = msg === undefined ? new Error() : new Error(msg);
  const proto = this instanceof (AggregateError as any) ? Object.getPrototypeOf(this) : (AggregateError as any).prototype;
  setProto(self, proto);
  if (isObject(options) && 'cause' in options) {
    HIDDEN.value = options.cause;
    Object.defineProperty(self, 'cause', HIDDEN);
    HIDDEN.value = undefined; // never pin the last value
  }
  HIDDEN.value = drainErrors(errors);
  Object.defineProperty(self, 'errors', HIDDEN);
  HIDDEN.value = undefined; // never pin the last value
  return self;
} as any;

// AggregateError's [[Prototype]] is %Error%, like every NativeError constructor.
try {
  setProto(AggregateError, Error);
} catch (e) { /* engine refuses: the prototype chain below still holds */ }
AggregateError.prototype = Object.create(Error.prototype);
Object.defineProperty(AggregateError.prototype, 'constructor', {
  value: AggregateError,
  writable: true,
  enumerable: false,
  configurable: true,
});
Object.defineProperty(AggregateError.prototype, 'name', {
  value: 'AggregateError',
  writable: true,
  enumerable: false,
  configurable: true,
});
Object.defineProperty(AggregateError.prototype, 'message', {
  value: '',
  writable: true,
  enumerable: false,
  configurable: true,
});
Object.defineProperty(AggregateError, 'prototype', { writable: false, enumerable: false, configurable: false });

// Self-installs on import: other islands capture this constructor at module scope.
export const install = (): void => {
  define(window, 'AggregateError', AggregateError);
};
