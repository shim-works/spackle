/**
 * Spec: https://tc39.es/proposal-explicit-resource-management/
 *
 * Shared by the four explicit-resource-management module ids
 * (es.disposable-stack.constructor, es.async-disposable-stack.constructor,
 * es.suppressed-error.constructor, es.async-iterator.async-dispose) — they are
 * one feature with one error-aggregation rule, so they install together.
 *
 * GC: a stack holds its resources by design, but `dispose()` clears the list
 * BEFORE running any disposer, so a throwing disposer can't leave the remaining
 * resources pinned to a stack the caller has already finished with.
 *
 * Known limitations:
 * - [unfixable] `using` / `await using` are syntax. Installing these gives you
 *   the objects the syntax desugars to, not the syntax itself; ES5 output has
 *   to call `.dispose()` explicitly (or go through a transform).
 * - [incomplete] `es.async-iterator.async-dispose` needs %AsyncIteratorPrototype%,
 *   which is only reachable by constructing an async generator. Where the engine
 *   has no async generators there is nothing to attach to and it no-ops.
 */

// Well-known symbols are read/created lazily rather than captured at module
// evaluation: stable.ts loads ids alphabetically, so es.symbol.dispose runs
// AFTER this file. Whichever of the two gets there first creates the symbol and
// the other finds it — the same check-then-create rendezvous es.symbol.dispose
// itself performs.
const ensureSymbol = (name: string): any => {
  if (typeof Symbol === 'undefined') {
    return undefined;
  }
  const existing = (Symbol as any)[name];
  if (existing !== undefined) {
    return existing;
  }
  try {
    Object.defineProperty(Symbol, name, { value: (Symbol as any)('Symbol.' + name) });
  } catch {
    return undefined;
  }
  return (Symbol as any)[name];
};

// Every install here goes through this: a plain assignment creates an
// ENUMERABLE property, but native methods and Error.prototype's name/message
// are non-enumerable. test262's prop-desc tests catch the difference, and
// for..in over an instance would otherwise surface polyfilled members.
const def = (target: any, key: any, value: any): void => {
  // Give the function the name the spec expects, not the internal binding it
  // was declared with. Skipped for 'constructor' (that value is the ctor, whose
  // own name must stay) and for symbol keys.
  if (typeof value === 'function' && typeof key === 'string' && key !== 'constructor') {
    Object.defineProperty(value, 'name', { value: key, configurable: true });
  }
  Object.defineProperty(target, key, {
    value: value,
    writable: true,
    enumerable: false,
    configurable: true,
  });
};

export const isSupported = (): boolean => {
  try {
    return (
      typeof (globalThis as any).DisposableStack === 'function' &&
      typeof (globalThis as any).AsyncDisposableStack === 'function' &&
      typeof (globalThis as any).SuppressedError === 'function'
    );
  } catch {
    return false;
  }
};

export const isDisposableSupported = isSupported;

/**
 * Spec: https://tc39.es/proposal-explicit-resource-management/#sec-suppressederror-constructor
 */
export const SuppressedError = function (
  this: any,
  error?: any,
  suppressed?: any,
  message?: any
): any {
  const self =
    this instanceof (SuppressedError as any)
      ? this
      : Object.create((SuppressedError as any).prototype);
  if (message !== undefined) {
    // ToString on a symbol is a TypeError -- String() special-cases symbols and
    // would silently succeed, so reject before coercing
    if (typeof message === 'symbol') {
      throw new TypeError('Cannot convert a Symbol value to a string');
    }
    def(self, 'message', String(message));
  }
  def(self, 'error', error);
  def(self, 'suppressed', suppressed);
  if (typeof (Error as any).captureStackTrace === 'function') {
    (Error as any).captureStackTrace(self, SuppressedError);
  } else {
    const stack = new Error().stack;
    if (stack) self.stack = stack;
  }
  return self;
} as any;

SuppressedError.prototype = Object.create(Error.prototype);
def(SuppressedError.prototype, 'constructor', SuppressedError);
def(SuppressedError.prototype, 'name', 'SuppressedError');
def(SuppressedError.prototype, 'message', '');

