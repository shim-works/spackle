// Based on core-js (es.global-this)
// globalThis -- Chrome 71 / Safari 12.1 shipped it; older engines lack the
// binding entirely. Existence check, no broken partials in range.
export const isSupported = (): boolean => {
  try {
    return typeof globalThis !== 'undefined' && (globalThis as any).globalThis === globalThis;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-globalthis
 *
 * Known limitations:
 * - [scope] browser-only: points globalThis at `window`. No worker/Node fallback.
 */
export const install = (): void => {
  // No __polyfilled marker: globalThis is window itself. Spec descriptor:
  // writable, non-enumerable, configurable (core-js's global export matches).
  Object.defineProperty(window, 'globalThis', { value: window, writable: true, enumerable: false, configurable: true });
};
