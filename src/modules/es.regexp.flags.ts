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
    return new RegExp('x', 'ig').flags === 'gi';
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