// Combine a newly thrown error with one already being carried. Spec order: the
// NEW error becomes .error, the one it displaced becomes .suppressed.
const suppress = (existing: any, hasExisting: boolean, thrown: any): any =>
  hasExisting ? new (SuppressedError as any)(thrown, existing) : thrown;

const getMethod = (value: any, key: any): any => {
  if (key === undefined) return undefined;
  const method = value[key];
  if (method === null || method === undefined) return undefined;
  if (typeof method !== 'function') {
    throw new TypeError('dispose method is not callable');
  }
  return method;
};

/**
 * Spec: https://tc39.es/proposal-explicit-resource-management/#sec-disposablestack-constructor
 */
export const DisposableStack = function (this: any) {
  if (!(this instanceof (DisposableStack as any))) {
    throw new TypeError("Constructor DisposableStack requires 'new'");
  }
  // [[DisposableState]] stand-in. Distinct per class so a DisposableStack
  // method rejects an AsyncDisposableStack and vice versa -- `_stack` alone
  // cannot tell them apart.
  this._brand = 'DisposableStack';
  this._stack = [];
  this._disposed = false;
} as any;

const disposablestackDisposedGetter = function (this: any) {
  assertBrand(this, 'DisposableStack', 'disposed');
  return this._disposed;
};
// spec: an accessor's function name is 'get <prop>'
Object.defineProperty(disposablestackDisposedGetter, 'name', {
  value: 'get disposed',
  configurable: true,
});
Object.defineProperty(DisposableStack.prototype, 'disposed', {
  configurable: true,
  get: disposablestackDisposedGetter,
});

// Reject a non-object, an ordinary object, and the *other* stack class.
const assertBrand = (value: any, brand: string, method: string): void => {
  if (value === null || typeof value !== 'object' || value._brand !== brand) {
    throw new TypeError(brand + '.prototype.' + method + ' called on incompatible receiver');
  }
};

const assertLive = (stack: any, method: string): void => {
  if (stack._disposed) {
    throw new ReferenceError('DisposableStack already disposed: ' + method);
  }
};

def(DisposableStack.prototype, 'use', function (this: any, value: any): any {
  assertBrand(this, 'DisposableStack', 'use');
  assertLive(this, 'use');
  if (value === null || value === undefined) {
    return value;
  }
  const method = getMethod(Object(value), ensureSymbol('dispose'));
  if (method === undefined) {
    throw new TypeError('value is not disposable');
  }
  this._stack.push(function () {
    method.call(value);
  });
  return value;
});

def(DisposableStack.prototype, 'adopt', function (this: any, value: any, onDispose: any): any {
  assertBrand(this, 'DisposableStack', 'adopt');
  assertLive(this, 'adopt');
  if (typeof onDispose !== 'function') {
    throw new TypeError('onDispose is not a function');
  }
  this._stack.push(function () {
    onDispose(value);
  });
  return value;
});

def(DisposableStack.prototype, 'defer', function (this: any, onDispose: any): void {
  assertBrand(this, 'DisposableStack', 'defer');
  assertLive(this, 'defer');
  if (typeof onDispose !== 'function') {
    throw new TypeError('onDispose is not a function');
  }
  this._stack.push(onDispose);
});

def(DisposableStack.prototype, 'move', function (this: any): any {
  assertBrand(this, 'DisposableStack', 'move');
  assertLive(this, 'move');
  const moved = new (DisposableStack as any)();
  moved._stack = this._stack;
  this._stack = [];
  this._disposed = true;
  return moved;
});

def(DisposableStack.prototype, 'dispose', function (this: any): void {
  assertBrand(this, 'DisposableStack', 'dispose');
  if (this._disposed) return;
  this._disposed = true;
  // Detach before running anything: a disposer that throws must not leave the
  // rest of the list reachable from a stack the caller is done with.
  const pending = this._stack;
  this._stack = [];
  let hasError = false;
  let error: any;
  for (let i = pending.length - 1; i >= 0; i--) {
    try {
      pending[i]();
    } catch (thrown) {
      error = suppress(error, hasError, thrown);
      hasError = true;
    }
  }
  if (hasError) throw error;
});

/**
 * Spec: https://tc39.es/proposal-explicit-resource-management/#sec-asyncdisposablestack-constructor
 */
