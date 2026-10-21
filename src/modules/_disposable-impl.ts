// ids: es.async-disposable-stack.constructor, es.async-iterator.async-dispose,
//   es.disposable-stack.constructor, es.suppressed-error.constructor
/**
 * Spec: https://tc39.es/proposal-explicit-resource-management/
 *
 * The four explicit-resource-management ids install together. dispose() clears
 * the list before running any disposer, so a throwing disposer can't pin the rest.
 *
 * Known limitations:
 * - [unfixable] `using` / `await using` are syntax: this supplies the objects they
 *   desugar to, so ES5 output calls `.dispose()` explicitly.
 * - [incomplete] `es.async-iterator.async-dispose` needs async generators to reach
 *   %AsyncIteratorPrototype%; without them it no-ops.
 */

// Check-then-create: this island can be imported alone, and Safari's native
// Symbol predates @@dispose.
import { define } from '../define.js';

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

// Non-enumerable, like native members (test262's prop-desc tests check this).
const def = (target: any, key: any, value: any): void => {
  // Give the function the name the spec expects, not the internal binding it
  // was declared with. Skipped for 'constructor' (that value is the ctor, whose
  // own name must stay) and for symbol keys.
  if (typeof value === 'function' && typeof key === 'string' && key !== 'constructor') {
    try { Object.defineProperty(value, 'name', { value: key, configurable: true }); } catch (e) { /* Function#name non-configurable pre-ES6 */ }
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

/** Spec: https://tc39.es/proposal-explicit-resource-management/#sec-suppressederror-constructor */
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

/** Spec: https://tc39.es/proposal-explicit-resource-management/#sec-disposablestack-constructor */
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
  // inlined: assertBrand(this, 'DisposableStack', 'disposed')
  if (this === null || typeof this !== 'object' || (this as any)._brand !== 'DisposableStack') {
    throw new TypeError('DisposableStack.prototype.disposed called on incompatible receiver');
  }
  return this._disposed;
};
// spec: an accessor's function name is 'get <prop>'
try {
  try {
    Object.defineProperty(disposablestackDisposedGetter, 'name', {
      value: 'get disposed',
      configurable: true,
    });
  } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
} catch (e) { /* Function#name non-configurable pre-ES6 */ }
Object.defineProperty(DisposableStack.prototype, 'disposed', {
  configurable: true,
  get: disposablestackDisposedGetter,
});

def(DisposableStack.prototype, 'use', function (this: any, value: any): any {
  // inlined: assertBrand(this, 'DisposableStack', 'use')
  if (this === null || typeof this !== 'object' || (this as any)._brand !== 'DisposableStack') {
    throw new TypeError('DisposableStack.prototype.use called on incompatible receiver');
  }
  // inlined: assertLive(this, 'use')
  if ((this as any)._disposed) throw new ReferenceError('DisposableStack already disposed: use');
  if (value === null || value === undefined) {
    return value;
  }
  const target = Object(value);
  // inlined: getMethod(target, ensureSymbol('dispose'))
  let method: any = undefined;
  const methodKey = ensureSymbol('dispose');
  if (methodKey !== undefined) {
    const found = target[methodKey];
    if (found !== null && found !== undefined) {
      if (typeof found !== 'function') throw new TypeError('dispose method is not callable');
      method = found;
    }
  }
  if (method === undefined) {
    throw new TypeError('value is not disposable');
  }
  this._stack.push(function () {
    method.call(value);
  });
  return value;
});

def(DisposableStack.prototype, 'adopt', function (this: any, value: any, onDispose: any): any {
  // inlined: assertBrand(this, 'DisposableStack', 'adopt')
  if (this === null || typeof this !== 'object' || (this as any)._brand !== 'DisposableStack') {
    throw new TypeError('DisposableStack.prototype.adopt called on incompatible receiver');
  }
  // inlined: assertLive(this, 'adopt')
  if ((this as any)._disposed) throw new ReferenceError('DisposableStack already disposed: adopt');
  if (typeof onDispose !== 'function') {
    throw new TypeError('onDispose is not a function');
  }
  this._stack.push(function () {
    onDispose(value);
  });
  return value;
});

def(DisposableStack.prototype, 'defer', function (this: any, onDispose: any): void {
  // inlined: assertBrand(this, 'DisposableStack', 'defer')
  if (this === null || typeof this !== 'object' || (this as any)._brand !== 'DisposableStack') {
    throw new TypeError('DisposableStack.prototype.defer called on incompatible receiver');
  }
  // inlined: assertLive(this, 'defer')
  if ((this as any)._disposed) throw new ReferenceError('DisposableStack already disposed: defer');
  if (typeof onDispose !== 'function') {
    throw new TypeError('onDispose is not a function');
  }
  this._stack.push(onDispose);
});

def(DisposableStack.prototype, 'move', function (this: any): any {
  // inlined: assertBrand(this, 'DisposableStack', 'move')
  if (this === null || typeof this !== 'object' || (this as any)._brand !== 'DisposableStack') {
    throw new TypeError('DisposableStack.prototype.move called on incompatible receiver');
  }
  // inlined: assertLive(this, 'move')
  if ((this as any)._disposed) throw new ReferenceError('DisposableStack already disposed: move');
  const moved = new (DisposableStack as any)();
  moved._stack = this._stack;
  this._stack = [];
  this._disposed = true;
  return moved;
});

def(DisposableStack.prototype, 'dispose', function (this: any): void {
  // inlined: assertBrand(this, 'DisposableStack', 'dispose')
  if (this === null || typeof this !== 'object' || (this as any)._brand !== 'DisposableStack') {
    throw new TypeError('DisposableStack.prototype.dispose called on incompatible receiver');
  }
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

/** Spec: https://tc39.es/proposal-explicit-resource-management/#sec-asyncdisposablestack-constructor */
export const AsyncDisposableStack = function (this: any) {
  if (!(this instanceof (AsyncDisposableStack as any))) {
    throw new TypeError("Constructor AsyncDisposableStack requires 'new'");
  }
  this._brand = 'AsyncDisposableStack';
  this._stack = [];
  this._disposed = false;
} as any;

const asyncdisposablestackDisposedGetter = function (this: any) {
  // inlined: assertBrand(this, 'AsyncDisposableStack', 'disposed')
  if (this === null || typeof this !== 'object' || (this as any)._brand !== 'AsyncDisposableStack') {
    throw new TypeError('AsyncDisposableStack.prototype.disposed called on incompatible receiver');
  }
  return this._disposed;
};
// spec: an accessor's function name is 'get <prop>'
try {
  try {
    Object.defineProperty(asyncdisposablestackDisposedGetter, 'name', {
      value: 'get disposed',
      configurable: true,
    });
  } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
} catch (e) { /* Function#name non-configurable pre-ES6 */ }
Object.defineProperty(AsyncDisposableStack.prototype, 'disposed', {
  configurable: true,
  get: asyncdisposablestackDisposedGetter,
});

def(AsyncDisposableStack.prototype, 'use', function (this: any, value: any): any {
  // inlined: assertBrand(this, 'AsyncDisposableStack', 'use')
  if (this === null || typeof this !== 'object' || (this as any)._brand !== 'AsyncDisposableStack') {
    throw new TypeError('AsyncDisposableStack.prototype.use called on incompatible receiver');
  }
  // inlined: assertLive(this, 'use')
  if ((this as any)._disposed) throw new ReferenceError('DisposableStack already disposed: use');
  if (value === null || value === undefined) {
    // recorded with no method: disposeAsync owes it one Await (explicit-await-for-null)
    this._stack.push(null);
    return value;
  }
  const boxed = Object(value);
  // async disposal wins; fall back to the sync method, as the spec does
  // inlined: getMethod(boxed, ensureSymbol('asyncDispose'))
  let method: any = undefined;
  const methodKey = ensureSymbol('asyncDispose');
  if (methodKey !== undefined) {
    const found = boxed[methodKey];
    if (found !== null && found !== undefined) {
      if (typeof found !== 'function') throw new TypeError('dispose method is not callable');
      method = found;
    }
  }
  if (method === undefined) {
    // inlined: getMethod(boxed, ensureSymbol('dispose'))
    let syncMethod: any = undefined;
    const syncMethodKey = ensureSymbol('dispose');
    if (syncMethodKey !== undefined) {
      const found = boxed[syncMethodKey];
      if (found !== null && found !== undefined) {
        if (typeof found !== 'function') throw new TypeError('dispose method is not callable');
        syncMethod = found;
      }
    }
    if (syncMethod !== undefined) {
      // the spec's closure around a sync @@dispose: call it, discard its result
      this._stack.push(function () {
        syncMethod.call(value);
        return undefined;
      });
      return value;
    }
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
  // inlined: assertBrand(this, 'AsyncDisposableStack', 'adopt')
  if (this === null || typeof this !== 'object' || (this as any)._brand !== 'AsyncDisposableStack') {
    throw new TypeError('AsyncDisposableStack.prototype.adopt called on incompatible receiver');
  }
  // inlined: assertLive(this, 'adopt')
  if ((this as any)._disposed) throw new ReferenceError('DisposableStack already disposed: adopt');
  if (typeof onDispose !== 'function') {
    throw new TypeError('onDispose is not a function');
  }
  this._stack.push(function () {
    return onDispose(value);
  });
  return value;
});

def(AsyncDisposableStack.prototype, 'defer', function (this: any, onDispose: any): void {
  // inlined: assertBrand(this, 'AsyncDisposableStack', 'defer')
  if (this === null || typeof this !== 'object' || (this as any)._brand !== 'AsyncDisposableStack') {
    throw new TypeError('AsyncDisposableStack.prototype.defer called on incompatible receiver');
  }
  // inlined: assertLive(this, 'defer')
  if ((this as any)._disposed) throw new ReferenceError('DisposableStack already disposed: defer');
  if (typeof onDispose !== 'function') {
    throw new TypeError('onDispose is not a function');
  }
  this._stack.push(onDispose);
});

def(AsyncDisposableStack.prototype, 'move', function (this: any): any {
  // inlined: assertBrand(this, 'AsyncDisposableStack', 'move')
  if (this === null || typeof this !== 'object' || (this as any)._brand !== 'AsyncDisposableStack') {
    throw new TypeError('AsyncDisposableStack.prototype.move called on incompatible receiver');
  }
  // inlined: assertLive(this, 'move')
  if ((this as any)._disposed) throw new ReferenceError('DisposableStack already disposed: move');
  const moved = new (AsyncDisposableStack as any)();
  moved._stack = this._stack;
  this._stack = [];
  this._disposed = true;
  return moved;
});

def(AsyncDisposableStack.prototype, 'disposeAsync', function (this: any): any {
  if (typeof Promise === 'undefined') {
    throw new TypeError('AsyncDisposableStack requires Promise');
  }
  // A bad receiver rejects the returned promise; it never throws synchronously.
  if (this === null || typeof this !== 'object' || (this as any)._brand !== 'AsyncDisposableStack') {
    return Promise.reject(new TypeError('AsyncDisposableStack.prototype.disposeAsync called on incompatible receiver'));
  }
  if (this._disposed) {
    return Promise.resolve(undefined);
  }
  this._disposed = true;
  const pending = this._stack;
  this._stack = [];
  /*
   * DisposeResources, last added first. Each disposer runs synchronously up to
   * its own Await, so an empty stack settles with no extra tick; a resource
   * recorded without a method (use(null)) only owes one Await at the end, and
   * only if nothing else awaited.
   */
  return new Promise(function (resolve: any, reject: any) {
    let index = pending.length - 1;
    let hasError = false;
    let error: any;
    let needsAwait = false;
    let hasAwaited = false;
    const finish = function (): void {
      if (hasError) reject(error);
      else resolve(undefined);
    };
    const record = function (thrown: any): void {
      error = suppress(error, hasError, thrown);
      hasError = true;
    };
    const loop = function (): void {
      while (index >= 0) {
        const disposer = pending[index];
        pending[index--] = null; // a disposed resource pins nothing
        if (disposer === null) {
          needsAwait = true;
          continue;
        }
        let result: any;
        try {
          result = disposer();
        } catch (thrown) {
          record(thrown);
          continue;
        }
        // Await(result): resume the loop once it settles
        hasAwaited = true;
        Promise.resolve(result).then(loop, function (thrown: any) {
          record(thrown);
          loop();
        });
        return;
      }
      if (needsAwait && !hasAwaited) {
        needsAwait = false;
        hasAwaited = true;
        Promise.resolve(undefined).then(finish);
        return;
      }
      finish();
    };
    loop();
  });
});

// SuppressedError's constructor inherits from Error. Inline setPrototypeOf
// fallback rather than relying on es.object.set-prototype-of, which installs
// later (Safari 7.1).
const setProto =
  Object.setPrototypeOf ||
  function (target: any, proto: any) {
    target.__proto__ = proto;
    return target;
  };

try {
  setProto(SuppressedError, Error);
} catch {
  /* frozen Error -- cosmetic only */
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

// These finish building our own classes, so they run regardless of the install
// gate (which only decides whether to touch the global).
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

export const install = (): void => {
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

  // Per-member from here down: an engine can ship DisposableStack without
  // SuppressedError, so install-polyfills.ts calls this ungated.
  const target: any = typeof window !== 'undefined' ? window : globalThis;
  if (!target.SuppressedError) define(target, 'SuppressedError', SuppressedError);
  if (!target.DisposableStack) define(target, 'DisposableStack', DisposableStack);
  if (!target.AsyncDisposableStack) define(target, 'AsyncDisposableStack', AsyncDisposableStack);

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
        define(asyncIteratorProto, asyncDisposeKey, asyncIteratorDispose, '[Symbol.asyncDispose]');
      }
    } catch {
      // no async generators here: nothing to attach to (documented above)
    }
  }
};
