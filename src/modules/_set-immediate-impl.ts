// Ported from: the prior implementation (set-immediate.ts)

export const isSupported = (): boolean => {
  try {
    return typeof (window as any).setImmediate === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://w3c.github.io/setImmediate/
 *
 * Known limitations:
 * - [scope] function callbacks only — the string-eval form is not implemented
 *   (warns and no-ops if hit).
 */

let nextHandle = 1;
const pendingTasks: { [handle: number]: { callback: any; args: any[] } } = {};
const MESSAGE_PREFIX = 'spackle-set-immediate$';
let messageListenerInstalled = false;
let warnedStringCallback = false;

const runTask = (handle: number): void => {
  const task = pendingTasks[handle];
  if (task) {
    delete pendingTasks[handle];
    task.callback.apply(undefined, task.args);
  }
};

// postMessage gives us a real macrotask without the 4ms clamped-setTimeout
// tax; the listener is installed lazily on first use so importing this module
// stays side-effect free
const canUsePostMessage = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    typeof window.postMessage === 'function' &&
    typeof window.addEventListener === 'function'
  );
};

const installMessageListener = (): void => {
  window.addEventListener(
    'message',
    function (event: any) {
      if (
        event.source === window &&
        typeof event.data === 'string' &&
        event.data.indexOf(MESSAGE_PREFIX) === 0
      ) {
        runTask(+event.data.substring(MESSAGE_PREFIX.length));
      }
    },
    false
  );
  messageListenerInstalled = true;
};

export const setImmediate = function (callback: any): number {
  if (typeof callback !== 'function') {
    if (!warnedStringCallback) {
      warnedStringCallback = true;
      console.warn('[spackle] setImmediate: non-function callbacks (string eval form) are not implemented');
    }
    return 0;
  }
  const args: any[] = [];
  for (let i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  const handle = nextHandle++;
  pendingTasks[handle] = { callback: callback, args: args };
  if (canUsePostMessage()) {
    if (!messageListenerInstalled) {
      installMessageListener();
    }
    window.postMessage(MESSAGE_PREFIX + handle, '*');
  }
  // Always schedule the timer, even on the postMessage path. Delivery is not
  // guaranteed -- a listener gated on event.source === window doesn't fire in
  // every realm (see the documented test skip) -- and an undelivered task
  // otherwise retains its callback and args in pendingTasks for the life of the
  // page. postMessage still wins the race in practice, and runTask deletes the
  // entry before invoking, so this no-ops whenever delivery did happen.
  setTimeout(runTask, 0, handle);
  return handle;
};

export const clearImmediate = function (handle: number): void {
  delete pendingTasks[handle];
};

if (!isSupported()) {
  Object.defineProperty((window as any), 'setImmediate', { value: setImmediate, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).setImmediate, 'name', { value: 'setImmediate', configurable: true });
  Object.defineProperty((window as any).setImmediate, '__polyfilled', { value: true });
  Object.defineProperty((window as any), 'clearImmediate', { value: clearImmediate, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).clearImmediate, 'name', { value: 'clearImmediate', configurable: true });
  Object.defineProperty((window as any).clearImmediate, '__polyfilled', { value: true });
}
