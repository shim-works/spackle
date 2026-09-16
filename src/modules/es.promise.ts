// Ported from: the prior implementation (third-party: promise-polyfill, via is-promise-supported.ts)

// Promise — constructor-only ON PURPOSE (locked call): a false here means a
// WHOLESALE swap to promise-polyfill, whose setTimeout scheduling adds input
// jitter. A native that only lacks finally/allSettled/any must NOT fail this —
// those get patched onto the native per-method in the language mount. So we just
// confirm the core constructor + then/catch/resolve/reject are all present.
export const isSupported = (): boolean => {
  try {
    return (
      typeof Promise === 'function' &&
      typeof Promise.prototype.then === 'function' &&
      typeof Promise.prototype.catch === 'function' &&
      typeof Promise.resolve === 'function' &&
      typeof Promise.reject === 'function'
    );
  } catch {
    return false;
  }
};

export const isPromiseSupported = isSupported;

import PromisePolyfillImpl from 'promise-polyfill';

if (!isSupported()) {
  (window as any).Promise = null;
  delete (window as any).Promise;
  Object.defineProperty((window as any), 'Promise', { value: PromisePolyfillImpl, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).Promise, 'name', { value: 'Promise', configurable: true });
  Object.defineProperty((window as any).Promise, '__polyfilled', { value: true });
}
