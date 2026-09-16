// Ported from: the prior implementation (queue-microtask.ts)

export const isSupported = (): boolean => {
  try {
    return typeof (window as any).queueMicrotask === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
 * Inspired by: feross/queue-microtask (resolved-promise reuse + setTimeout rethrow)
 */

// Reuse a single resolved promise across calls — `.then` still queues a fresh
// microtask each time, but we avoid allocating a new promise per schedule.
let resolved: Promise<void> | null = null;

export const queueMicrotask = function (callback: () => void): void {
  if (typeof callback !== 'function') {
    throw new TypeError('queueMicrotask requires a function argument');
  }
  if (resolved === null) {
    resolved = Promise.resolve();
  }
  // Single `.then` reaction (not `.then().catch()`) so we allocate one promise +
  // one microtask job per call, matching native. The callback runs inside a
  // try/catch instead of leaning on a downstream rejection handler.
  resolved.then(function () {
    try {
      callback();
    } catch (error) {
      // Surface a throwing callback as an uncaught error, matching the spec —
      // a bare promise rejection would be invisible to window.onerror.
      setTimeout(function () {
        throw error;
      }, 0);
    }
  });
};

if (!isSupported()) {
  Object.defineProperty((window as any), 'queueMicrotask', { value: queueMicrotask, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).queueMicrotask, 'name', { value: 'queueMicrotask', configurable: true });
  Object.defineProperty((window as any).queueMicrotask, '__polyfilled', { value: true });
}
