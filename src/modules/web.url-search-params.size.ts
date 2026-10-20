// Behavioral: `size` is an accessor, so probe the value rather than typeof.
import { defineGetter } from '../define.js';

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

export const install = (): void => {
  if (typeof URLSearchParams !== 'undefined' && URLSearchParams.prototype) {
    defineGetter(URLSearchParams.prototype, 'size', urlSearchParamsSizeGetter);
  }
};
