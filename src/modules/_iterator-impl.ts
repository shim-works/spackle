/**
 * Spec: https://tc39.es/ecma262/#sec-iterator-helper-objects
 *
 * Shared by all 15 es.iterator.* module ids. The install is ATOMIC and that is
 * load-bearing, not a convenience: every helper must return an object whose
 * prototype is the same %IteratorHelperPrototype%, so
 * `getPrototypeOf(it.map(f)) === getPrototypeOf(it.filter(f))` holds. Splitting
 * this into per-id installs would give each helper its own prototype -- the CJS
 * build inlines a shared impl into every delegate, so only an atomic gate keeps
 * exactly one copy live.
 *
 * GC: a helper holds the iterator beneath it and its callback while running --
 * that is inherent to a lazy chain. Both are released the instant the helper
 * finishes or is return()ed, so an exhausted `it.map(f).filter(g).take(3)`
 * retains nothing: not the source, not the callbacks, not the intermediates.
 * next() and return() live on the prototype; per-instance state is in fields.
 *
 * Known limitations:
 * - [incomplete] Iterator.prototype[@@toStringTag] and the constructor's
 *   subclass-brand checks are not modelled; these are ordinary objects.
 */

const iteratorSymbol =
  typeof Symbol !== "undefined" ? (Symbol as any).iterator : undefined;

// %IteratorPrototype% has no global to reach it through on this floor. The only
// ES5 route is to walk up from a real array iterator.
const getIteratorPrototype = (): any => {
  if (!iteratorSymbol) return undefined;
  try {
    const arrayIterator = ([] as any)[iteratorSymbol]();
    return Object.getPrototypeOf(Object.getPrototypeOf(arrayIterator));
  } catch {
    return undefined;
  }
};

const IteratorPrototype = getIteratorPrototype();

export const isSupported = (): boolean => {
  try {
    // No Symbol.iterator (or no reachable %IteratorPrototype%) means there is
    // nothing to extend -- report supported and no-op, same treatment
    // es.array.unscopables.flat uses.
    if (!iteratorSymbol || !IteratorPrototype) {
      return true;
    }
    return (
      typeof (globalThis as any).Iterator === "function" &&
      typeof (IteratorPrototype as any).map === "function" &&
      typeof (IteratorPrototype as any).filter === "function" &&
      typeof (IteratorPrototype as any).take === "function" &&
      typeof (IteratorPrototype as any).drop === "function" &&
      typeof (IteratorPrototype as any).flatMap === "function" &&
      typeof (IteratorPrototype as any).reduce === "function" &&
      typeof (IteratorPrototype as any).toArray === "function" &&
      typeof (IteratorPrototype as any).forEach === "function" &&
      typeof (IteratorPrototype as any).some === "function" &&
      typeof (IteratorPrototype as any).every === "function" &&
      typeof (IteratorPrototype as any).find === "function"
    );
  } catch {
    return false;
  }
};

export const isIteratorHelpersSupported = isSupported;

// Same rule as the limit: a bad callback closes the receiver before throwing.
const assertCallableOrClose = (receiver: any, fn: any, name: string): void => {
  if (typeof fn !== "function") {
    closeIterator(receiver, true);
    throw new TypeError(name + " is not a function");
  }
};

// GetIteratorDirect: the spec takes the object as-is (it does not call
// @@iterator on it) and reads `next` exactly ONCE, keeping it in the Iterator
// Record. Re-reading per step is not a micro-optimisation issue -- a `next`
// accessor that hands back a fresh closure each access (test262 uses exactly
// that) restarts its own counter every step and the loop never terminates.
const getIteratorDirect = (obj: any): any => obj;

// Spec order for every helper: check the receiver FIRST, then coerce/validate
// the arguments, and only then GetIteratorDirect (which reads `next`). test262
// pins this with observable side effects -- a valueOf() on the argument must
// not run when `this` is bad, and `get next` must fire only after ToNumber.
const assertObjectReceiver = (obj: any, method: string): void => {
  if (obj === null || typeof obj !== "object") {
    throw new TypeError(
      "Iterator.prototype." + method + " called on a non-object",
    );
  }
};

