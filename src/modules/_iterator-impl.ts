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
 * - [incomplete] Iterator.prototype[@@toStringTag] and the constructor's
 *   subclass-brand checks are not modelled.
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

// %IteratorPrototype% has no global to reach it through on this floor. The only
// ES5 route is to walk up from a real array iterator.
const getIteratorPrototype = (): any => {
  if (!iteratorSymbol) return undefined;
  try {
    const arrayIterator = ([] as any)[iteratorSymbol]();
    const proto = Object.getPrototypeOf(Object.getPrototypeOf(arrayIterator));
    if (proto && proto !== Object.prototype) {
      return proto;
    }
  } catch {
    /* no usable array iterator -- synthesize below */
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
    if (first.done) {
      throw new TypeError("Reduce of empty iterator with no initial value");
    }
    accumulator = first.value;
    index = 1;
  } else {
    accumulator = initial;
  }
  for (;;) {
    // inlined: callNext(nextMethod, underlying)
    if (typeof nextMethod !== "function") throw new TypeError("iterator.next is not a function");
    const step = nextMethod.call(underlying);
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
          const source = sources[cursor];
          // release it as soon as it is opened -- a consumed source must not
          // stay reachable for the life of the concat
          sources[cursor++] = null;
          current =
            iteratorSymbol && typeof source[iteratorSymbol] === "function"
              ? source[iteratorSymbol]()
              : source;
          // inlined: getNextMethod(current)
          currentNext = current.next;
        }
        // inlined: callNext(currentNext, current)
        if (typeof currentNext !== "function") throw new TypeError("iterator.next is not a function");
        const step = currentNext.call(current);
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
      sources.length = 0;
      cursor = 0;
      // inlined: DONE()
      return { value: undefined, done: true };
    },
  };
  return makeHelper(driver, "concat", null, 0);
};

/** Spec: https://tc39.es/ecma262/#sec-iterator.from */
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
  ];

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
    // Already connected -- a native chain on a modern engine, or a prototype an
    // earlier source in this list already spliced.
    if (inheritsFrom(proto, IteratorPrototype)) {
      continue;
    }
    setProtoOf(proto, IteratorPrototype);
  }
};

const installIteratorPolyfill = (): void => {
  if (!isSupported() && IteratorPrototype) {
    const Iterator = function (this: any) {
      if (this === undefined || this === null) {
        throw new TypeError("Constructor Iterator requires 'new'");
      }
    } as any;
    Iterator.prototype = IteratorPrototype;
    try {
      // Spec: %IteratorPrototype%.constructor is an accessor
      // (SetterThatIgnoresPrototypeProperties): assignment shadows onto subclasses,
      // but throws when called against IteratorPrototype itself.
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
      try { Object.defineProperty(ctorDesc.get, "name", { value: "get constructor", configurable: true }); } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
      try { Object.defineProperty(ctorDesc.set, "name", { value: "set constructor", configurable: true }); } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
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
        try {
          Object.defineProperty(methods[i][1], "name", {
            value: name,
            configurable: true,
          });
        } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
        if (name === "reduce") {
          // Iterator.prototype.reduce.length is 1 per spec.
          try {
            Object.defineProperty(methods[i][1], "length", {
              value: 1,
              configurable: true,
            });
          } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
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
export const install = (): void => {
  installIteratorPolyfill();
  installIteratorExtensionsOnNative();
};