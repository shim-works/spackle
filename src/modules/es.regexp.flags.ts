// RegExp.prototype.flags: Chrome 49 / Safari 9.
import { defineGetter } from '../define.js';

export const isSupported = (): boolean => {
  try {
    if (typeof RegExp === 'undefined' || !('flags' in RegExp.prototype)) {
      return false;
    }
    // Behavioural: an implementation that recursed through dotAll still passed
    // an existence check.
    if (new RegExp('x', 'gi').flags !== 'gi') return false;
    if (new RegExp('x').flags !== '') return false;
    // spec order is d g i m s u v y, not the order the flags were written in
    if (new RegExp('x', 'ig').flags !== 'gi') return false;

    // core-js's regexp-flags-detection: the getter reads each flag property with
    // Get, in spec order, and builds from what it read (Chrome 49-? read gimuy only)
    let indices = true;
    try {
      new RegExp('.', 'd');
    } catch (e) {
      indices = false;
    }
    const expected = indices ? 'dgimsy' : 'gimsy';
    const pairs: any = { dotAll: 's', global: 'g', ignoreCase: 'i', multiline: 'm', sticky: 'y' };
    if (indices) pairs.hasIndices = 'd';
    let calls = '';
    const O: any = {};
    for (const key in pairs) {
      (function (chr: string) {
        Object.defineProperty(O, key, { get: function () { calls += chr; return true; } });
      })(pairs[key]);
    }
    const result = (Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags') as any).get.call(O);
    return result === expected && calls === expected;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
 *
 * Reads each flag property with Get, in spec order. es.regexp.dot-all's getter
 * never reads `flags`, so the flags -> dotAll -> flags cycle cannot happen.
 */
// spec order: d g i m s u v y
const FLAG_KEYS = ['hasIndices', 'global', 'ignoreCase', 'multiline', 'dotAll', 'unicode', 'unicodeSets', 'sticky'];
const FLAG_CHARS = 'dgimsuvy';

export const regExpFlags = function (this: any): string {
  if (this === null || (typeof this !== 'object' && typeof this !== 'function')) {
    throw new TypeError('RegExp.prototype.flags getter called on a non-object');
  }
  let result = '';
  for (let i = 0; i < FLAG_KEYS.length; i++) {
    if (this[FLAG_KEYS[i]]) result += FLAG_CHARS.charAt(i);
  }
  return result;
};

export const install = (): void => {
  defineGetter(RegExp.prototype, 'flags', regExpFlags);
};