/**
 * take/drop limit validation, per test262's limit-rangeerror.js:
 *   valid   -> 0, -0.5, null, MAX_SAFE_INTEGER, Infinity
 *   Range   -> -1, undefined, NaN, and any FINITE value above MAX_SAFE_INTEGER
 *
 * On any failure -- including a throwing valueOf -- the spec closes the
 * receiver and then rethrows, and `next` is never read. Coercing NaN to 0 (what
 * toIntegerOrInfinity alone does) silently accepts `take()` with no argument.
 */
const MAX_SAFE = 9007199254740991;

const validateLimitOrClose = (
  receiver: any,
  limit: any,
  method: string,
): number => {
  let integerLimit: number;
  try {
    const numLimit = Number(limit);
    if (numLimit !== numLimit) {
      throw new RangeError(
        "Iterator.prototype." + method + " limit must not be NaN",
      );
    }
    integerLimit = toIntegerOrInfinity(numLimit);
    if (integerLimit < 0) {
      throw new RangeError(
        "Iterator.prototype." + method + " limit must not be negative",
      );
    }
    if (integerLimit !== Infinity && integerLimit > MAX_SAFE) {
      throw new RangeError(
        "Iterator.prototype." +
          method +
          " limit must be a safe integer or Infinity",
      );
    }
  } catch (error) {
    // already unwinding, so errors from return() are discarded
    closeIterator(receiver, true);
    throw error;
  }
  return integerLimit;
};

// Read once, alongside getIteratorDirect, and carry it from then on.
const getNextMethod = (iterator: any): any => iterator.next;

const callNext = (nextMethod: any, iterator: any): any => {
  if (typeof nextMethod !== "function") {
    throw new TypeError("iterator.next is not a function");
  }
  return nextMethod.call(iterator);
};

const toIntegerOrInfinity = (value: any): number => {
  const n = +value;
  if (n !== n) return 0;
  if (n === Infinity || n === -Infinity) return n;
  return n >= 0 ? Math.floor(n) : Math.ceil(n);
};

/**
 * IteratorClose. The `swallowErrors` flag is the spec's completion argument:
 * when we are ALREADY unwinding a throw, errors from return() are discarded
 * (the original error wins); otherwise they propagate to the caller. Swallowing
 * unconditionally -- which this used to do -- silently ate user errors that the
 * spec surfaces, and test262 has 20 tests for exactly that.
 */
const closeIterator = (iterator: any, swallowErrors?: boolean): void => {
  if (!iterator) return;
  let method: any;
  try {
    method = iterator.return;
  } catch (error) {
    if (swallowErrors) return;
    throw error;
  }
  if (method === null || method === undefined) return;
  if (typeof method !== "function") {
    if (swallowErrors) return;
    throw new TypeError("iterator.return is not a function");
  }
  let result: any;
  try {
    result = method.call(iterator);
  } catch (error) {
    if (swallowErrors) return;
    throw error;
  }
  // spec: a return() that hands back a non-Object is a TypeError
  if (!swallowErrors && (result === null || typeof result !== "object")) {
    throw new TypeError("iterator return method returned a non-object");
  }
};

const DONE = function () {
  return { value: undefined, done: true };
};

// ---------------------------------------------------------------------------
// The helper object. One prototype, shared by every helper kind -- that
// identity is spec-observable.
// ---------------------------------------------------------------------------

const IteratorHelperPrototype: any = IteratorPrototype
  ? Object.create(IteratorPrototype)
  : Object.create(Object.prototype);

const makeHelper = (
  underlying: any,
  kind: string,
  callback: any,
  limit: number,
  nextMethod?: any,
): any => {
  const helper = Object.create(IteratorHelperPrototype);
  // brand: distinguishes a real helper from any object that merely has the
  // right-looking fields, so next()/return() can reject a foreign receiver
  helper._isIteratorHelper = true;
  // re-entrancy latch -- see IteratorHelperPrototype.next
  helper._running = false;
  helper._underlying = underlying;
  helper._next =
    nextMethod === undefined ? getNextMethod(underlying) : nextMethod;
  helper._innerNext = null;
  helper._kind = kind;
  helper._callback = callback;
  helper._limit = limit;
  helper._counter = 0;
  helper._inner = null; // flatMap's current sub-iterator
  return helper;
};

/**
 * Release everything this helper holds. Called at completion, on return(), and
 * when a callback throws -- an exhausted chain must retain nothing.
 */
const releaseHelper = (helper: any): void => {
  helper._underlying = null;
  helper._callback = null;
  helper._inner = null;
  helper._next = null;
  helper._innerNext = null;
};

