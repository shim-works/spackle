// Behavioral: `size` is an accessor, so probe the value rather than typeof.
export const isSupported = (): boolean => {
  try {
    if (typeof URLSearchParams === 'undefined') {
      return true;
    }
    return new URLSearchParams('a=1&a=2').size === 2;
  } catch {
    return false;
  }
};

export const isURLSearchParamsSizeSupported = isSupported;

/**
 * Spec: https://url.spec.whatwg.org/#dom-urlsearchparams-size
 *
 * Counts every pair, not distinct names -- `a=1&a=2` is size 2. Counted through
 * forEach so this works against whichever URLSearchParams is live, native or
 * the web.url-search-params island.
 */
export const urlSearchParamsSizeGetter = function (this: any): number {
  let count = 0;
  this.forEach(function () {
    count++;
  });
  return count;
};

if (typeof URLSearchParams !== 'undefined' && URLSearchParams.prototype && !isSupported()) {
  Object.defineProperty(URLSearchParams.prototype, 'size', {
    configurable: true,
    get: urlSearchParamsSizeGetter,
  });
  // accessor property -- the marker goes on the getter function itself
  Object.defineProperty((urlSearchParamsSizeGetter as any), '__polyfilled', { value: true });
}
