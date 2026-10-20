export const isSupported = (): boolean => {
  try {
    return typeof (window as any).queueMicrotask === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
 *
 * One queue, one wake-up per turn, drained to empty (same scheduler shape as
 * es.promise.ts). MutationObserver because the callback must be a microtask;
 * MessageChannel (a macrotask, later than spec but unclamped) as fallback, with
 * core-js's exclusions for old iOS/webOS WebKit; setTimeout only when neither
 * exists. Initialised lazily, so importing has no side effects.
 */
const CAPACITY = 1024;
const queue: any[] = [];
let head = 0;
let scheduled = false;
let fast: (() => void) | null = null;

const drain = (): void => {
  scheduled = false;
  while (head < queue.length) {
    const callback = queue[head];
    queue[head] = undefined;
    head++;
    try {
      callback();
    } catch (error) {
      // Rethrow from a timer: reaches window.onerror, and this drain continues.
      setTimeout(function () {
        throw error;
      }, 0);
    }
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

    if (MO && w.document && !brokenObserver) {
      // Detached text node: flipping its data is the cheapest observable mutation.
      let toggle = true;
      const node = w.document.createTextNode('');
      new MO(drain).observe(node, { characterData: true });
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
