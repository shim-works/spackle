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
    if (('' as any).split(probe) !== 7) return false;
    // core-js DELEGATES_TO_EXEC (split form): @@split builds its splitter through
    // @@species and must call that splitter's exec
    let execCalled = false;
    const re: any = /a/;
    re.exec = function () {
      execCalled = true;
      return null;
    };
    const ctor: any = {};
    const speciesKey = (Symbol as any).species;
    if (speciesKey) ctor[speciesKey] = function () { return re; };
    const holder: any = { constructor: ctor, flags: '' };
    holder[symbol] = (/./ as any)[symbol];
    holder[symbol]('');
    if (!execCalled) return false;
    // core-js es.string.split: an overwritten exec still splits, the old capture
    // bugs are absent, and y is native
    const over: any = /(?:)/;
    const originalExec = over.exec;
    over.exec = function (this: any) {
      return originalExec.apply(this, arguments);
    };
    const parts = 'ab'.split(over);
    if (parts.length !== 2 || parts[0] !== 'a' || parts[1] !== 'b') return false;
    return !splitBuggy && !splitUnsupportedY;
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

/*
 * RegExp.prototype[@@split] (core-js fix-regexp-well-known-symbol-logic): installed
 * with String.prototype.split wherever the gate above fails. A regexp whose exec
 * is untouched goes straight to the engine; only an overridden exec (or a
 * sticky-emulated instance) takes the spec algorithm, which calls exec.
 */
const regExpExecAtLoad = RegExp.prototype.exec;
const objectToStringR = Object.prototype.toString;
const symbolKeySplit: any = typeof Symbol !== 'undefined' ? (Symbol as any).split : undefined;
// the engine's own @@split, when it has one (Chrome 50+, Safari 10+)
const nativeRegExpSplit: any = symbolKeySplit ? (RegExp.prototype as any)[symbolKeySplit] : undefined;

// ToString: String(symbol) returns "Symbol(...)"; the spec throws
const toStrSplit = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return typeof value === 'string' ? value : String(value);
};

// RegExpExec: a callable exec wins and must return an object or null
const regExpExecSplit = (R: any, S: string): any => {
  const exec = R.exec;
  if (typeof exec === 'function') {
    const result = exec.call(R, S);
    if (result !== null && typeof result !== 'object' && typeof result !== 'function') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (objectToStringR.call(R) !== '[object RegExp]') throw new TypeError('RegExp#exec called on incompatible receiver');
  return regExpExecAtLoad.call(R, S);
};

const toLengthSplit = (value: any): number => {
  let n = +value; // +x, not Number(x)
  n = n !== n || n <= 0 ? 0 : Math.floor(n);
  return n > 9007199254740991 ? 9007199254740991 : n;
};

// AdvanceStringIndex: a surrogate pair is one step under u / v
const advanceSplit = (S: string, index: number, unicode: boolean): number => {
  if (!unicode || index + 1 >= S.length) return index + 1;
  const c = S.charCodeAt(index);
  if (c < 0xd800 || c > 0xdbff) return index + 1;
  const d = S.charCodeAt(index + 1);
  return d < 0xdc00 || d > 0xdfff ? index + 1 : index + 2;
};

// core-js's split probes, at load
const splitUnsupportedY = (function () {
  try {
    const re = new RegExp('a', 'y');
    re.lastIndex = 2;
    return re.exec('abcd') !== null;
  } catch (e) {
    return true;
  }
})();
const splitBuggy = (function () {
  try {
    return 'abbc'.split(/(b)*/)[1] === 'c' ||
      'test'.split(/(?:)/, -1).length !== 4 ||
      'ab'.split(/(?:ab)*/).length !== 2 ||
      '.'.split(/(.?)(.?)/).length !== 4 ||
      '.'.split(/()()/).length > 1 ||
      ''.split(/.?/).length > 0;
  } catch (e) {
    return true;
  }
})();
// '0'.split(undefined, 0) must be [] (old engines return ['0'])
const internalSplit = function (this: string, separator: any, limit: any): string[] {
  if (separator === undefined && limit === 0) return [];
  return (nativeSplit as any).call(this, separator, limit);
};

export const regExpSplit = function (this: any, string: any, limit: any): any {
  const rx = this;
  if (rx === null || (typeof rx !== 'object' && typeof rx !== 'function')) {
    throw new TypeError('RegExp.prototype[@@split] called on a non-object');
  }
  // inlined: toStrSplit(string)
  if (typeof string === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const S = typeof string === 'string' ? string : String(string);
  // inlined: execUntouchedSplit(rx)
  const exec = rx.exec;
  if (!splitBuggy && (exec === regExpExecAtLoad || exec === RegExp.prototype.exec)) {
    return nativeRegExpSplit ? nativeRegExpSplit.call(rx, S, limit) : internalSplit.call(S, rx, limit);
  }
  // SpeciesConstructor(rx, %RegExp%)
  const defaultCtor: any = (window as any).RegExp;
  let C: any = rx.constructor;
  if (C === undefined) C = defaultCtor;
  else {
    if (C === null || (typeof C !== 'object' && typeof C !== 'function')) throw new TypeError('RegExp constructor is not an object');
    const speciesKey = typeof Symbol !== 'undefined' ? (Symbol as any).species : undefined;
    const species = speciesKey ? C[speciesKey] : undefined;
    if (species === undefined || species === null) C = defaultCtor;
    else if (typeof species === 'function') C = species;
    else throw new TypeError('RegExp @@species is not a constructor');
  }
  const flags = toStrSplit(rx.flags);
  const unicodeMatching = flags.indexOf('u') !== -1 || flags.indexOf('v') !== -1;
  const splitter = new C(rx, flags.indexOf('y') !== -1 ? flags : flags + 'y');
  const A: string[] = [];
  const lim = limit === undefined ? 4294967295 : limit >>> 0;
  if (lim === 0) return A;
  const size = S.length;
  if (size === 0) {
    if (regExpExecSplit(splitter, S) !== null) return A;
    A[0] = S;
    return A;
  }
  let p = 0;
  let q = 0;
  while (q < size) {
    splitter.lastIndex = q;
    const z = regExpExecSplit(splitter, S);
    let e: number;
    if (z === null || (e = Math.min(toLengthSplit(splitter.lastIndex), size)) === p) {
      q = advanceSplit(S, q, unicodeMatching);
      continue;
    }
    A[A.length] = S.slice(p, q);
    if (A.length === lim) return A;
    p = e;
    const numberOfCaptures = Math.max(toLengthSplit(z.length) - 1, 0);
    for (let i = 1; i <= numberOfCaptures; i++) {
      A[A.length] = z[i];
      if (A.length === lim) return A;
    }
    q = p;
  }
  A[A.length] = S.slice(p, size);
  return A;
};

export const installRegExpSplit = (): void => {
  if (!symbolKeySplit) return;
  try {
    Object.defineProperty(RegExp.prototype, symbolKeySplit, { value: regExpSplit, writable: true, enumerable: false, configurable: true });
    try { Object.defineProperty(regExpSplit, 'name', { value: '[Symbol.split]', configurable: true }); } catch (e) { /* Function#name non-configurable pre-ES6 */ }
    Object.defineProperty(regExpSplit, '__polyfilled', { value: true });
  } catch (e) { /* locked-down RegExp.prototype: the native stays */ }
};
