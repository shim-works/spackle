// Behavioural: false means a wholesale swap to spackle's Promise. A native that
// only lacks finally/allSettled/any must pass; those islands patch it per method.
// The checks an old native fails (core-js's promise-constructor-detection):
//   1. PromiseRejectionEvent (Chrome 49+ / Safari 11+). Without it unhandled
//      rejections are silent; this Promise dispatches the events itself.
//   2. V8 6.6 (Chrome 66) resolves custom thenables wrongly.
//   3. @@species: `p.then()` must construct through the species constructor.
import { define } from '../define.js';

export const isSupported = (): boolean => {
  try {
    if (
      typeof Promise !== 'function' ||
      typeof Promise.prototype.then !== 'function' ||
      typeof Promise.prototype.catch !== 'function' ||
      typeof Promise.resolve !== 'function' ||
      typeof Promise.reject !== 'function'
    ) {
      return false;
    }

    // Already ours. Re-installing would swap a live constructor out from under
    // every promise already created against it.
    if ((Promise as any).__polyfilled === true) {
      return true;
    }

    const w: any = window;
    if (typeof w.PromiseRejectionEvent !== 'function') {
      return false;
    }

    // core-js forces V8 6.6 by version: it resolves custom thenables wrongly
    // (crbug 830565), and nothing synchronous can detect it.
    if (/Chrome\/66\./.test((w.navigator && w.navigator.userAgent) || '')) {
      return false;
    }

    // core-js skips the @@species probe on V8 51+ with a genuinely native
    // Promise: writing `constructor` on a real promise invalidates V8's species
    // protector and slows every native promise op on the page (core-js #679).
    const chrome = /Chrome\/(\d+)/.exec((w.navigator && w.navigator.userAgent) || '');
    if (chrome && +chrome[1] >= 51 && /native code/.test(Function.prototype.toString.call(Promise))) {
      return true;
    }

    // No @@species at all (Chrome 41 predates it) means the engine cannot
    // honour it, so the check is unrunnable rather than passing by default.
    const species = typeof Symbol !== 'undefined' ? (Symbol as any).species : undefined;
    if (!species) {
      return false;
    }

    const Fake: any = function (executor: any): void {
      executor(function (): void { /* resolve */ }, function (): void { /* reject */ });
    };
    const probe: any = new Promise(function (resolve: any): void {
      resolve(1);
    });
    probe.constructor = {};
    probe.constructor[species] = Fake;
    return probe.then(function (): void { /* species probe */ }) instanceof Fake;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-promise-objects
 * Port of core-js's es.promise.constructor (MIT), reshaped for allocation:
 *
 * - One state record per promise in one hidden slot (core-js: internal state).
 * - Reactions held inline: none, one, then an array (core-js: a Queue each).
 * - A `then` on our own Promise settles its child through the child's state:
 *   no capability, no resolving closures (core-js: OwnPromiseCapability, two
 *   bound functions per `then`). Closures exist only where code can see them:
 *   the executor's resolve/reject, a thenable's, and a foreign constructor's.
 * - Jobs in one flat ring, one shared runner per host microtask (core-js: a
 *   closure per microtask). Through window.queueMicrotask -- spackle's, installed
 *   first wherever this Promise is -- so promise jobs and queueMicrotask
 *   callbacks share one FIFO queue, as core-js's shared microtask does.
 * - All reactions of one settlement run in one job (core-js's notify), which
 *   orders exactly as one job per reaction would.
 * - A handler that returns a thenable is adopted through the spec's
 *   NewPromiseResolveThenableJob (core-js calls its then at once): one job
 *   later, the tick count of a native promise.
 *
 * Known limitations:
 * - [incomplete] Resolving and element functions are ordinary functions: they
 *   have a prototype and can be `new`ed (core-js's too). Otherwise needs arrow
 *   syntax, and `new Function` would break under CSP.
 */

const hasOwn = Object.prototype.hasOwnProperty;
// IsConstructor, best ES5 approximation: ordinary and built-in constructors carry
// an own prototype; bound functions are constructors without one.
const isConstructor = (C: any): boolean =>
  typeof C === 'function' && (hasOwn.call(C, 'prototype') || /^bound /.test(C.name || ''));
const isObject = (value: any): boolean =>
  value !== null && (typeof value === 'object' || typeof value === 'function');

const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;
// state.rejection: core-js's false / HANDLED / UNHANDLED
const HANDLED = 1;
const UNHANDLED = 2;

/*
 * Where symbols are native (Chrome 38+, Safari 9+) the state goes under a symbol
 * key by plain assignment: already hidden from for-in, Object.keys and
 * JSON.stringify, and no Object.defineProperty per promise (a slow builtin on old
 * V8). Under the Symbol shim (Safari 7.1-8) a non-enumerable string slot instead,
 * through one reused descriptor.
 */
let STATE: any = '__promiseState';
let STATE_IS_SYMBOL = false;
try {
  const key = typeof Symbol === 'function' ? (Symbol as any)('promiseState') : undefined;
  if (typeof key === 'symbol') {
    STATE = key;
    STATE_IS_SYMBOL = true;
  }
} catch (e) {
  /* no usable Symbol: the string slot */
}
const SLOT: PropertyDescriptor = { value: undefined, writable: false, enumerable: false, configurable: false };

const w0: any = typeof window !== 'undefined' ? window : {};
const ArrayProto = Array.prototype;
// CreateDataProperty where Array.prototype holds something at that index
const LIST: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };

/* ---------------------------------------------------------------- jobs */

/*
 * The job ring, flat: [kind, a, b, c] per job, so queueing allocates nothing
 * past the array's growth. Every job is one host microtask running runNextJob,
 * which takes the next four slots: FIFO with everything else in that queue.
 */
const NOTIFY = 0; // (state, isReject): run every reaction of a settled promise
const REACTION = 1; // (reaction, state): a then() on an already settled promise
const THENABLE = 2; // (state, thenable, then): NewPromiseResolveThenableJob
const jobs: any[] = [];
let jobHead = 0;
let hostQueueMicrotask: any = null;

const enqueueJob = (kind: number, a: any, b: any, c: any): void => {
  jobs.push(kind, a, b, c);
  if (hostQueueMicrotask !== null) hostQueueMicrotask.call(w0, runNextJob);
  // only before install(): it takes window.queueMicrotask, which installs first
  else w0.setTimeout(runNextJob, 0);
};

/* ----------------------------------------------- unhandled rejections */

/*
 * Report a rejection the way the platform does: isSupported() rejects natives
 * without PromiseRejectionEvent, so this must provide the events.
 * createEvent/initEvent because these engines lack the event constructors.
 * on<type> is called explicitly only where the engine doesn't wire it as an
 * event-handler attribute (else every rejection arrives twice); checked at
 * install time, before app code can assign it.
 */
let handlerAttributeIsWired = false;

const dispatchRejectionEvent = function (type: string, promise: any, reason: any): boolean {
  const w: any = window;
  let prevented = false;
  try {
    const doc = w.document;
    if (doc && typeof doc.createEvent === 'function' && typeof w.dispatchEvent === 'function') {
      const event: any = doc.createEvent('Event');
      event.initEvent(type, false, true);
      event.promise = promise;
      event.reason = reason;
      // dispatchEvent returns false when a listener cancelled the event.
      prevented = w.dispatchEvent(event) === false;
      const handler = w['on' + type];
      if (!handlerAttributeIsWired && typeof handler === 'function') {
        handler.call(w, event);
        prevented = prevented || event.defaultPrevented === true;
      }
    } else if (typeof w['on' + type] === 'function') {
      // No DOM to build an event with -- hand over a shaped object instead.
      w['on' + type]({ promise: promise, reason: reason });
    }
  } catch (e) {
    // Reporting a failure must never throw over the failure it is reporting.
  }
  return prevented;
};

export const reportUnhandledRejection = function (reason: any, promise?: any): void {
  const prevented = dispatchRejectionEvent('unhandledrejection', promise === undefined ? null : promise, reason);
  if (!prevented && typeof console !== 'undefined' && console.warn) {
    console.warn('Unhandled promise rejection:', reason);
  }
};

/*
 * core-js's onUnhandled / onHandleUnhandled. A rejected promise its reactions
 * didn't handle is checked after the current task (one timer per batch, not per
 * promise); still unhandled then, it is reported. A handler attached after the
 * report gets rejectionhandled.
 */
const pendingRejections: any[] = [];
let rejectionCheckScheduled = false;
const checkRejections = function (): void {
  rejectionCheckScheduled = false;
  const count = pendingRejections.length;
  for (let i = 0; i < count; i++) {
    const state = pendingRejections[i];
    pendingRejections[i] = undefined;
    // inlined: isUnhandled(state)
    if (state.rejection !== HANDLED && !state.parent) {
      reportUnhandledRejection(state.value, state.facade);
      // handled from inside a listener: no rejectionhandled later
      state.rejection = state.rejection !== HANDLED && !state.parent ? UNHANDLED : HANDLED;
    }
  }
  // rejections a listener caused wait for the next batch
  const rest = pendingRejections.length - count;
  for (let i = 0; i < rest; i++) pendingRejections[i] = pendingRejections[count + i];
  pendingRejections.length = rest;
  if (rest > 0) {
    rejectionCheckScheduled = true;
    w0.setTimeout(checkRejections, 0);
  }
};
const onUnhandled = (state: any): void => {
  pendingRejections.push(state);
  if (rejectionCheckScheduled) return;
  rejectionCheckScheduled = true;
  w0.setTimeout(checkRejections, 0);
};
const onHandleUnhandled = (state: any): void => {
  w0.setTimeout(function () {
    dispatchRejectionEvent('rejectionhandled', state.facade, state.value);
  }, 0);
};

/* ------------------------------------------------------------- settling */

const newState = (promise: any): any => {
  const state = {
    state: PENDING,
    value: undefined as any,
    reactions: null as any,
    notified: false,
    parent: false,
    rejection: 0,
    facade: promise,
  };
  if (STATE_IS_SYMBOL) {
    promise[STATE] = state;
  } else {
    SLOT.value = state;
    Object.defineProperty(promise, STATE, SLOT);
    SLOT.value = undefined; // never pin the last state
  }
  return state;
};

const notify = (state: any, isReject: boolean): void => {
  if (state.notified) return;
  state.notified = true;
  enqueueJob(NOTIFY, state, isReject, undefined);
};

const fulfillState = (state: any, value: any): void => {
  state.value = value;
  state.state = FULFILLED;
  notify(state, false);
};

const rejectState = (state: any, reason: any): void => {
  state.value = reason;
  state.state = REJECTED;
  notify(state, true);
};

// Get(resolution, "then"), whose abrupt completion rejects: the try lives here so
// its callers stay optimisable on old V8.
const THREW = {};
let thenError: any;
const getThen = (value: any): any => {
  try {
    return value.then;
  } catch (error) {
    thenError = error;
    return THREW;
  }
};

// The steps of a promise resolve function, after its alreadyResolved check.
const resolveState = (state: any, value: any): void => {
  if (value === state.facade) {
    rejectState(state, new TypeError("Promise can't be resolved itself"));
    return;
  }
  if (value === null || (typeof value !== 'object' && typeof value !== 'function')) {
    fulfillState(state, value);
    return;
  }
  const then = getThen(value);
  if (then === THREW) {
    const error = thenError;
    thenError = undefined;
    rejectState(state, error);
  } else if (typeof then === 'function') {
    enqueueJob(THENABLE, state, value, then);
  } else {
    fulfillState(state, value);
  }
};

// NewPromiseResolveThenableJob: a fresh resolve/reject pair for the thenable.
const callThen = (then: any, thenable: any, resolveFn: any, rejectFn: any): void => {
  try {
    then.call(thenable, resolveFn, rejectFn);
  } catch (error) {
    rejectFn(error);
  }
};
const resolveThenable = (state: any, thenable: any, then: any): void => {
  let done = false;
  // call arguments: no inferred names (see the constructor)
  callThen(
    then,
    thenable,
    function (value: any): void {
      if (done) return;
      done = true;
      resolveState(state, value);
    },
    function (reason: any): void {
      if (done) return;
      done = true;
      rejectState(state, reason);
    },
  );
};

// A reaction's handler call, with its try kept out of callReaction.
let handlerThrew = false;
const callHandler = (handler: any, value: any): any => {
  try {
    return handler(value);
  } catch (error) {
    handlerThrew = true;
    return error;
  }
};

/*
 * core-js's callReaction. `reaction.target` is the child's state for a then on
 * our own Promise; otherwise reaction.resolve / reaction.reject are a foreign
 * capability's.
 */
const callReaction = (reaction: any, state: any): void => {
  const ok = state.state === FULFILLED;
  const record = reaction.record;
  if (record !== null) {
    // inlined: combinatorElement(record, reaction.index, state) -- the all/race fast path
    const capability = record.capability;
    if (!ok) {
      if (state.rejection === UNHANDLED) onHandleUnhandled(state);
      state.rejection = HANDLED;
      capability.reject(state.value);
    } else if (record.race) {
      capability.resolve(state.value);
    } else {
      const values = record.values;
      const index = reaction.index;
      if (index in ArrayProto) {
        LIST.value = state.value;
        Object.defineProperty(values, index, LIST);
        LIST.value = undefined;
      } else {
        values[index] = state.value;
      }
      if (--record.remaining === 0) capability.resolve(values);
    }
    return;
  }
  const handler = ok ? reaction.ok : reaction.fail;
  let value = state.value;
  let threw = !ok;
  if (handler !== false) {
    if (!ok) {
      if (state.rejection === UNHANDLED) onHandleUnhandled(state);
      state.rejection = HANDLED;
    }
    handlerThrew = false;
    value = callHandler(handler, value);
    threw = handlerThrew;
    handlerThrew = false;
  }
  const target = reaction.target;
  if (target !== null) {
    // resolveState turns a handler returning its own then()'s promise into the TypeError
    if (threw) rejectState(target, value);
    else resolveState(target, value);
  } else if (threw) {
    reaction.reject(value);
  } else {
    reaction.resolve(value);
  }
};

const runReactions = (state: any, isReject: boolean): void => {
  const reactions = state.reactions;
  state.reactions = null;
  state.notified = false;
  if (reactions !== null) {
    if (reactions.length === undefined) callReaction(reactions, state);
    else for (let i = 0; i < reactions.length; i++) callReaction(reactions[i], state);
  }
  if (isReject && !state.rejection) onUnhandled(state);
};

const runNextJob = function (): void {
  const kind = jobs[jobHead];
  const a = jobs[jobHead + 1];
  const b = jobs[jobHead + 2];
  const c = jobs[jobHead + 3];
  jobs[jobHead] = jobs[jobHead + 1] = jobs[jobHead + 2] = jobs[jobHead + 3] = undefined;
  jobHead += 4;
  if (jobHead === jobs.length) {
    jobs.length = 0;
    jobHead = 0;
  } else if (jobHead > 4096) {
    // slide the unrun tail down so a long-lived queue doesn't grow forever
    const rest = jobs.length - jobHead;
    for (let i = 0; i < rest; i++) jobs[i] = jobs[jobHead + i];
    jobs.length = rest;
    jobHead = 0;
  }
  if (kind === NOTIFY) runReactions(a, b);
  else if (kind === REACTION) callReaction(a, b);
  else resolveThenable(a, b, c);
};

/* -------------------------------------------------------- the Promise */

// The executor call, with its try kept out of the constructor (old V8 won't
// optimise a function holding one).
const runExecutor = (executor: any, resolveFn: any, rejectFn: any): void => {
  try {
    executor(resolveFn, rejectFn);
  } catch (error) {
    rejectFn(error);
  }
};

export const PromisePolyfill: any = function Promise(this: any, executor: any) {
  if (!(this instanceof PromisePolyfill)) {
    throw new TypeError("Promise constructor cannot be invoked without 'new'");
  }
  if (typeof executor !== 'function') {
    throw new TypeError('Promise resolver ' + (isObject(executor) ? 'is not a function' : String(executor) + ' is not a function'));
  }
  const state = newState(this);
  let done = false;
  // As call arguments, so no engine infers them a name: built-in resolving functions have name ''.
  runExecutor(
    executor,
    function (value: any): void {
      if (done) return;
      done = true;
      resolveState(state, value);
    },
    function (reason: any): void {
      if (done) return;
      done = true;
      rejectState(state, reason);
    },
  );
};
const PromisePrototype: any = PromisePolyfill.prototype;

// core-js's Internal: our own promises without an executor, for then/resolve/reject.
const Internal: any = function Promise(): void {
  /* the caller attaches the state */
};
Internal.prototype = PromisePrototype;

/*
 * NewPromiseCapability(C), with GetCapabilitiesExecutor's checks. For our own
 * constructor the promise and its resolving functions are made directly.
 */
const newPromiseCapability = (C: any): any => {
  if (C === PromisePolyfill) {
    const promise = new Internal();
    const state = newState(promise);
    let done = false;
    const capability: any = { promise: promise, resolve: undefined, reject: undefined };
    // assigned, not literal properties: a literal would name them 'resolve' / 'reject'
    capability.resolve = function (value: any): void {
      if (done) return;
      done = true;
      resolveState(state, value);
    };
    capability.reject = function (reason: any): void {
      if (done) return;
      done = true;
      rejectState(state, reason);
    };
    return capability;
  }
  if (!isConstructor(C)) throw new TypeError('Promise capability: not a constructor');
  const capability: any = { promise: undefined, resolve: undefined, reject: undefined };
  const executor = function (resolveFn: any, rejectFn: any): void {
    if (capability.resolve !== undefined || capability.reject !== undefined) {
      throw new TypeError('Promise executor has already been invoked with non-undefined arguments');
    }
    capability.resolve = resolveFn;
    capability.reject = rejectFn;
  };
  capability.promise = new C(executor);
  if (typeof capability.resolve !== 'function') throw new TypeError('Promise resolve function is not callable');
  if (typeof capability.reject !== 'function') throw new TypeError('Promise reject function is not callable');
  return capability;
};

const promiseThen = function then(this: any, onFulfilled: any, onRejected: any): any {
  const promise = this;
  // inlined: the receiver's state -- our slot, owned by this very object
  const state = promise !== null && promise !== undefined ? promise[STATE] : undefined;
  if (state === undefined || state === null || state.facade !== promise) {
    throw new TypeError('Method Promise.prototype.then called on incompatible receiver ' + String(promise));
  }
  // inlined: speciesConstructor(promise, Promise)
  let C: any = promise.constructor;
  if (C === undefined) {
    C = PromisePolyfill;
  } else {
    if (!isObject(C)) throw new TypeError('Promise constructor is not an object');
    const speciesKey = typeof Symbol !== 'undefined' ? (Symbol as any).species : undefined;
    const S = speciesKey ? C[speciesKey] : undefined;
    if (S === undefined || S === null) C = PromisePolyfill;
    else if (isConstructor(S)) C = S;
    else throw new TypeError('Promise @@species is not a constructor');
  }
  // One reaction object per then, the same shape either way (callReaction stays monomorphic).
  const ok = typeof onFulfilled === 'function' ? onFulfilled : false;
  const fail = typeof onRejected === 'function' ? onRejected : false;
  let reaction: any;
  if (C === PromisePolyfill) {
    const child = new Internal();
    reaction = { ok: ok, fail: fail, target: newState(child), resolve: null, reject: null, promise: child, record: null, index: 0 };
  } else {
    const capability = newPromiseCapability(C);
    reaction = { ok: ok, fail: fail, target: null, resolve: capability.resolve, reject: capability.reject, promise: capability.promise, record: null, index: 0 };
  }
  state.parent = true;
  if (state.state === PENDING) {
    const reactions = state.reactions;
    if (reactions === null) state.reactions = reaction;
    else if (reactions.length === undefined) state.reactions = [reactions, reaction];
    else reactions.push(reaction);
  } else {
    enqueueJob(REACTION, reaction, state, undefined);
  }
  return reaction.promise;
};

// core-js's es.promise.catch: Invoke(this, "then", « undefined, onRejected »)
const promiseCatch = function (this: any, onRejected: any): any {
  return this.then(undefined, onRejected);
};

const staticResolve = function (this: any, value: any): any {
  const C = this;
  if (!isObject(C)) throw new TypeError('Promise.resolve called on non-object');
  // PromiseResolve: our own promise from this very constructor comes back as is
  if (isObject(value)) {
    const own = value[STATE];
    if (own !== undefined && own !== null && own.facade === value && value.constructor === C) return value;
  }
  if (C === PromisePolyfill) {
    const promise = new Internal();
    resolveState(newState(promise), value);
    return promise;
  }
  const capability = newPromiseCapability(C);
  capability.resolve(value);
  return capability.promise;
};

const staticReject = function (this: any, reason: any): any {
  const C = this;
  if (C === PromisePolyfill) {
    const promise = new Internal();
    rejectState(newState(promise), reason);
    return promise;
  }
  const capability = newPromiseCapability(C);
  capability.reject(reason);
  return capability.promise;
};

/*
 * Promise.all and Promise.race (core-js's, with perform/iterate inlined):
 * GetPromiseResolve before GetIterator, the iterator protocol (array-likes on
 * Symbol-less engines), close the iterator on our-side failures but never on its
 * own, and reject rather than throw.
 */
const closeIterator = (iterator: any): void => {
  try {
    const ret = iterator['return'];
    if (ret !== undefined && ret !== null) ret.call(iterator);
  } catch (e) {
    /* the original error wins */
  }
};

/*
 * A Promise.all resolve element function. Its shared state is one record per
 * all() call, so the walk below holds no closure over loop variables (swc would
 * otherwise wrap each iteration in a function of its own).
 */
const allElement = (record: any, index: number): any => {
  let alreadyCalled = false;
  return function (x: any): void {
    if (alreadyCalled) return;
    alreadyCalled = true;
    const values = record.values;
    if (index in ArrayProto) {
      LIST.value = x;
      Object.defineProperty(values, index, LIST);
      LIST.value = undefined;
    } else {
      values[index] = x;
    }
    if (--record.remaining === 0) record.capability.resolve(values);
  };
};

// `race` false is Promise.all, true is Promise.race.
const combinator = (C: any, iterable: any, race: boolean): any => {
  const capability = newPromiseCapability(C);
  let iterator: any = null;
  let iteratorOpen = false;
  try {
    const promiseResolveFn = C.resolve;
    if (typeof promiseResolveFn !== 'function') throw new TypeError('Promise resolve is not callable');
    // inlined: GetIterator(iterable) -- by index only where the engine has no Symbol
    if (iterable === null || iterable === undefined) throw new TypeError(String(iterable) + ' is not iterable');
    const iteratorKey = typeof Symbol !== 'undefined' ? (Symbol as any).iterator : undefined;
    const method = iteratorKey ? iterable[iteratorKey] : undefined;
    let next: any = null;
    let arrayLike: any = null;
    if (typeof method === 'function') {
      iterator = method.call(iterable);
      if (!isObject(iterator)) throw new TypeError('Result of the Symbol.iterator method is not an object');
      next = iterator.next;
    } else if (!iteratorKey && typeof iterable.length === 'number') {
      arrayLike = iterable;
    } else {
      throw new TypeError('object is not iterable');
    }
    const values: any[] = [];
    const record = { values: values, remaining: 1, capability: capability, race: race };
    /*
     * Fast path: our constructor, our untouched resolve, and an element that is
     * one of ours whose then (read once, as Invoke would) is our untouched then.
     * The element then gets a reaction straight on its state: the child promise
     * and element closure the spec path makes are unreachable from user code, so
     * skipping them changes nothing observable.
     */
    const fast = C === PromisePolyfill && promiseResolveFn === staticResolve;
    let index = 0;
    for (;;) {
      let value: any;
      if (arrayLike !== null) {
        if (index >= arrayLike.length) break;
        value = arrayLike[index];
      } else {
        // IteratorStep: its own failures leave the iterator unclosed
        iteratorOpen = false;
        const result = next.call(iterator);
        if (!isObject(result)) throw new TypeError('Iterator result ' + String(result) + ' is not an object');
        if (result.done) break;
        value = result.value;
        iteratorOpen = true;
      }
      const nextPromise = promiseResolveFn.call(C, value);
      if (!race) {
        if (index in ArrayProto) Object.defineProperty(values, index, LIST);
        else values[index] = undefined;
        record.remaining++;
      }
      const elementState = fast ? nextPromise[STATE] : undefined;
      const then = nextPromise.then;
      if (elementState !== undefined && elementState !== null && elementState.facade === nextPromise && then === promiseThen) {
        // inlined: the registration half of then(), with no child
        const reaction = { ok: false, fail: false, target: null, resolve: null, reject: null, promise: null, record: record, index: index };
        elementState.parent = true;
        if (elementState.state === PENDING) {
          const reactions = elementState.reactions;
          if (reactions === null) elementState.reactions = reaction;
          else if (reactions.length === undefined) elementState.reactions = [reactions, reaction];
          else reactions.push(reaction);
        } else {
          enqueueJob(REACTION, reaction, elementState, undefined);
        }
      } else if (race) {
        then.call(nextPromise, capability.resolve, capability.reject);
      } else {
        then.call(nextPromise, allElement(record, index), capability.reject);
      }
      index++;
    }
    iteratorOpen = false;
    if (!race && --record.remaining === 0) capability.resolve(values);
  } catch (error) {
    if (iteratorOpen) closeIterator(iterator);
    capability.reject(error);
  }
  return capability.promise;
};

const staticAll = function (this: any, iterable: any): any {
  return combinator(this, iterable, false);
};
const staticRace = function (this: any, iterable: any): any {
  return combinator(this, iterable, true);
};

// Members: non-enumerable, writable, configurable, named and stamped (define()).
define(PromisePrototype, 'then', promiseThen);
define(PromisePrototype, 'catch', promiseCatch);
define(PromisePolyfill, 'resolve', staticResolve);
define(PromisePolyfill, 'reject', staticReject);
define(PromisePolyfill, 'all', staticAll);
define(PromisePolyfill, 'race', staticRace);
// A built-in constructor's prototype property is non-writable.
Object.defineProperty(PromisePolyfill, 'prototype', { writable: false });

/*
 * core-js's native interop, for a native that failed isSupported(): promises
 * the engine itself hands out (fetch, any native async API) are `instanceof
 * Promise`, report it as their constructor, and -- where the native ignores
 * @@species -- their then returns one of ours.
 */
const adoptNative = (Native: any): void => {
  const NativePrototype = Native.prototype;
  if (!NativePrototype || NativePrototype === Object.prototype || NativePrototype === PromisePrototype) return;
  try {
    const nativeThen = NativePrototype.then;
    // core-js's NATIVE_PROMISE_SUBCLASSING: does the native's then build through @@species?
    let subclassing = false;
    const speciesKey = typeof Symbol !== 'undefined' ? (Symbol as any).species : undefined;
    if (speciesKey) {
      try {
        const Fake: any = function (executor: any): void {
          executor(function (): void { /* resolve */ }, function (): void { /* reject */ });
        };
        const probe: any = new Native(function (resolveFn: any): void {
          resolveFn(1);
        });
        probe.constructor = {};
        probe.constructor[speciesKey] = Fake;
        subclassing = nativeThen.call(probe, function (): void { /* probe */ }) instanceof Fake;
      } catch (e) {
        subclassing = false;
      }
    }
    if (!subclassing && typeof nativeThen === 'function') {
      define(NativePrototype, 'then', function then(this: any, onFulfilled: any, onRejected: any): any {
        const that = this;
        return new PromisePolyfill(function (resolveFn: any, rejectFn: any) {
          nativeThen.call(that, resolveFn, rejectFn);
        }).then(onFulfilled, onRejected);
      });
    }
    delete NativePrototype.constructor;
    if (typeof Object.setPrototypeOf === 'function') Object.setPrototypeOf(NativePrototype, PromisePrototype);
    else NativePrototype.__proto__ = PromisePrototype;
  } catch (e) {
    /* locked native prototype: keep it as it is */
  }
};

export const install = (): void => {
  const w: any = window;
  // Promise jobs and queueMicrotask callbacks share one FIFO queue (HTML; core-js
  // shares its internal microtask): spackle's queueMicrotask installs first
  // wherever this Promise does, and is looked up on window rather than imported.
  if (typeof w.queueMicrotask === 'function') hostQueueMicrotask = w.queueMicrotask;
  handlerAttributeIsWired = 'onunhandledrejection' in w;

  const species = typeof Symbol === 'function' ? (Symbol as any).species : undefined;
  if (species && !hasOwn.call(PromisePolyfill, species)) {
    // core-js's setSpecies: get [Symbol.species]() { return this; }
    Object.defineProperty(PromisePolyfill, species, { get: function (this: any) { return this; }, enumerable: false, configurable: true });
  }
  const toStringTag = typeof Symbol === 'function' ? (Symbol as any).toStringTag : undefined;
  if (toStringTag && !hasOwn.call(PromisePrototype, toStringTag)) {
    // core-js's setToStringTag(Promise, 'Promise')
    Object.defineProperty(PromisePrototype, toStringTag, { value: 'Promise', writable: false, enumerable: false, configurable: true });
  }

  const Native = w.Promise;
  // Only a native replaced for being unfit: a fit one (a forced install in a
  // test, say) keeps its prototype untouched.
  if (typeof Native === 'function' && Native !== PromisePolyfill && !isSupported()) adoptNative(Native);

  w.Promise = null;
  delete w.Promise;
  define(w, 'Promise', PromisePolyfill);
};
