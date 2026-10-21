// Behavioural: false means a wholesale swap to promise-polyfill. A native that
// only lacks finally/allSettled/any must pass; those islands patch it per method.
// Two checks an old native fails:
//   1. PromiseRejectionEvent (Chrome 49+ / Safari 11+). Without it unhandled
//      rejections are silent; install() below wires the event.
//   2. @@species: `p.then()` must construct through the species constructor.
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

    // Already ours. Nothing below would pass -- promise-polyfill is not
    // species-aware either -- and re-installing would swap a live constructor
    // out from under every promise already created against it.
    if ((Promise as any).__polyfilled === true) {
      return true;
    }

    const w: any = window;
    if (typeof w.PromiseRejectionEvent !== 'function') {
      return false;
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

import PromisePolyfillImpl from 'promise-polyfill';

/*
 * Scheduler. promise-polyfill picks setImmediate or setTimeout at module-eval
 * time, before installPolyfills() runs, so it always got setTimeout -- and nested
 * timers clamp to 4ms past depth 5, so long .then chains took seconds.
 * The fix is core-js's shape (MIT):
 * 1. Batch: one wake-up per empty -> non-empty transition; the drain runs until
 *    the queue is empty, including callbacks queued during the drain.
 * 2. MutationObserver (a microtask: unclamped, before paint), MessageChannel as
 *    the fallback. The observer exclusions are core-js's: some old iOS and webOS
 *    WebKit builds don't fire it reliably.
 */
const scheduleDrain = (): ((fn: () => void) => void) => {
  const queue: any[] = [];
  // Index, not shift() (O(n) on old engines); slots are nulled as consumed.
  let head = 0;
  let scheduled = false;
  let wake: () => void;

  const drain = (): void => {
    scheduled = false;
    while (head < queue.length) {
      const fn = queue[head];
      queue[head] = undefined;
      head++;
      try {
        fn();
      } catch (error) {
        // Rethrow from a timer: the error still reaches window.onerror without
        // abandoning the reactions queued behind it.
        w.setTimeout(function () {
          throw error;
        }, 0);
      }
      // Past 1024, slide the unrun tail down to 0 so a long-lived drain doesn't grow
      // the array forever (asap's fix). Amortised O(1).
      if (head > 1024) {
        const rest = queue.length - head;
        for (let i = 0; i < rest; i++) queue[i] = queue[head + i];
        queue.length = rest;
        head = 0;
      }
    }
    queue.length = 0;
    head = 0;
  };

  const w: any = window;
  const MO = w.MutationObserver || w.WebKitMutationObserver;
  const ua = (w.navigator && w.navigator.userAgent) || '';
  const brokenObserver = /(?:ipad|iphone|ipod).*applewebkit/i.test(ua) || /web0s(?!.*chrome)/i.test(ua);

  /*
   * Backup timer alongside the fast path, only where the fast path can stall: a
   * script-implemented MutationObserver built on the global Promise (jsdom)
   * deadlocks once that Promise is this polyfill. Whichever fires first drains.
   */
  let fast: () => void;
  // A native MutationObserver can't stall, so it skips the timer.
  // MessageChannel keeps it, as in install-set-immediate.
  let needsBackup = true;

  if (MO && w.document && !brokenObserver) {
    // Detached text node: flipping its data is the cheapest observable mutation.
    let toggle = true;
    const node = w.document.createTextNode('');
    new MO(drain).observe(node, { characterData: true });
    try {
      needsBackup = !/\[native code\]/.test(Function.prototype.toString.call(MO));
    } catch (e) {
      /* unreadable source: keep the timer */
    }
    fast = function (): void {
      toggle = !toggle;
      node.data = toggle ? '1' : '0';
    };
  } else if (typeof w.MessageChannel === 'function') {
    const channel = new w.MessageChannel();
    channel.port1.onmessage = drain;
    fast = function (): void {
      channel.port2.postMessage(0);
    };
  } else {
    fast = function (): void {};
  }

  wake = function (): void {
    fast();
    if (needsBackup) w.setTimeout(drain, 0);
  };

  return function (fn: () => void): void {
    queue.push(fn);
    if (scheduled) return;
    scheduled = true;
    wake();
  };
};

/*
 * Report an unhandled rejection the way the platform does: isSupported() rejects
 * natives without PromiseRejectionEvent, so this must provide one.
 * createEvent/initEvent because these engines lack the event constructors.
 * onunhandledrejection is called explicitly only where the engine doesn't wire
 * it as an event-handler attribute (else every rejection arrives twice); checked
 * at install time, before app code can assign it.
 *
 * [incomplete] `event.promise` is null: promise-polyfill only passes the reason.
 */
let handlerAttributeIsWired = false;

const reportUnhandledRejection = function (reason: any): void {
  const w: any = window;
  let prevented = false;

  try {
    const doc = w.document;
    if (doc && typeof doc.createEvent === 'function' && typeof w.dispatchEvent === 'function') {
      const event: any = doc.createEvent('Event');
      event.initEvent('unhandledrejection', false, true);
      event.reason = reason;
      event.promise = null;

      // dispatchEvent returns false when a listener cancelled the event.
      prevented = w.dispatchEvent(event) === false;

      if (!handlerAttributeIsWired && typeof w.onunhandledrejection === 'function') {
        w.onunhandledrejection(event);
        prevented = event.defaultPrevented === true;
      }
    } else if (typeof w.onunhandledrejection === 'function') {
      // No DOM to build an event with -- hand over a shaped object instead.
      w.onunhandledrejection({ reason: reason, promise: null });
    }
  } catch (e) {
    // Reporting a failure must never throw over the failure it is reporting.
  }

  if (!prevented && typeof console !== 'undefined' && console.warn) {
    console.warn('Unhandled promise rejection:', reason);
  }
};

export const install = (): void => {
  // Before the constructor goes on the window: promise-polyfill reads
  // _immediateFn per callback, so replacing it here covers every promise this
  // page will ever create.
  // Promise jobs and queueMicrotask callbacks share one FIFO queue (HTML; core-js
  // shares its internal microtask). So when a queueMicrotask exists -- spackle's,
  // installed first, on every engine that gets this Promise -- the jobs go through
  // it, looked up on window rather than imported. Only without one does this
  // island run its own queue.
  const w: any = window;
  const queueMicrotaskFn = w.queueMicrotask;
  (PromisePolyfillImpl as any)._immediateFn =
    typeof queueMicrotaskFn === 'function'
      ? function (job: () => void): void {
          // called with window as this: a native queueMicrotask needs it
          queueMicrotaskFn.call(w, job);
        }
      : scheduleDrain();
  handlerAttributeIsWired = 'onunhandledrejection' in (window as any);
  (PromisePolyfillImpl as any)._unhandledRejectionFn = reportUnhandledRejection;

  (window as any).Promise = null;
  delete (window as any).Promise;
  // promise-polyfill ships its own non-conformant any/allSettled. Strip them so
  // the gates in install-polyfills.ts install spackle's islands instead.
  delete (PromisePolyfillImpl as any).any;
  delete (PromisePolyfillImpl as any).allSettled;

  // promise-polyfill attaches everything by plain assignment, so its statics and
  // methods enumerate; built-ins don't (core-js installs every one hidden). Same
  // functions, enumerable switched off. Install time only.
  const hide = function (owner: any, names: string[]): void {
    for (let i = 0; i < names.length; i++) {
      const descriptor = Object.getOwnPropertyDescriptor(owner, names[i]);
      if (descriptor && descriptor.enumerable) {
        descriptor.enumerable = false;
        Object.defineProperty(owner, names[i], descriptor);
      }
    }
  };
  hide(PromisePolyfillImpl, ['all', 'race', 'resolve', 'reject', '_immediateFn', '_unhandledRejectionFn']);
  hide((PromisePolyfillImpl as any).prototype, ['then', 'finally']);
  // Spec (and core-js's es.promise.catch): catch(f) is this.then(undefined, f).
  // promise-polyfill passes null, which a replaced `then` can tell apart.
  const promiseCatch = function (this: any, onRejected: any): any {
    return this.then(undefined, onRejected);
  };
  try { Object.defineProperty(promiseCatch, 'name', { value: 'catch', configurable: true }); } catch (e) { /* Function#name non-configurable pre-ES6 */ }
  Object.defineProperty((PromisePolyfillImpl as any).prototype, 'catch', { value: promiseCatch, writable: true, enumerable: false, configurable: true });
  // Built-in constructors' prototype property is non-writable (non-enumerable and non-configurable already, as on any function).
  Object.defineProperty(PromisePolyfillImpl, 'prototype', { writable: false });
  // core-js's setSpecies: get [Symbol.species]() { return this; }
  const species = typeof Symbol === 'function' ? (Symbol as any).species : undefined;
  if (species && !Object.prototype.hasOwnProperty.call(PromisePolyfillImpl, species)) {
    Object.defineProperty(PromisePolyfillImpl, species, { get: function (this: any) { return this; }, enumerable: false, configurable: true });
  }
  // core-js's setToStringTag(Promise, 'Promise'): non-writable, non-enumerable, configurable.
  const toStringTag = typeof Symbol === 'function' ? (Symbol as any).toStringTag : undefined;
  if (toStringTag && !Object.prototype.hasOwnProperty.call((PromisePolyfillImpl as any).prototype, toStringTag)) {
    Object.defineProperty((PromisePolyfillImpl as any).prototype, toStringTag, { value: 'Promise', writable: false, enumerable: false, configurable: true });
  }

  define((window as any), 'Promise', PromisePolyfillImpl);
};
