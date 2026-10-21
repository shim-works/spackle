// ids: es.iterator.concat, es.iterator.constructor, es.iterator.dispose, es.iterator.drop,
//   es.iterator.every, es.iterator.filter, es.iterator.find, es.iterator.flat-map,
//   es.iterator.for-each, es.iterator.from, es.iterator.map, es.iterator.reduce,
//   es.iterator.some, es.iterator.take, es.iterator.to-array
/**
 * Spec: https://tc39.es/ecma262/#sec-iterator-helper-objects
 *
 * One atomic install for all 15 ids: every helper must share one
 * %IteratorHelperPrototype% (spec-observable). Helpers release their source and
 * callbacks as soon as they finish or are return()ed.
 *
 * Known limitations:
 * - [incomplete] The constructor's subclass-brand checks are not modelled.
 * - [incomplete] Engines without %IteratorPrototype% (Chrome 38/41) get a
 *   synthesized one, spliced into iterator chains at install time; iterators
 *   created before installPolyfills() keep their original chain.
 * - [incomplete] The splice is observable: prototype-chain walks see one extra link.
 */

const iteratorSymbol =
  typeof Symbol !== "undefined" ? (Symbol as any).iterator : undefined;

const returnSelf = function (this: any) {
  return this;
};

// %IteratorPrototype% has no global to reach it through on this floor. The ES5
// route is to walk up from a real built-in iterator: an array's first, then a
// string's, a Map's or a Set's (an engine can lack one and still have others).
// This runs at module evaluation, before any spackle global is installed.
const getIteratorPrototype = (): any => {
  if (!iteratorSymbol) return undefined;
  const g: any = typeof window !== 'undefined' ? window : globalThis;
  const samples: Array<() => any> = [
    function () { return ([] as any)[iteratorSymbol](); },
    function () { return ('' as any)[iteratorSymbol](); },
    function () { return new g.Map()[iteratorSymbol](); },
    function () { return new g.Set()[iteratorSymbol](); },
  ];
  for (let i = 0; i < samples.length; i++) {
    try {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(samples[i]()));
      if (proto && proto !== Object.prototype) {
        return proto;
      }
    } catch {
      /* that iterator is missing or unusable -- try the next */
    }
  }

  /*
   * Chrome 38/41: %ArrayIteratorPrototype% inherits straight from Object.prototype,
   * so the walk lands there. Build the missing link instead: installing on
   * Object.prototype would put map/forEach/@@dispose on every object.
   */
  const synthetic: any = {};
  Object.defineProperty(synthetic, iteratorSymbol, {
    value: returnSelf,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  return synthetic;
};

const IteratorPrototype = getIteratorPrototype();

export const isSupported = (): boolean => {
  try {
    // No Symbol.iterator: nothing to extend, so report supported.
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

// GetIteratorDirect: `next` is read exactly once and kept. A `next` accessor
// returning a fresh closure per read (test262 does this) would otherwise loop forever.

/**
 * take/drop limit: RangeError for NaN (incl. undefined), negatives and finite
 * values above MAX_SAFE_INTEGER. On failure the receiver is closed first.
 */
const MAX_SAFE = 9007199254740991;

const validateLimitOrClose = (
  receiver: any,
  limit: any,
  method: string,
): number => {
  let integerLimit: number;
  try {
    const numLimit = +limit; // +x, not Number(x): same coercion, no call
    if (numLimit !== numLimit) {
      throw new RangeError(
        "Iterator.prototype." + method + " limit must not be NaN",
      );
    }
    // inlined: toIntegerOrInfinity(numLimit) -- NaN was rejected just above
    integerLimit =
      numLimit === Infinity || numLimit === -Infinity
        ? numLimit
        : numLimit >= 0 ? Math.floor(numLimit) : Math.ceil(numLimit);
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

/**
 * IteratorClose. When already unwinding a throw (`swallowErrors`), errors from
 * return() are discarded so the original wins; otherwise they propagate.
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

// One prototype shared by every helper kind: that identity is spec-observable.

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
  // brand, so next()/return() can reject a foreign receiver
  helper._isIteratorHelper = true;
  // re-entrancy latch -- see IteratorHelperPrototype.next
  helper._running = false;
  helper._underlying = underlying;
  helper._next =
    // inlined: getNextMethod(underlying)
    nextMethod === undefined ? underlying.next : nextMethod;
  helper._innerNext = null;
  helper._kind = kind;
  helper._callback = callback;
  helper._limit = limit;
  helper._counter = 0;
  helper._inner = null; // flatMap's current sub-iterator
  return helper;
};

IteratorHelperPrototype.next = function (this: any): any {
  // inlined: assertHelper(this, 'next')
  if (this === null || typeof this !== 'object' || (this as any)._isIteratorHelper !== true) {
    throw new TypeError('Iterator Helper.prototype.next called on incompatible receiver');
  }
  // Re-entrancy: a callback reaching back into this helper must throw, not
  // interleave and corrupt _counter/_inner.
  if (this._running) {
    throw new TypeError('Iterator Helper is already running');
  }
  const underlying = this._underlying;
  // already finished -- released below, nothing left to read
  if (underlying === null) {
    // inlined: DONE()
    return { value: undefined, done: true };
  }
  const kind = this._kind;
  const callback = this._callback;

  this._running = true;
  // Spec: an error from the UNDERLYING iterator's own next()/done/value
  // (IteratorStepValue) propagates without closing it -- it is already broken.
  // Only errors from our side (callbacks, flatMap's inner iterator) close it.
  let closeOnError = true;
  try {
    for (;;) {
      if (kind === "take") {
        if (this._counter >= this._limit) {
          // inlined: releaseHelper(this)
          this._underlying = null;
          this._callback = null;
          this._inner = null;
          this._next = null;
          this._innerNext = null;
          closeIterator(underlying, false);
          // inlined: DONE()
          this._running = false;
          return { value: undefined, done: true };
        }
      }

      if (kind === "flatMap" && this._inner) {
        // inlined: callNext(this._innerNext, this._inner)
        if (typeof this._innerNext !== "function") throw new TypeError("iterator.next is not a function");
        const innerStep = this._innerNext.call(this._inner);
        if (!innerStep.done) {
          this._running = false;
          return { value: innerStep.value, done: false };
        }
        this._inner = null;
        this._innerNext = null;
      }

      closeOnError = false;
      // inlined: callNext(this._next, underlying)
      if (typeof this._next !== "function") throw new TypeError("iterator.next is not a function");
      const step = this._next.call(underlying);
      if (step === null || (typeof step !== "object" && typeof step !== "function")) {
        throw new TypeError("iterator result is not an object");
      }
      if (step.done) {
        // inlined: releaseHelper(this)
        this._underlying = null;
        this._callback = null;
        this._inner = null;
        this._next = null;
        this._innerNext = null;
        // inlined: DONE()
        this._running = false;
        return { value: undefined, done: true };
      }
      const value = step.value;
      closeOnError = true;
      const index = this._counter++;

      if (kind === "map") {
        // call first, release after: the latch must still be up while the
        // callback runs, or a re-entrant next() would slip through
        const mapped = callback(value, index);
        this._running = false;
        return { value: mapped, done: false };
      }
      if (kind === "filter") {
        if (callback(value, index)) {
          this._running = false;
          return { value: value, done: false };
        }
        continue;
      }
      if (kind === "take") {
        this._running = false;
        return { value: value, done: false };
      }
      if (kind === "drop") {
        if (index < this._limit) {
          continue;
        }
        this._running = false;
        return { value: value, done: false };
      }
      if (kind === "flatMap") {
        const mapped = callback(value, index);
        this._inner = getInnerIterator(mapped);
        // inlined: getNextMethod(this._inner)
        this._innerNext = this._inner.next;
        continue;
      }
      if (kind === "concat") {
        this._running = false;
        return { value: value, done: false };
      }
      // unreachable for a helper built by this module
      this._running = false;
      return { value: value, done: false };
    }
  } catch (error) {
    // The take-limit path above already released and closed; if ITS close threw
    // we must not call return() a second time. _underlying is the tell.
    const alreadyClosed = this._underlying === null;
    // already unwinding: release first so a throwing return() cannot pin the
    // chain, then close with errors discarded -- the original error wins
    // inlined: releaseHelper(this)
    this._underlying = null;
    this._callback = null;
    this._inner = null;
    this._next = null;
    this._innerNext = null;
    if (!alreadyClosed && closeOnError) {
      closeIterator(underlying, true);
    }
    this._running = false;
    throw error;
  }
};

IteratorHelperPrototype.return = function (this: any): any {
  // inlined: assertHelper(this, 'return')
  if (this === null || typeof this !== 'object' || (this as any)._isIteratorHelper !== true) {
    throw new TypeError('Iterator Helper.prototype.return called on incompatible receiver');
  }
  if (this._running) {
    throw new TypeError('Iterator Helper is already running');
  }
  const underlying = this._underlying;
  if (underlying !== null) {
    const inner = this._inner;
    // release first: a throwing return() must not leave the chain reachable
    // inlined: releaseHelper(this)
    this._underlying = null;
    this._callback = null;
    this._inner = null;
    this._next = null;
    this._innerNext = null;
    closeIterator(inner, false);
    closeIterator(underlying, false);
  }
  // inlined: DONE()
  return { value: undefined, done: true };
};

// next/return non-enumerable like every built-in method, with spec names, and
// the "Iterator Helper" tag.
const helperMethods = ["next", "return"];
for (let i = 0; i < helperMethods.length; i++) {
  const fn = IteratorHelperPrototype[helperMethods[i]];
  try {
    Object.defineProperty(fn, "name", { value: helperMethods[i], configurable: true });
  } catch (e) { /* Function#name non-configurable pre-ES6 */ }
  Object.defineProperty(IteratorHelperPrototype, helperMethods[i], { value: fn, writable: true, enumerable: false, configurable: true });
}
if (typeof Symbol !== "undefined" && (Symbol as any).toStringTag && !Object.prototype.hasOwnProperty.call(IteratorHelperPrototype, (Symbol as any).toStringTag)) {
  Object.defineProperty(IteratorHelperPrototype, (Symbol as any).toStringTag, { value: "Iterator Helper", writable: false, enumerable: false, configurable: true });
}

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

// GetIteratorFlattenable (reject-strings): every primitive is rejected; a
// defined but uncallable Symbol.iterator is a TypeError; only an absent one
// falls back to treating the value as the iterator.
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

// Iterator.prototype methods

export const iteratorMap = function (this: any, mapper: any) {
  // inlined: assertObjectReceiver(this, "map")
  if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.map called on a non-object");
  // inlined: assertCallableOrClose(this, mapper, "mapper")
  if (typeof mapper !== "function") {
    closeIterator(this, true);
    throw new TypeError("mapper is not a function");
  }
  // inlined: getIteratorDirect(this)
  const underlying = this;
  return makeHelper(underlying, "map", mapper, 0);
};

export const iteratorFilter = function (this: any, predicate: any) {
  // inlined: assertObjectReceiver(this, "filter")
  if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.filter called on a non-object");
  // inlined: assertCallableOrClose(this, predicate, "predicate")
  if (typeof predicate !== "function") {
    closeIterator(this, true);
    throw new TypeError("predicate is not a function");
  }
  // inlined: getIteratorDirect(this)
  const underlying = this;
  return makeHelper(underlying, "filter", predicate, 0);
};

export const iteratorTake = function (this: any, limit: any) {
  // inlined: assertObjectReceiver(this, "take")
  if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.take called on a non-object");
  const count = validateLimitOrClose(this, limit, "take");
  // inlined: getIteratorDirect(this)
  const underlying = this;
  return makeHelper(underlying, "take", null, count);
};

export const iteratorDrop = function (this: any, limit: any) {
  // inlined: assertObjectReceiver(this, "drop")
  if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.drop called on a non-object");
  const count = validateLimitOrClose(this, limit, "drop");
  // inlined: getIteratorDirect(this)
  const underlying = this;
  return makeHelper(underlying, "drop", null, count);
};

export const iteratorFlatMap = function (this: any, mapper: any) {
  // inlined: assertObjectReceiver(this, "flatMap")
  if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.flatMap called on a non-object");
  // inlined: assertCallableOrClose(this, mapper, "mapper")
  if (typeof mapper !== "function") {
    closeIterator(this, true);
    throw new TypeError("mapper is not a function");
  }
  // inlined: getIteratorDirect(this)
  const underlying = this;
  return makeHelper(underlying, "flatMap", mapper, 0);
};

export const iteratorToArray = function (this: any) {
  // inlined: assertObjectReceiver(this, "toArray")
  if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.toArray called on a non-object");
  // inlined: getIteratorDirect(this)
  const underlying = this;
  // inlined: getNextMethod(underlying)
  const nextMethod = underlying.next;
  const out: any[] = [];
  for (;;) {
    // inlined: callNext(nextMethod, underlying)
    if (typeof nextMethod !== "function") throw new TypeError("iterator.next is not a function");
    const step = nextMethod.call(underlying);
    if (step === null || (typeof step !== "object" && typeof step !== "function")) {
      throw new TypeError("iterator result is not an object");
    }
    if (step.done) return out;
    out.push(step.value);
  }
};

export const iteratorForEach = function (this: any, fn: any) {
  // inlined: assertObjectReceiver(this, "forEach")
  if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.forEach called on a non-object");
  // inlined: assertCallableOrClose(this, fn, "fn")
  if (typeof fn !== "function") {
    closeIterator(this, true);
    throw new TypeError("fn is not a function");
  }
  // inlined: getIteratorDirect(this)
  const underlying = this;
  // inlined: getNextMethod(underlying)
  const nextMethod = underlying.next;
  let index = 0;
  for (;;) {
    // inlined: callNext(nextMethod, underlying)
    if (typeof nextMethod !== "function") throw new TypeError("iterator.next is not a function");
    const step = nextMethod.call(underlying);
    if (step === null || (typeof step !== "object" && typeof step !== "function")) {
      throw new TypeError("iterator result is not an object");
    }
    if (step.done) return undefined;
    // IteratorStepValue: a throwing value getter is a protocol error -- no close
    const value = step.value;
    try {
      fn(value, index++);
    } catch (error) {
      closeIterator(underlying, true);
      throw error;
    }
  }
};

// Declared (reducer) only, for the spec length of 1; initialValue comes from arguments.
export const iteratorReduce = function (this: any, reducer: any) {
  // inlined: assertObjectReceiver(this, "reduce")
  if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.reduce called on a non-object");
  // inlined: assertCallableOrClose(this, reducer, "reducer")
  if (typeof reducer !== "function") {
    closeIterator(this, true);
    throw new TypeError("reducer is not a function");
  }
  // inlined: getIteratorDirect(this)
  const underlying = this;
  // inlined: getNextMethod(underlying)
  const nextMethod = underlying.next;
  let accumulator: any;
  let index = 0;
  if (arguments.length < 2) {
    // inlined: callNext(nextMethod, underlying)
    if (typeof nextMethod !== "function") throw new TypeError("iterator.next is not a function");
    const first = nextMethod.call(underlying);
    if (first === null || (typeof first !== "object" && typeof first !== "function")) {
      throw new TypeError("iterator result is not an object");
    }
    if (first.done) {
      throw new TypeError("Reduce of empty iterator with no initial value");
    }
    accumulator = first.value;
    index = 1;
  } else {
    accumulator = arguments[1];
  }
  for (;;) {
    // inlined: callNext(nextMethod, underlying)
    if (typeof nextMethod !== "function") throw new TypeError("iterator.next is not a function");
    const step = nextMethod.call(underlying);
    if (step === null || (typeof step !== "object" && typeof step !== "function")) {
      throw new TypeError("iterator result is not an object");
    }
    if (step.done) return accumulator;
    // IteratorStepValue: a throwing value getter is a protocol error -- no close
    const value = step.value;
    try {
      accumulator = reducer(accumulator, value, index++);
    } catch (error) {
      closeIterator(underlying, true);
      throw error;
    }
  }
};

export const iteratorSome = function (this: any, predicate: any) {
  // inlined: assertObjectReceiver(this, "some")
  if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.some called on a non-object");
  // inlined: assertCallableOrClose(this, predicate, "predicate")
  if (typeof predicate !== "function") {
    closeIterator(this, true);
    throw new TypeError("predicate is not a function");
  }
  // inlined: getIteratorDirect(this)
  const underlying = this;
  // inlined: getNextMethod(underlying)
  const nextMethod = underlying.next;
  let index = 0;
  for (;;) {
    // inlined: callNext(nextMethod, underlying)
    if (typeof nextMethod !== "function") throw new TypeError("iterator.next is not a function");
    const step = nextMethod.call(underlying);
    if (step === null || (typeof step !== "object" && typeof step !== "function")) {
      throw new TypeError("iterator result is not an object");
    }
    if (step.done) return false;
    // IteratorStepValue: a throwing value getter is a protocol error -- no close
    const value = step.value;
    try {
      if (predicate(value, index++)) {
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
  // inlined: assertObjectReceiver(this, "every")
  if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.every called on a non-object");
  // inlined: assertCallableOrClose(this, predicate, "predicate")
  if (typeof predicate !== "function") {
    closeIterator(this, true);
    throw new TypeError("predicate is not a function");
  }
  // inlined: getIteratorDirect(this)
  const underlying = this;
  // inlined: getNextMethod(underlying)
  const nextMethod = underlying.next;
  let index = 0;
  for (;;) {
    // inlined: callNext(nextMethod, underlying)
    if (typeof nextMethod !== "function") throw new TypeError("iterator.next is not a function");
    const step = nextMethod.call(underlying);
    if (step === null || (typeof step !== "object" && typeof step !== "function")) {
      throw new TypeError("iterator result is not an object");
    }
    if (step.done) return true;
    // IteratorStepValue: a throwing value getter is a protocol error -- no close
    const value = step.value;
    try {
      if (!predicate(value, index++)) {
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
  // inlined: assertObjectReceiver(this, "find")
  if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.find called on a non-object");
  // inlined: assertCallableOrClose(this, predicate, "predicate")
  if (typeof predicate !== "function") {
    closeIterator(this, true);
    throw new TypeError("predicate is not a function");
  }
  // inlined: getIteratorDirect(this)
  const underlying = this;
  // inlined: getNextMethod(underlying)
  const nextMethod = underlying.next;
  let index = 0;
  for (;;) {
    // inlined: callNext(nextMethod, underlying)
    if (typeof nextMethod !== "function") throw new TypeError("iterator.next is not a function");
    const step = nextMethod.call(underlying);
    if (step === null || (typeof step !== "object" && typeof step !== "function")) {
      throw new TypeError("iterator result is not an object");
    }
    if (step.done) return undefined;
    // IteratorStepValue: a throwing value getter is a protocol error -- no close
    const value = step.value;
    try {
      if (predicate(value, index++)) {
        closeIterator(underlying, false);
        return value;
      }
    } catch (error) {
      closeIterator(underlying, true);
      throw error;
    }
  }
};

/**
 * Spec: https://tc39.es/proposal-iterator-sequencing/
 * Iterator.concat(...items) — a static, unlike the rest. Every argument is
 * validated and its @@iterator read up front, in order; each is opened only
 * when the previous one is exhausted.
 */
export const iteratorConcat = function concat(): any {
  // [openMethod, iterable] pairs, flat
  const sources: any[] = [];
  for (let i = 0; i < arguments.length; i++) {
    const item = arguments[i];
    if (item === null || (typeof item !== "object" && typeof item !== "function")) {
      throw new TypeError("Iterator.concat arguments must be objects");
    }
    const method = iteratorSymbol ? item[iteratorSymbol] : undefined;
    if (typeof method !== "function") {
      throw new TypeError("Iterator.concat argument is not iterable");
    }
    sources.push(method, item);
  }
  let cursor = 0;
  // concat walks its sources with its own minimal iterator.
  let current: any = null;
  let currentNext: any = null;
  const driver = {
    next: function (): any {
      for (;;) {
        if (current === null) {
          if (cursor >= sources.length) {
            // inlined: DONE()
            return { value: undefined, done: true };
          }
          const method = sources[cursor];
          const iterable = sources[cursor + 1];
          // release them as soon as they are opened -- a consumed source must
          // not stay reachable for the life of the concat
          sources[cursor] = null;
          sources[cursor + 1] = null;
          cursor += 2;
          const opened = method.call(iterable);
          if (opened === null || (typeof opened !== "object" && typeof opened !== "function")) {
            throw new TypeError("Iterator.concat: @@iterator returned a non-object");
          }
          current = opened;
          // GetIteratorDirect reads next once
          currentNext = current.next;
        }
        // inlined: callNext(currentNext, current)
        if (typeof currentNext !== "function") throw new TypeError("iterator.next is not a function");
        const step = currentNext.call(current);
        if (step === null || (typeof step !== "object" && typeof step !== "function")) {
          throw new TypeError("iterator result is not an object");
        }
        if (!step.done) {
          // a fresh result object, never the inner one
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
      sources.length = 0;
      cursor = 0;
      // inlined: DONE()
      return { value: undefined, done: true };
    },
  };
  return makeHelper(driver, "concat", null, 0);
};

/*
 * %WrapForValidIteratorPrototype%: what Iterator.from returns for an iterator
 * that does not already inherit from Iterator.prototype. next() forwards to the
 * saved next method; return() forwards to the base's return, if any.
 */
const WrapForValidIteratorPrototype: any = IteratorPrototype
  ? Object.create(IteratorPrototype)
  : Object.create(Object.prototype);
const hasOwnSlot = Object.prototype.hasOwnProperty;
const requireWrapper = (self: any, method: string): void => {
  if (self === null || typeof self !== "object" || !hasOwnSlot.call(self, "_iterated")) {
    throw new TypeError("%WrapForValidIteratorPrototype%." + method + " called on incompatible receiver");
  }
};
const wrapperMethods: any = {
  next: function next(this: any): any {
    requireWrapper(this, "next");
    return this._nextMethod.call(this._iterated);
  },
  return: function (this: any): any {
    requireWrapper(this, "return");
    const iterator = this._iterated;
    const ret = iterator["return"];
    if (ret === undefined || ret === null) {
      return { value: undefined, done: true };
    }
    return ret.call(iterator);
  },
};
for (const name in wrapperMethods) {
  try {
    Object.defineProperty(wrapperMethods[name], "name", { value: name, configurable: true });
  } catch (e) { /* Function#name non-configurable pre-ES6 */ }
  Object.defineProperty(WrapForValidIteratorPrototype, name, { value: wrapperMethods[name], writable: true, enumerable: false, configurable: true });
}
const WRAP_SLOT: PropertyDescriptor = { value: undefined, writable: false, enumerable: false, configurable: false };

/** Spec: https://tc39.es/ecma262/#sec-iterator.from */
export const iteratorFrom = function from(O: any): any {
  // GetIteratorFlattenable(O, iterate-string-primitives)
  if (O === null || (typeof O !== "object" && typeof O !== "function")) {
    if (typeof O !== "string") {
      throw new TypeError("Iterator.from called on a non-object");
    }
  }
  const method = iteratorSymbol ? O[iteratorSymbol] : undefined;
  let iterator: any;
  if (method === undefined || method === null) {
    iterator = O;
  } else {
    if (typeof method !== "function") throw new TypeError("Iterator.from: @@iterator is not a function");
    iterator = method.call(O);
  }
  if (iterator === null || (typeof iterator !== "object" && typeof iterator !== "function")) {
    throw new TypeError("Iterator.from: the iterator is not an object");
  }
  // GetIteratorDirect: next read exactly once, before anything else
  const nextMethod = iterator.next;
  // OrdinaryHasInstance(%Iterator%, iterator): already an Iterator, hand it back
  if (IteratorPrototype && IteratorPrototype.isPrototypeOf(iterator)) {
    return iterator;
  }
  const wrapper = Object.create(WrapForValidIteratorPrototype);
  WRAP_SLOT.value = iterator;
  Object.defineProperty(wrapper, "_iterated", WRAP_SLOT);
  WRAP_SLOT.value = nextMethod;
  Object.defineProperty(wrapper, "_nextMethod", WRAP_SLOT);
  WRAP_SLOT.value = undefined;
  return wrapper;
};

/**
 * Spec: https://tc39.es/proposal-explicit-resource-management/
 * Iterator.prototype[@@dispose] — closes the iterator.
 */
export const iteratorDispose = function (this: any): void {
  closeIterator(this);
};

// Check-then-create: this island can be imported alone, and a native Symbol
// may predate @@dispose.
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
 * Second gate: %IteratorPrototype%[@@dispose], independent of the helpers.
 * Engines ship map/filter/take without @@dispose.
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
    try {
      try {
        Object.defineProperty(iteratorDispose as any, 'name', {
          value: '[Symbol.dispose]',
          configurable: true,
        });
      } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
    } catch (e) { /* Function#name non-configurable pre-ES6 */ }
    Object.defineProperty(iteratorDispose as any, '__polyfilled', { value: true });
  }
}

/*
 * The splice. Iterators must inherit from %IteratorPrototype%, where the helpers
 * live. Chrome 38/41 have none (synthesized above); Chrome 45-65 have one, but
 * `[].values()` is our shim, hanging off Object.prototype. Fix: sample an
 * iterator from each source and re-point its prototype's parent. One link moves;
 * no native is replaced.
 */

// Step-capped: a longer chain means a cycle (possible via `__proto__ =`), and an
// uncapped walk would hang. Overflow reports "already inherits", so no splice.
const MAX_CHAIN = 100;

const inheritsFrom = (value: any, ancestor: any): boolean => {
  let current = value;
  let steps = 0;
  while (current !== null && current !== undefined) {
    if (current === ancestor) {
      return true;
    }
    if (++steps > MAX_CHAIN) {
      return true;
    }
    try {
      current = Object.getPrototypeOf(current);
    } catch (e) {
      return false;
    }
  }
  return false;
};

// Does walking from here terminate at all?
const chainTerminates = (value: any): boolean => {
  let current = value;
  let steps = 0;
  while (current !== null && current !== undefined) {
    if (++steps > MAX_CHAIN) {
      return false;
    }
    try {
      current = Object.getPrototypeOf(current);
    } catch (e) {
      return false;
    }
  }
  return true;
};

/*
 * Re-point one link. The `__proto__ =` fallback (Safari 7.1) may accept a cycle
 * silently, so verify afterwards and restore on anything unexpected.
 */
const setProtoOf = (target: any, proto: any): void => {
  let previous: any;
  try {
    previous = Object.getPrototypeOf(target);
  } catch (e) {
    return;
  }

  try {
    if (typeof (Object as any).setPrototypeOf === 'function') {
      (Object as any).setPrototypeOf(target, proto);
    } else {
      /* eslint-disable-next-line no-proto */
      target.__proto__ = proto;
    }
  } catch (e) {
    /* locked-down prototype: that one family misses out, the rest still splice */
    return;
  }

  try {
    if (Object.getPrototypeOf(target) === proto && chainTerminates(target)) {
      return;
    }
    // Did not take, or took and left a cycle. Either way, undo it.
    if (typeof (Object as any).setPrototypeOf === 'function') {
      (Object as any).setPrototypeOf(target, previous);
    } else {
      /* eslint-disable-next-line no-proto */
      target.__proto__ = previous;
    }
  } catch (e) {
    /* nothing further we can do; the helpers are the lesser loss */
  }
};

// Prototype of what `make()` returns, or undefined if this engine can't make one.
const protoOfSample = (make: () => any): any => {
  try {
    const iterator = make();
    if (!iterator || typeof iterator.next !== 'function') {
      return undefined;
    }
    return Object.getPrototypeOf(iterator);
  } catch (e) {
    return undefined;
  }
};

const installIteratorExtensionsOnNative = (): void => {
  if (!IteratorPrototype || !iteratorSymbol) {
    return;
  }

  const g: any = typeof window !== 'undefined' ? window : globalThis;
  const sources: Array<() => any> = [
    function () { return ([] as any).keys(); },
    function () { return ([] as any).values(); },
    function () { return ([] as any).entries(); },
    function () { return ([] as any)[iteratorSymbol](); },
    function () { return ('' as any)[iteratorSymbol](); },
    function () { return new g.Map()[iteratorSymbol](); },
    function () { return new g.Set()[iteratorSymbol](); },
    function () { return new g.Uint8Array(1).values(); },
    function () { return ('a' as any).matchAll(/a/g); },
    function () { return g.document.createElement('div').childNodes.values(); },
    function () { return new g.URLSearchParams('a=1').entries(); },
  ];
  // core-js's iterator-define tags each native iterator prototype in the same
  // pass that re-parents it. One tag per source above, in the same order.
  const tags = ['Array Iterator', 'Array Iterator', 'Array Iterator', 'Array Iterator',
    'String Iterator', 'Map Iterator', 'Set Iterator', 'Array Iterator',
    'RegExp String Iterator', 'Array Iterator', 'URLSearchParams Iterator'];
  const tagKey = typeof Symbol !== 'undefined' ? (Symbol as any).toStringTag : undefined;

  for (let i = 0; i < sources.length; i++) {
    const proto = protoOfSample(sources[i]);
    if (!proto) {
      continue;
    }
    // NEVER re-parent Object.prototype: that is the global pollution this whole
    // arrangement exists to avoid. Nor anything %IteratorPrototype% itself
    // descends from, which would build a cycle.
    if (proto === Object.prototype || inheritsFrom(IteratorPrototype, proto)) {
      continue;
    }
    // Before the "already connected" skip: a native chain that is fine can still
    // lack its tag (Chrome 41).
    if (tagKey && !Object.prototype.hasOwnProperty.call(proto, tagKey)) {
      try {
        Object.defineProperty(proto, tagKey, { value: tags[i], writable: false, enumerable: false, configurable: true });
      } catch (e) { /* locked-down prototype: leave it untagged */ }
    }
    // Already connected -- a native chain on a modern engine, or a prototype an
    // earlier source in this list already spliced.
    if (inheritsFrom(proto, IteratorPrototype)) {
      continue;
    }
    setProtoOf(proto, IteratorPrototype);
  }
};

const installIteratorPolyfill = (): void => {
  // core-js's es.iterator.constructor: whenever %IteratorPrototype% has no own
  // @@toStringTag, add it as the spec's accessor
  // (SetterThatIgnoresPrototypeProperties), whether or not Iterator is native.
  const tagKey = typeof Symbol !== "undefined" ? (Symbol as any).toStringTag : undefined;
  if (IteratorPrototype && tagKey && !Object.prototype.hasOwnProperty.call(IteratorPrototype, tagKey)) {
    try {
      const getTag = function (): string {
        return "Iterator";
      };
      const setTag = function (this: any, v: any): void {
        if (this === null || (typeof this !== "object" && typeof this !== "function")) {
          throw new TypeError("Iterator.prototype[@@toStringTag] setter called on a non-object");
        }
        if (this === IteratorPrototype) {
          throw new TypeError("Cannot assign to read only property 'Symbol(Symbol.toStringTag)' of #<Iterator>");
        }
        if (Object.prototype.hasOwnProperty.call(this, tagKey)) {
          this[tagKey] = v;
        } else {
          Object.defineProperty(this, tagKey, { value: v, writable: true, enumerable: true, configurable: true });
        }
      };
      try { Object.defineProperty(getTag, "name", { value: "get [Symbol.toStringTag]", configurable: true }); } catch (e) { /* Function#name non-configurable pre-ES6 */ }
      try { Object.defineProperty(setTag, "name", { value: "set [Symbol.toStringTag]", configurable: true }); } catch (e) { /* Function#name non-configurable pre-ES6 */ }
      Object.defineProperty(IteratorPrototype, tagKey, { get: getTag, set: setTag, enumerable: false, configurable: true });
    } catch (e) {
      /* frozen %IteratorPrototype%: leave it untagged */
    }
  }
  if (!isSupported() && IteratorPrototype) {
    // Abstract: callable only as a subclass's super (NewTarget is not Iterator).
    const Iterator = function (this: any) {
      if (this === undefined || this === null || typeof this !== "object") {
        throw new TypeError("Constructor Iterator requires 'new'");
      }
      if (Object.getPrototypeOf(this) === IteratorPrototype) {
        throw new TypeError("Abstract class Iterator not directly constructable");
      }
    } as any;
    // Iterator.prototype: { writable: false, enumerable: false, configurable: false }
    Object.defineProperty(Iterator, "prototype", { value: IteratorPrototype, writable: false, enumerable: false, configurable: false });
    try {
      // Spec: %IteratorPrototype%.constructor is an accessor
      // (SetterThatIgnoresPrototypeProperties): assignment shadows onto subclasses,
      // but throws when called against IteratorPrototype itself.
      Object.defineProperty(IteratorPrototype, "constructor", {
        get: function (): any {
          return Iterator;
        },
        set: function (this: any, v: any): void {
          // Functions are objects too (spec: "not an Object", core-js anObject).
          if (this === null || (typeof this !== "object" && typeof this !== "function")) {
            throw new TypeError(
              "Iterator.prototype.constructor setter called on a non-object",
            );
          }
          if (this === IteratorPrototype) {
            throw new TypeError(
              "Cannot assign to read only property 'constructor' of #<Iterator>",
            );
          }
          // hasOwnProperty, not getOwnPropertyDescriptor: no descriptor allocated.
          if (!Object.prototype.hasOwnProperty.call(this, "constructor")) {
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
      try { Object.defineProperty(ctorDesc.get, "name", { value: "get constructor", configurable: true }); } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
      try { Object.defineProperty(ctorDesc.set, "name", { value: "set constructor", configurable: true }); } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
    } catch {
      /* frozen %IteratorPrototype% -- the methods below still install */
    }

    // statics: non-enumerable, writable, configurable, with spec names
    const statics: [string, Function][] = [["from", iteratorFrom], ["concat", iteratorConcat]];
    for (let i = 0; i < statics.length; i++) {
      try {
        Object.defineProperty(statics[i][1], "name", { value: statics[i][0], configurable: true });
      } catch (e) { /* Function#name non-configurable pre-ES6 */ }
      Object.defineProperty(Iterator, statics[i][0], { value: statics[i][1], writable: true, enumerable: false, configurable: true });
      Object.defineProperty(statics[i][1], "__polyfilled", { value: true });
    }

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
        try {
          Object.defineProperty(methods[i][1], "name", {
            value: name,
            configurable: true,
          });
        } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
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
      try {
        Object.defineProperty(target.Iterator, "name", {
          value: "Iterator",
          configurable: true,
        });
      } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
      Object.defineProperty(target.Iterator, "__polyfilled", { value: true });
    }
  }
};

/**
 * Installed last of the iterator family: it samples live iterators to find
 * their prototypes, so every iterator source must be installed first.
 */
export const installIterator = (): void => {
  installIteratorPolyfill();
  installIteratorExtensionsOnNative();
};