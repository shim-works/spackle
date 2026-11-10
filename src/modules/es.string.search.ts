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
    if (('' as any).search(probe) !== 7) return false;
    // core-js DELEGATES_TO_EXEC: the RegExp's own @@search must go through exec
    // (Chrome 50's doesn't, and its native search reads @@search off primitives)
    let execCalled = false;
    const re: any = /a/;
    re.exec = function () {
      execCalled = true;
      return null;
    };
    re[symbol]('');
    return execCalled;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.search */

const nativeSearch = String.prototype.search;
const objectToStringS = Object.prototype.toString;

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
  // RegExpCreate(ToString(matcher)) for anything @@search didn't take: a primitive
  // (the native reads @@search off its prototype on Chrome 50) or an object whose
  // @@search is null. A real RegExp goes as it is: no copy per call.
  if (matcher === null || (typeof matcher !== 'object' && typeof matcher !== 'function') || objectToStringS.call(matcher) !== '[object RegExp]') {
    if (typeof matcher === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
    matcher = new RegExp(matcher === undefined ? '' : String(matcher));
  }
  return nativeSearch.call(this, matcher);
};

/*
 * RegExp.prototype[@@search] (core-js fix-regexp-well-known-symbol-logic): installed
 * with String.prototype.search wherever the gate above fails. A regexp whose exec
 * is untouched goes straight to the engine; only an overridden exec (or a
 * sticky-emulated instance) takes the spec algorithm, which calls exec.
 */
const regExpExecAtLoad = RegExp.prototype.exec;
const objectToStringR = Object.prototype.toString;
const symbolKeySearch: any = typeof Symbol !== 'undefined' ? (Symbol as any).search : undefined;
// the engine's own @@search, when it has one (Chrome 50+, Safari 10+)
const nativeRegExpSearch: any = symbolKeySearch ? (RegExp.prototype as any)[symbolKeySearch] : undefined;

// SameValue, for the lastIndex save/restore (-0 is not 0)
const sameValueSearch = (a: any, b: any): boolean =>
  a === b ? a !== 0 || 1 / a === 1 / b : a !== a && b !== b;

export const regExpSearch = function (this: any, string: any): any {
  const rx = this;
  if (rx === null || (typeof rx !== 'object' && typeof rx !== 'function')) {
    throw new TypeError('RegExp.prototype[@@search] called on a non-object');
  }
  // inlined: toStrSearch(string)
  if (typeof string === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const S = typeof string === 'string' ? string : String(string);
  // inlined: execUntouchedSearch(rx)
  const exec = rx.exec;
  if (exec === regExpExecAtLoad || exec === RegExp.prototype.exec) {
    return nativeRegExpSearch ? nativeRegExpSearch.call(rx, S) : nativeSearch.call(S, rx);
  }
  const previousLastIndex = rx.lastIndex;
  if (!sameValueSearch(previousLastIndex, 0)) rx.lastIndex = 0;
  // inlined: regExpExecSearch(rx, S) -- RegExpExec: a callable exec wins and
  // must return an object or null
  let result: any;
  const execFn = rx.exec;
  if (typeof execFn === 'function') {
    result = execFn.call(rx, S);
    if (result !== null && typeof result !== 'object' && typeof result !== 'function') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
  } else {
    if (objectToStringR.call(rx) !== '[object RegExp]') {
      throw new TypeError('RegExp#exec called on incompatible receiver');
    }
    result = regExpExecAtLoad.call(rx, S);
  }
  const currentLastIndex = rx.lastIndex;
  if (!sameValueSearch(currentLastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
  return result === null ? -1 : result.index;
};

export const installRegExpSearch = (): void => {
  if (!symbolKeySearch) return;
  try {
    Object.defineProperty(RegExp.prototype, symbolKeySearch, { value: regExpSearch, writable: true, enumerable: false, configurable: true });
    try { Object.defineProperty(regExpSearch, 'name', { value: '[Symbol.search]', configurable: true }); } catch (e) { /* Function#name non-configurable pre-ES6 */ }
    Object.defineProperty(regExpSearch, '__polyfilled', { value: true });
  } catch (e) { /* locked-down RegExp.prototype: the native stays */ }
};