export const AsyncDisposableStack = function (this: any) {
  if (!(this instanceof (AsyncDisposableStack as any))) {
    throw new TypeError("Constructor AsyncDisposableStack requires 'new'");
  }
  this._brand = 'AsyncDisposableStack';
  this._stack = [];
  this._disposed = false;
} as any;

const asyncdisposablestackDisposedGetter = function (this: any) {
  assertBrand(this, 'AsyncDisposableStack', 'disposed');
  return this._disposed;
};
// spec: an accessor's function name is 'get <prop>'
Object.defineProperty(asyncdisposablestackDisposedGetter, 'name', {
  value: 'get disposed',
  configurable: true,
});
Object.defineProperty(AsyncDisposableStack.prototype, 'disposed', {
  configurable: true,
  get: asyncdisposablestackDisposedGetter,
});

def(AsyncDisposableStack.prototype, 'use', function (this: any, value: any): any {
  assertBrand(this, 'AsyncDisposableStack', 'use');
  assertLive(this, 'use');
  if (value === null || value === undefined) {
    return value;
  }
  const boxed = Object(value);
  // async disposal wins; fall back to the sync method, as the spec does
  let method = getMethod(boxed, ensureSymbol('asyncDispose'));
  if (method === undefined) {
    method = getMethod(boxed, ensureSymbol('dispose'));
  }
  if (method === undefined) {
    throw new TypeError('value is not async disposable');
  }
  this._stack.push(function () {
    return method.call(value);
  });
  return value;
});

// Deliberately duplicated rather than shared with DisposableStack: one shared
// function cannot brand-check for two different classes.
def(AsyncDisposableStack.prototype, 'adopt', function (this: any, value: any, onDispose: any): any {
  assertBrand(this, 'AsyncDisposableStack', 'adopt');
  assertLive(this, 'adopt');
  if (typeof onDispose !== 'function') {
    throw new TypeError('onDispose is not a function');
  }
  this._stack.push(function () {
    return onDispose(value);
  });
  return value;
});

def(AsyncDisposableStack.prototype, 'defer', function (this: any, onDispose: any): void {
  assertBrand(this, 'AsyncDisposableStack', 'defer');
  assertLive(this, 'defer');
  if (typeof onDispose !== 'function') {
    throw new TypeError('onDispose is not a function');
  }
  this._stack.push(onDispose);
});

def(AsyncDisposableStack.prototype, 'move', function (this: any): any {
  assertBrand(this, 'AsyncDisposableStack', 'move');
  assertLive(this, 'move');
  const moved = new (AsyncDisposableStack as any)();
  moved._stack = this._stack;
  this._stack = [];
  this._disposed = true;
  return moved;
});

def(AsyncDisposableStack.prototype, 'disposeAsync', function (this: any): any {
  assertBrand(this, 'AsyncDisposableStack', 'disposeAsync');
  if (typeof Promise === 'undefined') {
    throw new TypeError('AsyncDisposableStack requires Promise');
  }
  if (this._disposed) {
    return Promise.resolve(undefined);
  }
  this._disposed = true;
  const pending = this._stack;
  this._stack = [];
  let index = pending.length - 1;
  let hasError = false;
  let error: any;
  // Explicit promise chain rather than async/await: awaiting each disposer in
  // turn is required (they must not run concurrently), and this keeps the
  // module free of downlevel async helpers.
  const step = function (): any {
    if (index < 0) {
      if (hasError) throw error;
      return undefined;
    }
    const disposer = pending[index--];
    return Promise.resolve()
      .then(function () {
        return disposer();
      })
      .then(undefined, function (thrown: any) {
        error = suppress(error, hasError, thrown);
        hasError = true;
      })
      .then(step);
  };
  return Promise.resolve().then(step);
});

// SuppressedError is a subclass of Error, so its constructor inherits from
// Error itself, not Function.prototype.
if (typeof Object.setPrototypeOf === 'function') {
  try {
    Object.setPrototypeOf(SuppressedError, Error);
  } catch {
    /* frozen Error -- cosmetic only */
  }
}

// A constructor's .prototype is non-writable
for (let i = 0; i < 3; i++) {
  const ctor = [SuppressedError, DisposableStack, AsyncDisposableStack][i];
  try {
    Object.defineProperty(ctor, 'prototype', {
      writable: false,
      enumerable: false,
      configurable: false,
    });
  } catch {
    /* already locked */
  }
}

