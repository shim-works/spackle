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

const objectToString = Object.prototype.toString;
const RegExpProto = RegExp.prototype;

/*
 * Never reads `flags`: es.regexp.flags reads `dotAll`, so deriving one from
 * the other recursed until the stack overflowed where both were polyfilled.
 * Every engine that parses `s` ships a native dotAll, so this getter only ever
 * runs where the flag cannot be set: a real RegExp's dotAll is always false.
 */
export const regexpDotAllGetter = function (this: any): boolean | undefined {
  if (this === null || (typeof this !== 'object' && typeof this !== 'function')) {
    throw new TypeError('RegExp.prototype.dotAll getter called on a non-object');
  }
  if (this === RegExpProto) {
    return undefined;
  }
  if (objectToString.call(this) !== '[object RegExp]') {
    throw new TypeError('RegExp.prototype.dotAll getter called on an object that is not a RegExp');
  }
  return false;
};

export const install = (): void => {
  defineGetter(RegExp.prototype, 'dotAll', regexpDotAllGetter);
};
