// Ported from: the prior implementation (aggregate-error.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
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
const defineHidden = (target: any, key: string, value: any): void => {
  Object.defineProperty(target, key, {
    value: value,
    writable: true,
    enumerable: false,
    configurable: true,
  });
};

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
    defineHidden(self, 'message', String(message));
  }
  if (options !== null && typeof options === 'object' && 'cause' in options) {
    defineHidden(self, 'cause', options.cause);
  }
  defineHidden(self, 'errors', drainErrors(errors));
  // borrow a stack from a throwaway Error so devtools traces still point home
  const stackCarrier = new Error(message);
  if (stackCarrier.stack) {
    defineHidden(self, 'stack', stackCarrier.stack);
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

if (!isSupported()) {
  (window as any).AggregateError = null;
  delete (window as any).AggregateError;
  Object.defineProperty((window as any), 'AggregateError', { value: AggregateError, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).AggregateError, 'name', { value: 'AggregateError', configurable: true });
  Object.defineProperty((window as any).AggregateError, '__polyfilled', { value: true });
}
