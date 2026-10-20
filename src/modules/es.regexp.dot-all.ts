import { defineGetter } from '../define.js';

export const isSupported = (): boolean => {
  try {
    if (!('dotAll' in RegExp.prototype)) {
      return false;
    }
    // Behavioural: an engine with a real dotAll can parse the `s` flag; without it
    // `new RegExp('.', 's')` throws into the catch.
    if (new RegExp('.', 's').dotAll !== true) return false;
    return new RegExp('.').dotAll === false;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-get-regexp.prototype.dotall
 *
 * Known limitations:
 * - [unfixable] This exposes the accessor only. An engine without ES2018
 *   `s`-flag support still throws on `new RegExp('.', 's')`, so `dotAll` will
 *   read `false` because the flag could never be set in the first place. There
 *   is no way to change how the engine's own matcher treats `.` from ES5.
 */

/*
 * Own `flags` only. Reading `this.flags` reaches es.regexp.flags' getter, which
 * reads `dotAll`: infinite recursion where both are polyfilled (Chrome 41).
 * Without a native dotAll the flag can't have been set, so false is correct.
 */
export const regexpDotAllGetter = function (this: any): boolean | undefined {
  if (this === null || typeof this !== 'object') {
    throw new TypeError('RegExp.prototype.dotAll getter called on a non-object');
  }
  if (!Object.prototype.hasOwnProperty.call(this, 'flags')) {
    return false;
  }
  const flags = this.flags;
  if (typeof flags !== 'string') {
    return undefined;
  }
  return flags.indexOf('s') !== -1;
};

export const install = (): void => {
  defineGetter(RegExp.prototype, 'dotAll', regexpDotAllGetter);
};