// A helper is a plain object, so a stray `next.call(something)` would otherwise
// read undefined fields and quietly return done rather than throwing.
const assertHelper = (value: any, method: string): void => {
  if (value === null || typeof value !== 'object' || value._isIteratorHelper !== true) {
    throw new TypeError('Iterator Helper.prototype.' + method + ' called on incompatible receiver');
  }
};

IteratorHelperPrototype.next = function (this: any): any {
  assertHelper(this, 'next');
  // Re-entrancy: a callback that reaches back into the same helper must throw,
  // not interleave. Without this the nested call advances _counter and _inner
  // underneath the outer one and both produce wrong values silently.
  if (this._running) {
    throw new TypeError('Iterator Helper is already running');
  }
  const underlying = this._underlying;
  // already finished -- released below, nothing left to read
  if (underlying === null) {
    return DONE();
  }
  const kind = this._kind;
  const callback = this._callback;

  this._running = true;
  try {
    for (;;) {
      if (kind === "take") {
        if (this._counter >= this._limit) {
          releaseHelper(this);
          closeIterator(underlying, false);
          return DONE();
        }
      }

      if (kind === "flatMap" && this._inner) {
        const innerStep = callNext(this._innerNext, this._inner);
        if (!innerStep.done) {
          return { value: innerStep.value, done: false };
        }
        this._inner = null;
        this._innerNext = null;
      }

      const step = callNext(this._next, underlying);
      if (step.done) {
        releaseHelper(this);
        return DONE();
      }
      const value = step.value;
      const index = this._counter++;

      if (kind === "map") {
        return { value: callback(value, index), done: false };
      }
      if (kind === "filter") {
        if (callback(value, index)) {
          return { value: value, done: false };
        }
        continue;
      }
      if (kind === "take") {
        return { value: value, done: false };
      }
      if (kind === "drop") {
        if (index < this._limit) {
          continue;
        }
        return { value: value, done: false };
      }
      if (kind === "flatMap") {
        const mapped = callback(value, index);
        this._inner = getInnerIterator(mapped);
        this._innerNext = getNextMethod(this._inner);
        continue;
      }
      if (kind === "concat") {
        return { value: value, done: false };
      }
      // unreachable for a helper built by this module
      return { value: value, done: false };
    }
  } catch (error) {
    // The take-limit path above already released and closed; if ITS close threw
    // we must not call return() a second time. _underlying is the tell.
    const alreadyClosed = this._underlying === null;
    // already unwinding: release first so a throwing return() cannot pin the
    // chain, then close with errors discarded -- the original error wins
    releaseHelper(this);
    if (!alreadyClosed) {
      closeIterator(underlying, true);
    }
    throw error;
  } finally {
    this._running = false;
  }
};

IteratorHelperPrototype.return = function (this: any): any {
  assertHelper(this, 'return');
  if (this._running) {
    throw new TypeError('Iterator Helper is already running');
  }
  const underlying = this._underlying;
  if (underlying !== null) {
    const inner = this._inner;
    // release first (retention rule 3) -- a throwing return() below must not
    // leave the chain reachable from a helper the caller has finished with
    releaseHelper(this);
    closeIterator(inner, false);
    closeIterator(underlying, false);
  }
  return DONE();
};

