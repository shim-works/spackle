// Behavioral, not just existence: some environments expose a `self` that is not
// the global object. The spec says window.self === window.
export const isSupported = (): boolean => {
  try {
    return typeof window === 'undefined' || (window as any).self === window;
  } catch {
    return true;
  }
};

export const isSelfSupported = isSupported;

/**
 * Spec: https://html.spec.whatwg.org/multipage/window-object.html#dom-self
 *
 * No __polyfilled marker: the value is the window object itself, and tagging it
 * would put a stray property on the global.
 */
if (typeof window !== 'undefined' && !isSupported()) {
  try {
    (window as any).self = window;
  } catch {
    // some engines make `self` a non-writable accessor on the global -- nothing
    // to do, and failing here would take down every module after this one
  }
}
