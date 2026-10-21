// core-js's fix-regexp-well-known-symbol-logic (DELEGATES_TO_SYMBOL): the native
// must hand an object carrying @@match to that method. Chrome 41 and Safari 9
// have no Symbol.match of their own, so they ignore it and are replaced.
export const isSupported = (): boolean => {
  try {
    if (typeof String.prototype.match !== 'function') return false;
    const symbol = typeof Symbol !== 'undefined' ? (Symbol as any).match : undefined;
    if (!symbol) return true; // nothing to delegate to
    const probe: any = {};
    probe[symbol] = function () {
      return 7;
    };
    return ('' as any).match(probe) === 7;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.match */

const nativeMatch = String.prototype.match;

export const stringMatch = function match(this: any, matcher: any): any {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.match called on null or undefined');
  }
  // GetMethod(arg, @@match), objects only (the spec no longer reads it off a
  // primitive's prototype): a handler wins, and a non-callable one is a TypeError.
  if (matcher !== null && (typeof matcher === 'object' || typeof matcher === 'function') && typeof Symbol !== 'undefined' && (Symbol as any).match) {
    const handler = matcher[(Symbol as any).match];
    if (handler !== undefined && handler !== null) {
      if (typeof handler !== 'function') throw new TypeError('String.prototype.match: @@match is not a function');
      // the receiver itself, not ToString(receiver): the handler converts it
      return handler.call(matcher, this);
    }
  }
  return nativeMatch.call(this, matcher);
};

