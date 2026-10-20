// Behavioural: older delete() ignores the second (value) argument.
import { define } from '../define.js';

export const isSupported = (): boolean => {
  try {
    if (typeof URLSearchParams === 'undefined') {
      return true;
    }
    const params = new URLSearchParams('a=1&a=2');
    params.delete('a', '1');
    return params.toString() === 'a=2';
  } catch {
    return false;
  }
};

/**
 * Spec: https://url.spec.whatwg.org/#dom-urlsearchparams-delete
 *
 * Removes pairs matching both name and value: snapshot through forEach, clear
 * with the one-arg delete, re-append the survivors in order. Works against
 * whichever URLSearchParams is live.
 */

/* Resolved at call time: see web.url-search-params.has. */
const nativeDelete = (): ((name: any) => void) | undefined => {
  const Ctor = (window as any).URLSearchParams;
  return Ctor && Ctor.prototype ? Ctor.prototype.delete : undefined;
};

/* Snapshotted at install time, once the constructor (native or ours) exists. */
let originalDelete: ((name: any) => void) | undefined;

export const urlSearchParamsDelete = function (this: any, name: any, value?: any): void {
  const remove = originalDelete || nativeDelete();
  if (!remove) {
    throw new TypeError('URLSearchParams.prototype.delete is not available');
  }
  if (value === undefined) {
    remove.call(this, name);
    return;
  }
  const key = String(name);
  const unwanted = String(value);

  // snapshot both lists BEFORE mutating anything
  const survivors: [string, string][] = [];
  const names: string[] = [];
  this.forEach(function (pairValue: string, pairName: string) {
    if (pairName !== key || pairValue !== unwanted) {
      survivors.push([pairName, pairValue]);
    }
    if (names.indexOf(pairName) === -1) {
      names.push(pairName);
    }
  });

  for (let i = 0; i < names.length; i++) {
    remove.call(this, names[i]);
  }
  for (let i = 0; i < survivors.length; i++) {
    this.append(survivors[i][0], survivors[i][1]);
  }
};

export const install = (): void => {
  // Read it before we replace it, or the delegate above would recurse into us.
  originalDelete = nativeDelete();
  if (originalDelete) {
    define(URLSearchParams.prototype, 'delete', urlSearchParamsDelete);
  }
};