if (iteratorSymbol) {
  Object.defineProperty(IteratorHelperPrototype, iteratorSymbol, {
    value: function (this: any) {
      return this;
    },
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

// flatMap's per-value expansion (GetIteratorFlattenable, reject-strings mode):
// every primitive -- strings included -- is rejected, even one with a
// Symbol.iterator reachable through its wrapper's prototype (test262 pins this
// with a patched Number.prototype[Symbol.iterator]). A defined-but-uncallable
// Symbol.iterator is a hard TypeError (GetMethod), not a silent fallback to
// treating the value itself as the iterator -- only an ABSENT or nullish
// Symbol.iterator falls back that way.
const getInnerIterator = (value: any): any => {
  if (
    value === null ||
    (typeof value !== "object" && typeof value !== "function")
  ) {
    throw new TypeError("flatMap callback must return an object");
  }
  if (iteratorSymbol) {
    const method = value[iteratorSymbol];
    if (method !== null && method !== undefined) {
      if (typeof method !== "function") {
        throw new TypeError(
          "flatMap callback result's Symbol.iterator is not a function",
        );
      }
      return method.call(value);
    }
  }
  if (typeof value.next === "function") {
    return value;
  }
  throw new TypeError("flatMap callback must return an iterable or iterator");
};

// ---------------------------------------------------------------------------
// Iterator.prototype methods
// ---------------------------------------------------------------------------

export const iteratorMap = function (this: any, mapper: any) {
  assertObjectReceiver(this, "map");
  assertCallableOrClose(this, mapper, "mapper");
  const underlying = getIteratorDirect(this);
  return makeHelper(underlying, "map", mapper, 0);
};

export const iteratorFilter = function (this: any, predicate: any) {
  assertObjectReceiver(this, "filter");
  assertCallableOrClose(this, predicate, "predicate");
  const underlying = getIteratorDirect(this);
  return makeHelper(underlying, "filter", predicate, 0);
};

export const iteratorTake = function (this: any, limit: any) {
  assertObjectReceiver(this, "take");
  const count = validateLimitOrClose(this, limit, "take");
  const underlying = getIteratorDirect(this);
  return makeHelper(underlying, "take", null, count);
};

export const iteratorDrop = function (this: any, limit: any) {
  assertObjectReceiver(this, "drop");
  const count = validateLimitOrClose(this, limit, "drop");
  const underlying = getIteratorDirect(this);
  return makeHelper(underlying, "drop", null, count);
};

export const iteratorFlatMap = function (this: any, mapper: any) {
  assertObjectReceiver(this, "flatMap");
  assertCallableOrClose(this, mapper, "mapper");
  const underlying = getIteratorDirect(this);
  return makeHelper(underlying, "flatMap", mapper, 0);
};

export const iteratorToArray = function (this: any) {
  assertObjectReceiver(this, "toArray");
  const underlying = getIteratorDirect(this);
  const nextMethod = getNextMethod(underlying);
  const out: any[] = [];
  for (;;) {
    const step = callNext(nextMethod, underlying);
    if (step.done) return out;
    out.push(step.value);
  }
};

export const iteratorForEach = function (this: any, fn: any) {
  assertObjectReceiver(this, "forEach");
  assertCallableOrClose(this, fn, "fn");
  const underlying = getIteratorDirect(this);
  const nextMethod = getNextMethod(underlying);
  let index = 0;
  for (;;) {
    const step = callNext(nextMethod, underlying);
    if (step.done) return undefined;
    try {
      fn(step.value, index++);
    } catch (error) {
      closeIterator(underlying, true);
      throw error;
    }
  }
};

export const iteratorReduce = function (
  this: any,
  reducer: any,
  initial?: any,
) {
  assertObjectReceiver(this, "reduce");
  assertCallableOrClose(this, reducer, "reducer");
  const underlying = getIteratorDirect(this);
  const nextMethod = getNextMethod(underlying);
  let accumulator: any;
  let index = 0;
  if (arguments.length < 2) {
    const first = callNext(nextMethod, underlying);
    if (first.done) {
      throw new TypeError("Reduce of empty iterator with no initial value");
    }
    accumulator = first.value;
    index = 1;
  } else {
    accumulator = initial;
  }
  for (;;) {
    const step = callNext(nextMethod, underlying);
    if (step.done) return accumulator;
    try {
      accumulator = reducer(accumulator, step.value, index++);
    } catch (error) {
      closeIterator(underlying, true);
      throw error;
    }
  }
};

export const iteratorSome = function (this: any, predicate: any) {
  assertObjectReceiver(this, "some");
  assertCallableOrClose(this, predicate, "predicate");
  const underlying = getIteratorDirect(this);
  const nextMethod = getNextMethod(underlying);
  let index = 0;
  for (;;) {
    const step = callNext(nextMethod, underlying);
    if (step.done) return false;
    try {
      if (predicate(step.value, index++)) {
        // short-circuit on a normal completion -- errors from return() propagate
        closeIterator(underlying, false);
        return true;
      }
    } catch (error) {
      closeIterator(underlying, true);
      throw error;
    }
  }
};

export const iteratorEvery = function (this: any, predicate: any) {
  assertObjectReceiver(this, "every");
  assertCallableOrClose(this, predicate, "predicate");
  const underlying = getIteratorDirect(this);
  const nextMethod = getNextMethod(underlying);
  let index = 0;
  for (;;) {
    const step = callNext(nextMethod, underlying);
    if (step.done) return true;
    try {
      if (!predicate(step.value, index++)) {
        closeIterator(underlying, false);
        return false;
      }
    } catch (error) {
      closeIterator(underlying, true);
      throw error;
    }
  }
};

export const iteratorFind = function (this: any, predicate: any) {
  assertObjectReceiver(this, "find");
  assertCallableOrClose(this, predicate, "predicate");
  const underlying = getIteratorDirect(this);
  const nextMethod = getNextMethod(underlying);
  let index = 0;
  for (;;) {
    const step = callNext(nextMethod, underlying);
    if (step.done) return undefined;
    try {
      if (predicate(step.value, index++)) {
        closeIterator(underlying, false);
        return step.value;
      }
    } catch (error) {
      closeIterator(underlying, true);
      throw error;
    }
  }
};

/**
 * Spec: https://tc39.es/proposal-iterator-sequencing/
 * Iterator.concat(...iterables) — a static, unlike the rest.
 */
export const iteratorConcat = function (): any {
  const sources: any[] = [];
  for (let i = 0; i < arguments.length; i++) {
    const source = arguments[i];
    if (source === null || typeof source !== "object") {
      throw new TypeError("Iterator.concat arguments must be objects");
    }
    sources.push(source);
  }
  let cursor = 0;
  // A tiny driver that walks the sources in order; the helper machinery above
  // is per-single-source, so concat gets its own minimal iterator.
  let current: any = null;
  let currentNext: any = null;
  const driver = {
    next: function (): any {
      for (;;) {
        if (current === null) {
          if (cursor >= sources.length) {
            return DONE();
          }
          const source = sources[cursor++];
          current =
            iteratorSymbol && typeof source[iteratorSymbol] === "function"
              ? source[iteratorSymbol]()
              : source;
          currentNext = getNextMethod(current);
        }
        const step = callNext(currentNext, current);
        if (!step.done) {
          return { value: step.value, done: false };
        }
        // drop both -- keeping currentNext would retain a method from the
        // source we just exhausted
        current = null;
        currentNext = null;
      }
    },
    return: function (): any {
      closeIterator(current, false);
      current = null;
      currentNext = null;
      cursor = sources.length;
      return DONE();
    },
  };
  return makeHelper(driver, "concat", null, 0);
};

/**
 * Spec: https://tc39.es/ecma262/#sec-iterator.from
 */
export const iteratorFrom = function (source: any): any {
  if (typeof source === "string") {
    if (!iteratorSymbol) {
      throw new TypeError("Iterator.from requires Symbol.iterator");
    }
    return makeHelper((source as any)[iteratorSymbol](), "concat", null, 0);
  }
  if (source === null || typeof source !== "object") {
    throw new TypeError("Iterator.from called on a non-object");
  }
  const iterator =
    iteratorSymbol && typeof source[iteratorSymbol] === "function"
      ? source[iteratorSymbol]()
      : source;
  if (typeof iterator.next !== "function") {
    throw new TypeError("Iterator.from argument is not iterable");
  }
  // Already an Iterator instance? Hand it straight back, as the spec does.
  if (IteratorPrototype && IteratorPrototype.isPrototypeOf(iterator)) {
    return iterator;
  }
  return makeHelper(iterator, "concat", null, 0);
};

/**
 * Spec: https://tc39.es/proposal-explicit-resource-management/
 * Iterator.prototype[@@dispose] — closes the iterator.
 */
export const iteratorDispose = function (this: any): void {
  closeIterator(this);
};

// Well-known symbols are read/created lazily rather than captured at module
// evaluation: stable.ts loads ids alphabetically, so es.symbol.dispose and
// _disposable-impl.ts may run before or after this file depending on which
// es.iterator.* id is first. Whichever module gets here first creates the
// symbol and the rest find it — same check-then-create rendezvous
// _disposable-impl.ts performs, needed here too so this island stays
// self-contained rather than depending on load order.
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

/**
 * SECOND GATE — %IteratorPrototype%[@@dispose], independent of the helper suite.
 *
 * isSupported() above is the atomic helpers check. An engine can ship map /
 * filter / take and NOT @@dispose (every current engine does), which closes that
 * gate and would leave es.iterator.dispose registered but never installed. Same
 * two-gate shape as _typed-array-impl.ts. Do not fold this back in.
 */
if (IteratorPrototype) {
  const disposeKey = ensureSymbol('dispose');
  if (disposeKey && !(IteratorPrototype as any)[disposeKey]) {
    Object.defineProperty(IteratorPrototype as any, disposeKey, {
      value: iteratorDispose,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(iteratorDispose as any, 'name', {
      value: '[Symbol.dispose]',
      configurable: true,
    });
    Object.defineProperty(iteratorDispose as any, '__polyfilled', { value: true });
  }
}

if (!isSupported() && IteratorPrototype) {
  const Iterator = function (this: any) {
    if (this === undefined || this === null) {
      throw new TypeError("Constructor Iterator requires 'new'");
    }
  } as any;
  Iterator.prototype = IteratorPrototype;
  try {
    // Spec: %IteratorPrototype%.constructor is an ACCESSOR, not a plain data
    // property -- SetterThatIgnoresPrototypeProperties. A writable data
    // property would already let `obj.constructor = v` shadow onto obj for
    // any obj inheriting from IteratorPrototype (normal JS assignment
    // semantics), but it can't reproduce the one behavior that differs: the
    // setter throws when called directly against IteratorPrototype itself
    // (thisValue === home), emulating a non-writable property on the home
    // object without actually making it non-writable for subclass prototypes.
    Object.defineProperty(IteratorPrototype, "constructor", {
      get: function (): any {
        return Iterator;
      },
      set: function (this: any, v: any): void {
        if (this === null || typeof this !== "object") {
          throw new TypeError(
            "Iterator.prototype.constructor setter called on a non-object",
          );
        }
        if (this === IteratorPrototype) {
          throw new TypeError(
            "Cannot assign to read only property 'constructor' of #<Iterator>",
          );
        }
        const desc = Object.getOwnPropertyDescriptor(this, "constructor");
        if (desc === undefined) {
          Object.defineProperty(this, "constructor", {
            value: v,
            writable: true,
            enumerable: true,
            configurable: true,
          });
        } else {
          this.constructor = v;
        }
      },
      enumerable: false,
      configurable: true,
    });
    // Accessor functions get "get "/"set " prepended to the property name.
    const ctorDesc = Object.getOwnPropertyDescriptor(IteratorPrototype, "constructor")!;
    Object.defineProperty(ctorDesc.get, "name", { value: "get constructor", configurable: true });
    Object.defineProperty(ctorDesc.set, "name", { value: "set constructor", configurable: true });
  } catch {
    /* frozen %IteratorPrototype% -- the methods below still install */
  }

  Iterator.from = iteratorFrom;
  Iterator.concat = iteratorConcat;

  const methods: [string, Function][] = [
    ["map", iteratorMap],
    ["filter", iteratorFilter],
    ["take", iteratorTake],
    ["drop", iteratorDrop],
    ["flatMap", iteratorFlatMap],
    ["toArray", iteratorToArray],
    ["forEach", iteratorForEach],
    ["reduce", iteratorReduce],
    ["some", iteratorSome],
    ["every", iteratorEvery],
    ["find", iteratorFind],
  ];
  for (let i = 0; i < methods.length; i++) {
    const name = methods[i][0];
    if (!(IteratorPrototype as any)[name]) {
      Object.defineProperty(methods[i][1], "name", {
        value: name,
        configurable: true,
      });
      if (name === "reduce") {
        // reducer's optional trailing `initial` param still counts toward the
        // compiled function's arity; the spec's Iterator.prototype.reduce.length
        // is 1, since [[Call]] arity ignores that trailing optional argument.
        Object.defineProperty(methods[i][1], "length", {
          value: 1,
          configurable: true,
        });
      }
      Object.defineProperty(IteratorPrototype as any, name, {
        value: methods[i][1],
        writable: true,
        enumerable: false,
        configurable: true,
      });
      Object.defineProperty(
        (IteratorPrototype as any)[name] as any,
        "__polyfilled",
        {
          value: true,
        },
      );
    }
  }

  const target: any = typeof window !== "undefined" ? window : globalThis;
  if (!target.Iterator) {
    Object.defineProperty(target, "Iterator", {
      value: Iterator,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(target.Iterator, "name", {
      value: "Iterator",
      configurable: true,
    });
    Object.defineProperty(target.Iterator, "__polyfilled", { value: true });
  }
}
