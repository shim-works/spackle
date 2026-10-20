// ids: web.immediate, web.timers

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

/*
 * One FIFO queue and one MessageChannel (React's scheduler runs on this where
 * there's no native setImmediate). A call with no extra arguments allocates
 * nothing. Each message runs exactly the next task, so a throwing task reaches
 * window.onerror and the rest still run. Handles are baseHandle + slot, so
 * clearImmediate is O(1).
 */
const fns: any[] = [];
const argsQ: any[] = [];
let head = 0;
// Handle of slot 0; moves up as the consumed front of the queue is dropped.
let baseHandle = 1;
let post: (() => void) | null = null;
let warnedStringCallback = false;

const runNext = (): void => {
  if (head >= fns.length) return;
  const fn = fns[head];
  const args = argsQ[head];
  fns[head] = undefined;
  argsQ[head] = undefined;
  head++;
  // Drop the consumed front before calling, so a throwing task leaves the
  // queue tidy: empty -> reset; long -> slide the unrun tail down (asap's fix).
  if (head === fns.length) {
    fns.length = 0;
    argsQ.length = 0;
    baseHandle += head;
    head = 0;
  } else if (head > 1024) {
    const rest = fns.length - head;
    for (let i = 0; i < rest; i++) {
      fns[i] = fns[head + i];
      argsQ[i] = argsQ[head + i];
    }
    fns.length = rest;
    argsQ.length = rest;
    baseHandle += head;
    head = 0;
  }
  if (fn) {
    if (args === undefined) fn();
    else fn.apply(undefined, args);
  }
};

// Created on first use, so importing this module stays side-effect free.
const makePost = (): (() => void) => {
  const w: any = window;
  if (typeof w.MessageChannel === 'function') {
    const channel = new w.MessageChannel();
    channel.port1.onmessage = runNext;
    return function (): void {
      channel.port2.postMessage(0);
    };
  }
  return function (): void {
    setTimeout(runNext, 0);
  };
};

export const setImmediate = function (callback: any): number {
  if (typeof callback !== 'function') {
    if (!warnedStringCallback) {
      warnedStringCallback = true;
      console.warn('[spackle] setImmediate: non-function callbacks (string eval form) are not implemented');
    }
    return 0;
  }
  const slot = fns.length;
  fns[slot] = callback;
  if (arguments.length > 1) {
    const args: any[] = [];
    for (let i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
    argsQ[slot] = args;
  } else {
    argsQ[slot] = undefined;
  }
  if (post === null) post = makePost();
  post();
  return baseHandle + slot;
};

export const clearImmediate = function (handle: number): void {
  const slot = handle - baseHandle;
  if (slot >= head && slot < fns.length) {
    fns[slot] = undefined;
    argsQ[slot] = undefined;
  }
};
