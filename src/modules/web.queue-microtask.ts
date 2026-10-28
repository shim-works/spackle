export const isSupported = (): boolean => {
  try {
    // core-js WRONG_ARITY
    return typeof (window as any).queueMicrotask === 'function' && (window as any).queueMicrotask.length === 1;
  } catch {
    return false;
  }
};

/**
 * Spec: https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
 *
 * One queue, one wake-up per turn, drained to empty (same scheduler shape as
 * es.promise.ts). The wake-up is a native Promise.then where there is one;
 * otherwise core-js's MutationObserver, minus its old iOS/webOS WebKit
 * exclusions; setTimeout only when neither works (iOS 7.1: no Promise, MO
 * excluded). Initialised lazily, so importing has no side effects.
 */
// Captured at load, before es.promise installs: a replaced native gets its then
// patched to route through spackle's Promise, which schedules through this
// queue -- reading either later would recurse.
const NativePromise: any = typeof Promise === 'function' && typeof Promise.resolve === 'function' ? Promise : null;
const nativeThen: any = NativePromise && NativePromise.prototype && NativePromise.prototype.then;

const CAPACITY = 1024;
const queue: any[] = [];
let head = 0;
let scheduled = false;
let fast: (() => void) | null = null;

// The try kept out of drain's loop (old V8 won't optimise a function holding one).
const runCallback = (callback: any): void => {
  try {
    callback();
  } catch (error) {
    // Rethrow from a timer: reaches window.onerror, and this drain continues.
    setTimeout(function () {
      throw error;
    }, 0);
  }
};

const drain = (): void => {
  scheduled = false;
  while (head < queue.length) {
    const callback = queue[head];
    queue[head] = undefined;
    head++;
    runCallback(callback);
    // Past CAPACITY, slide the unrun tail down to 0 so a long-lived drain doesn't
    // grow the array forever (asap's fix). Amortised O(1).
    if (head > CAPACITY) {
      const rest = queue.length - head;
      for (let i = 0; i < rest; i++) queue[i] = queue[head + i];
      queue.length = rest;
      head = 0;
    }
  }
  queue.length = 0;
  head = 0;
};

const wake = (): void => {
  if (fast === null) {
    const w: any = window;
    const MO = w.MutationObserver || w.WebKitMutationObserver;
    const ua = (w.navigator && w.navigator.userAgent) || '';
    const brokenObserver =
      /(?:ipad|iphone|ipod).*applewebkit/i.test(ua) || /web0s(?!.*chrome)/i.test(ua);

    if (typeof nativeThen === 'function') {
      // core-js's setup: resolve(undefined) (a bare resolve() throws on LG webOS
      // 2), and an own constructor so the native then's species lookup stays on
      // the native (iOS Safari 10.1; also skips spackle's proto splice).
      const resolved = NativePromise.resolve(undefined);
      resolved.constructor = NativePromise;
      fast = function (): void {
        nativeThen.call(resolved, drain);
      };
    } else if (MO && w.document && !brokenObserver) {
      // Detached text node: flipping its data is the cheapest observable mutation.
      let toggle = true;
      const node = w.document.createTextNode('');
      new MO(drain).observe(node, { characterData: true });
      fast = function (): void {
        toggle = !toggle;
        node.data = toggle ? '1' : '0';
      };
    } else {
      // Last-resort scheduler only, not a watchdog alongside a working fast path.
      fast = function (): void {
        setTimeout(drain, 0);
      };
    }
  }

  fast();
};

export const queueMicrotask = function (callback: () => void): void {
  if (typeof callback !== 'function') {
    throw new TypeError('queueMicrotask requires a function argument');
  }
  queue[queue.length] = callback;
  if (scheduled) {
    return;
  }
  scheduled = true;
  wake();
};
