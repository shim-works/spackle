// Behavioural: older has() ignores the second (value) argument.
import { define } from '../define.js';

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

/**
 * Spec: https://url.spec.whatwg.org/#dom-urlsearchparams-has
 *
 * Wraps the live has(), so the one-arg path keeps its semantics exactly.
 */

/* Resolved at call time: at module scope URLSearchParams may not exist yet. */
const nativeHas = (): ((name: any) => boolean) | undefined => {
  const Ctor = (window as any).URLSearchParams;
  return Ctor && Ctor.prototype ? Ctor.prototype.has : undefined;
};

/* Snapshotted at install time, once the constructor (native or ours) exists. */
let originalHas: ((name: any) => boolean) | undefined;

export const urlSearchParamsHas = function (this: any, name: any, value?: any): boolean {
  if (value === undefined) {
    const has = originalHas || nativeHas();
    if (!has) {
      throw new TypeError('URLSearchParams.prototype.has is not available');
    }
    return has.call(this, name);
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

export const install = (): void => {
  // Read it before we replace it, or the delegate below would recurse into us.
  originalHas = nativeHas();
  if (originalHas) {
    define(URLSearchParams.prototype, 'has', urlSearchParamsHas);
  }
};
