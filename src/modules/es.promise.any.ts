export const isSupported = (): boolean => {
  try {
    return typeof Promise !== 'undefined' && typeof Promise.any === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-promise.any */

const isObject = (value: any): boolean =>
  value !== null && (typeof value === 'object' || typeof value === 'function');
const hasOwn = Object.prototype.hasOwnProperty;
// IsConstructor, best ES5 approximation: ordinary and built-in constructors carry
// an own prototype; bound functions are constructors without one.
const isConstructor = (C: any): boolean =>
  typeof C === 'function' && (hasOwn.call(C, 'prototype') || /^bound /.test(C.name || ''));

/*
 * Built-in closures (resolve element functions, capability wrappers) are not
 * constructors and have no prototype. ES5 function expressions always are, so
 * where the engine parses arrows, wrap in one (length 1, name '').
 */
let arrowWrap: any = null;
try {
  arrowWrap = new Function('f', 'return (x) => f(x)');
} catch (e) {
  /* no arrow syntax (or CSP): plain functions, the ES5 best */
}
const builtinClosure = (fn: (x: any) => any): any =>
  arrowWrap ? arrowWrap(fn) : function (x: any) { return fn(x); };

// NewPromiseCapability(C), with GetCapabilitiesExecutor's checks.
const newPromiseCapability = (C: any): any => {
  if (!isConstructor(C)) throw new TypeError('Promise capability: not a constructor');
  const capability: any = { promise: undefined, resolve: undefined, reject: undefined };
  const executor = function (resolve: any, reject: any): void {
    if (capability.resolve !== undefined) throw new TypeError('Promise executor has already been invoked with non-undefined arguments');
    if (capability.reject !== undefined) throw new TypeError('Promise executor has already been invoked with non-undefined arguments');
    capability.resolve = resolve;
    capability.reject = reject;
  };
  capability.promise = new C(executor);
  if (typeof capability.resolve !== 'function') throw new TypeError('Promise resolve function is not callable');
  if (typeof capability.reject !== 'function') throw new TypeError('Promise reject function is not callable');
  return capability;
};

// IteratorClose after an abrupt step on our side; the original error wins.
const closeIterator = (iterator: any): void => {
  try {
    const ret = iterator['return'];
    if (ret !== undefined && ret !== null) ret.call(iterator);
  } catch (e) {
    /* the original error wins */
  }
};

// One description per combinator call: an iterator and its next, or (engines
// without Symbol, where nothing else is iterable) an array-like walked by index.
const getIteratorRecord = (iterable: any): any => {
  const key = typeof Symbol !== 'undefined' ? (Symbol as any).iterator : undefined;
  if (key) {
    if (iterable === null || iterable === undefined) throw new TypeError('object is not iterable');
    const method = iterable[key];
    if (typeof method !== 'function') throw new TypeError('object is not iterable');
    const iterator = method.call(iterable);
    if (!isObject(iterator)) throw new TypeError('Result of the Symbol.iterator method is not an object');
    return { iterator: iterator, next: iterator.next, arrayLike: null, index: 0, done: false };
  }
  if (iterable === null || iterable === undefined || typeof iterable.length !== 'number') {
    throw new TypeError('object is not iterable');
  }
  return { iterator: null, next: null, arrayLike: iterable, index: 0, done: false };
};

// IteratorStepValue: returns DONE at the end; protocol errors mark the record
// done (so it is not closed) and propagate.
const DONE = {};
const stepValue = (record: any): any => {
  if (record.arrayLike !== null) {
    if (record.index >= record.arrayLike.length) {
      record.done = true;
      return DONE;
    }
    return record.arrayLike[record.index++];
  }
  try {
    const result = record.next.call(record.iterator);
    if (!isObject(result)) throw new TypeError('Iterator result is not an object');
    if (result.done) {
      record.done = true;
      return DONE;
    }
    return result.value;
  } catch (error) {
    record.done = true;
    throw error;
  }
};

// CreateArrayFromList, once per call: a plain write unless Array.prototype holds
// something at that index (then defineProperty, so no setter is reached).
const ArrayProto = Array.prototype;
const LIST: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };
const arrayFromList = (list: any, length: number): any[] => {
  const out: any[] = [];
  for (let i = 0; i < length; i++) {
    if (i in ArrayProto) {
      LIST.value = list[i];
      Object.defineProperty(out, i, LIST);
      LIST.value = undefined;
    } else {
      out[i] = list[i];
    }
  }
  return out;
};

// The reject element function for one input: a factory over one per-call state
// record, so the walk below closes over nothing (see es.promise.all-settled).
const subscribeElement = (state: any, index: number, nextPromise: any): void => {
  let alreadyCalled = false;
  const onRejected = builtinClosure(function (x: any) {
    if (alreadyCalled) return undefined;
    alreadyCalled = true;
    state.errors[index] = x;
    if (--state.remaining === 0) return state.capability.reject(makeAggregateError(arrayFromList(state.errors, state.count)));
    return undefined;
  });
  // the capability's own resolve is the fulfilment reaction
  nextPromise.then(state.capability.resolve, onRejected);
};

// %AggregateError%: the live one (native, or spackle's, which installs with
// this); a bare Error with the same shape only where neither exists.
const makeAggregateError = (errors: any[]): any => {
  const Ctor = (window as any).AggregateError;
  if (typeof Ctor === 'function') return new Ctor(errors, 'All promises were rejected');
  const err: any = new Error('All promises were rejected');
  Object.defineProperty(err, 'name', { value: 'AggregateError', writable: true, enumerable: false, configurable: true });
  Object.defineProperty(err, 'errors', { value: errors, writable: true, enumerable: false, configurable: true });
  return err;
};

export const promiseAny = function any(this: any, iterable: any) {
  const C = this;
  const capability = newPromiseCapability(C);
  let record: any = null;
  try {
    const promiseResolve = C.resolve;
    if (typeof promiseResolve !== 'function') throw new TypeError('Promise resolve is not callable');
    record = getIteratorRecord(iterable);
    const state = { errors: Object.create(null), count: 0, remaining: 1, capability: capability };
    for (;;) {
      const value = stepValue(record);
      if (value === DONE) {
        if (--state.remaining === 0) capability.reject(makeAggregateError(arrayFromList(state.errors, state.count)));
        return capability.promise;
      }
      const index = state.count++;
      state.errors[index] = undefined;
      const nextPromise = promiseResolve.call(C, value);
      state.remaining++;
      subscribeElement(state, index, nextPromise);
    }
  } catch (error) {
    if (record !== null && !record.done && record.iterator !== null) closeIterator(record.iterator);
    capability.reject(error);
    return capability.promise;
  }
};
