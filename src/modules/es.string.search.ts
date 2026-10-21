// core-js's fix-regexp-well-known-symbol-logic (DELEGATES_TO_SYMBOL): the native
// must hand an object carrying @@search to that method. Chrome 41 and Safari 9
// have no Symbol.search of their own, so they ignore it and are replaced.
export const isSupported = (): boolean => {
  try {
    if (typeof String.prototype.search !== 'function') return false;
    const symbol = typeof Symbol !== 'undefined' ? (Symbol as any).search : undefined;
    if (!symbol) return true; // nothing to delegate to
    const probe: any = {};
    probe[symbol] = function () {
      return 7;
    };
    return ('' as any).search(probe) === 7;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.search */

const nativeSearch = String.prototype.search;

export const stringSearch = function search(this: any, matcher: any): any {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.search called on null or undefined');
  }
  // GetMethod(arg, @@search), objects only (the spec no longer reads it off a
  // primitive's prototype): a handler wins, and a non-callable one is a TypeError.
  if (matcher !== null && (typeof matcher === 'object' || typeof matcher === 'function') && typeof Symbol !== 'undefined' && (Symbol as any).search) {
    const handler = matcher[(Symbol as any).search];
    if (handler !== undefined && handler !== null) {
      if (typeof handler !== 'function') throw new TypeError('String.prototype.search: @@search is not a function');
      // the receiver itself, not ToString(receiver): the handler converts it
      return handler.call(matcher, this);
    }
  }
  return nativeSearch.call(this, matcher);
};