// These finish building OUR classes, so they run unconditionally -- NOT behind
// the install gate. A real browser found this: Chrome ships DisposableStack, so
// isSupported() short-circuits there and the exported classes were left without
// @@dispose or @@toStringTag, while in jsdom (no native) the gate opened and
// they looked fine. The install gate decides whether to touch the GLOBAL; it
// should never decide whether our own class is fully formed.
const disposeKey = ensureSymbol('dispose');
const asyncDisposeKey = ensureSymbol('asyncDispose');
const tagKey = typeof Symbol !== 'undefined' ? (Symbol as any).toStringTag : undefined;

// @@toStringTag is non-writable everywhere in the spec, unlike ordinary
// methods -- def() always sets writable:true, so it can't be reused here.
const defTag = (target: any, value: string): void => {
  Object.defineProperty(target, tagKey, {
    value: value,
    writable: false,
    enumerable: false,
    configurable: true,
  });
};

if (tagKey) {
  defTag(DisposableStack.prototype, 'DisposableStack');
  defTag(AsyncDisposableStack.prototype, 'AsyncDisposableStack');
  defTag(SuppressedError.prototype, 'SuppressedError');
}
if (disposeKey !== undefined) {
  def(DisposableStack.prototype, disposeKey, DisposableStack.prototype.dispose);
}
if (asyncDisposeKey !== undefined) {
  def(AsyncDisposableStack.prototype, asyncDisposeKey, AsyncDisposableStack.prototype.disposeAsync);
}

if (!isSupported()) {
  const target: any = typeof window !== 'undefined' ? window : globalThis;
  if (!target.SuppressedError) {
    Object.defineProperty(target, 'SuppressedError', { value: SuppressedError, writable: true, enumerable: false, configurable: true });
    Object.defineProperty(target.SuppressedError, 'name', { value: 'SuppressedError', configurable: true });
    Object.defineProperty(target.SuppressedError, '__polyfilled', { value: true });
  }
  if (!target.DisposableStack) {
    Object.defineProperty(target, 'DisposableStack', { value: DisposableStack, writable: true, enumerable: false, configurable: true });
    Object.defineProperty(target.DisposableStack, 'name', { value: 'DisposableStack', configurable: true });
    Object.defineProperty(target.DisposableStack, '__polyfilled', { value: true });
  }
  if (!target.AsyncDisposableStack) {
    Object.defineProperty(target, 'AsyncDisposableStack', { value: AsyncDisposableStack, writable: true, enumerable: false, configurable: true });
    Object.defineProperty(target.AsyncDisposableStack, 'name', { value: 'AsyncDisposableStack', configurable: true });
    Object.defineProperty(target.AsyncDisposableStack, '__polyfilled', { value: true });
  }

  // %AsyncIteratorPrototype%[@@asyncDispose]. There is no global to reach it
  // through, so build a throwaway async generator and walk up its prototype
  // chain. Wrapped in try/catch and behind the Function constructor because the
  // syntax itself doesn't parse on engines that lack it.
  if (asyncDisposeKey !== undefined) {
    try {
      const makeAsyncGen = Function('return (async function* () {})');
      const asyncGenFn = makeAsyncGen();
      // instance -> %AsyncGeneratorPrototype% -> %AsyncIteratorPrototype%
      const asyncIteratorProto = Object.getPrototypeOf(
        Object.getPrototypeOf(Object.getPrototypeOf(asyncGenFn()))
      );
      if (asyncIteratorProto && !asyncIteratorProto[asyncDisposeKey]) {
        const asyncIteratorDispose = function (this: any) {
          const self = this;
          return Promise.resolve().then(function () {
            const method = self.return;
            return typeof method === 'function' ? method.call(self) : undefined;
          });
        };
        Object.defineProperty(asyncIteratorProto, asyncDisposeKey, { value: asyncIteratorDispose, writable: true, enumerable: false, configurable: true });
        Object.defineProperty(asyncIteratorDispose as any, '__polyfilled', {
          value: true,
        });
      }
    } catch {
      // no async generators here -- nothing to attach to, which is the
      // documented [incomplete] above
    }
  }
}
