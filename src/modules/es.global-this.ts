// Authored for spackle (no the prior implementation origin) -- based on core-js (es.global-this)

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
if (!isSupported()) {
  // No __polyfilled marker: globalThis is the global object itself (window), so
  // tagging it would tag window -- same "primitive-valued, carries no marker"
  // spirit as the Number constants.
  (window as any).globalThis = window;
}
