// Behavioral, not existence: has() has always been there -- what's missing on
// older implementations is the second argument. A one-arg has() ignores the
// extra value and reports true for any matching name, so probe that directly.
export const isSupported = (): boolean => {
  try {
    if (typeof URLSearchParams === 'undefined') {
      return true;
    }
    return new URLSearchParams('a=1').has('a', '2') === false;
  } catch {
    return false;
  }
};

export const isURLSearchParamsHasSupported = isSupported;

/**
 * Spec: https://url.spec.whatwg.org/#dom-urlsearchparams-has
 *
 * Wraps whatever has() is live rather than reimplementing it, so the one-arg
 * path keeps the underlying semantics exactly.
 */

const originalHas =
  typeof URLSearchParams !== 'undefined' && URLSearchParams.prototype
    ? URLSearchParams.prototype.has
    : undefined;

export const urlSearchParamsHas = function (this: any, name: any, value?: any): boolean {
  if (value === undefined) {
    return originalHas!.call(this, name);
  }
  const key = String(name);
  const wanted = String(value);
  let found = false;
  this.forEach(function (pairValue: string, pairName: string) {
    if (!found && pairName === key && pairValue === wanted) {
      found = true;
    }
  });
  return found;
};

if (originalHas && !isSupported()) {
  Object.defineProperty(URLSearchParams.prototype, 'has', { value: urlSearchParamsHas as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(URLSearchParams.prototype.has, 'name', { value: 'has', configurable: true });
  Object.defineProperty((URLSearchParams.prototype.has as any), '__polyfilled', {
    value: true,
  });
}
