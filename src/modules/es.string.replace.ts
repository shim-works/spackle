// core-js's fix-regexp-well-known-symbol-logic (DELEGATES_TO_SYMBOL): the native
// must hand an object carrying @@replace to that method. Chrome 41 and Safari 9
// have no Symbol.replace of their own, so they ignore it and are replaced.
export const isSupported = (): boolean => {
  try {
    if (typeof String.prototype.replace !== 'function') return false;
    const symbol = typeof Symbol !== 'undefined' ? (Symbol as any).replace : undefined;
    if (!symbol) return true; // nothing to delegate to
    const probe: any = {};
    probe[symbol] = function () {
      return 7;
    };
    return ('' as any).replace(probe) === 7;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.replace */

// ToString: String(symbol) returns "Symbol(...)"; the spec throws a TypeError.
const toStr = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return typeof value === 'string' ? value : String(value);
};

const nativeReplace = String.prototype.replace;

const objectToString = Object.prototype.toString;

export const stringReplace = function replace(this: any, searchValue: any, replaceValue: any): any {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.replace called on null or undefined');
  }
  // GetMethod(arg, @@replace), objects only (the spec no longer reads it off a
  // primitive's prototype): a handler wins, and a non-callable one is a TypeError.
  if (searchValue !== null && (typeof searchValue === 'object' || typeof searchValue === 'function') && typeof Symbol !== 'undefined' && (Symbol as any).replace) {
    const handler = searchValue[(Symbol as any).replace];
    if (handler !== undefined && handler !== null) {
      if (typeof handler !== 'function') throw new TypeError('String.prototype.replace: @@replace is not a function');
      // the receiver itself, not ToString(receiver): the handler converts it
      return handler.call(searchValue, this, replaceValue);
    }
  }
  // A real RegExp with no @@replace to call (this floor has none on
  // RegExp.prototype) is the native's job.
  if (searchValue !== null && typeof searchValue === 'object' && objectToString.call(searchValue) === '[object RegExp]') {
    return nativeReplace.call(this, searchValue, replaceValue);
  }
  // The string search, converted in the spec's order: the receiver, the search
  // string, then a non-function replaceValue, even when nothing will match.
  const string = toStr(this);
  const searchString = toStr(searchValue);
  return (nativeReplace as any).call(string, searchString, typeof replaceValue === 'function' ? replaceValue : toStr(replaceValue));
};

