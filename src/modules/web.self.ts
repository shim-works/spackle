// Behavioral, not just existence: some environments expose a `self` that is not
// the global object. The spec says window.self === window.
export const isSupported = (): boolean => {
  try {
    return typeof window === 'undefined' || (window as any).self === window;
  } catch {
    return true;
  }
};

/**
 * Spec: https://html.spec.whatwg.org/multipage/window-object.html#dom-self
 *
 * No __polyfilled marker: the value is window itself.
 */
export const install = (): void => {
  if (typeof window !== 'undefined') {
    try {
      (window as any).self = window;
    } catch {
      // some engines make `self` a non-writable accessor on the global -- nothing
      // to do, and failing here would take down every module after this one
    }
  }
};
