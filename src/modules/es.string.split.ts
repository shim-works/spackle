// core-js's fix-regexp-well-known-symbol-logic (DELEGATES_TO_SYMBOL): the native
// must hand an object carrying @@split to that method. Chrome 41 and Safari 9
// have no Symbol.split of their own, so they ignore it and are replaced.
export const isSupported = (): boolean => {
  try {
    if (typeof String.prototype.split !== 'function') return false;
    const symbol = typeof Symbol !== 'undefined' ? (Symbol as any).split : undefined;
    if (!symbol) return true; // nothing to delegate to
    const probe: any = {};
    probe[symbol] = function () {
      return 7;
    };
    return ('' as any).split(probe) === 7;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.split */

const nativeSplit = String.prototype.split;

export const stringSplit = function split(this: any, separator: any, limit?: any): any {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.split called on null or undefined');
  }
  // GetMethod(arg, @@split), objects only (the spec no longer reads it off a
  // primitive's prototype): a handler wins, and a non-callable one is a TypeError.
  if (separator !== null && (typeof separator === 'object' || typeof separator === 'function') && typeof Symbol !== 'undefined' && (Symbol as any).split) {
    const handler = separator[(Symbol as any).split];
    if (handler !== undefined && handler !== null) {
      if (typeof handler !== 'function') throw new TypeError('String.prototype.split: @@split is not a function');
      // the receiver itself, not ToString(receiver): the handler converts it
      return handler.call(separator, this, limit);
    }
  }
  return nativeSplit.call(this, separator, limit);
};

