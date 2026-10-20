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
 * Each flag is read without re-entering a polyfill that derives from this getter
 * (flags -> dotAll -> flags recurses where both are polyfilled). Own properties
 * win; otherwise ask a native accessor on the prototype, and treat ours as false.
 */
// Annex B __lookupGetter__ (Chrome 38, Safari 7.1): returns the getter with no
// descriptor per read, and can't throw on RegExp.prototype.
const lookupGetter = (Object.prototype as any).__lookupGetter__;
const hasOwn = Object.prototype.hasOwnProperty;
const RegExpProto = RegExp.prototype;
// spec order: d g i m s u v y
const FLAG_KEYS = ['hasIndices', 'global', 'ignoreCase', 'multiline', 'dotAll', 'unicode', 'unicodeSets', 'sticky'];
const FLAG_CHARS = 'dgimsuvy';

export const regExpFlags = function (this: any): string {
  if (this === null || typeof this !== 'object') {
    throw new TypeError('RegExp.prototype.flags getter called on a non-object');
  }
  let result = '';
  for (let i = 0; i < FLAG_KEYS.length; i++) {
    const key = FLAG_KEYS[i];
    // inlined: readFlag(this, key)
    let on: boolean;
    if (hasOwn.call(this, key)) {
      on = !!this[key];
    } else {
      // Not re-checked from a cache on purpose: `flags` can run mid-install,
      // before the polyfilled flag getters exist, and a stale answer would
      // bring the flags -> dotAll -> flags cycle back.
      const getter = lookupGetter
        ? lookupGetter.call(RegExpProto, key)
        : (Object.getOwnPropertyDescriptor(RegExpProto, key) || ({} as any)).get;
      on = getter && getter.__polyfilled ? false : !!this[key];
    }
    if (on) result += FLAG_CHARS.charAt(i);
  }
  return result;
};

export const install = (): void => {
  defineGetter(RegExp.prototype, 'flags', regExpFlags);
};
