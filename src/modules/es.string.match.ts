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
    if (('' as any).match(probe) !== 7) return false;
    // core-js DELEGATES_TO_EXEC: the RegExp's own @@match must go through exec
    // (Chrome 50's doesn't, and its native match reads @@match off primitives)
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

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.match */

const nativeMatch = String.prototype.match;
const objectToStringS = Object.prototype.toString;

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
  // RegExpCreate(ToString(matcher)) for anything @@match didn't take: a primitive
  // (the native reads @@match off its prototype on Chrome 50) or an object whose
  // @@match is null. A real RegExp goes as it is: no copy per call.
  if (matcher === null || (typeof matcher !== 'object' && typeof matcher !== 'function') || objectToStringS.call(matcher) !== '[object RegExp]') {
    if (typeof matcher === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
    matcher = new RegExp(matcher === undefined ? '' : String(matcher));
  }
  return nativeMatch.call(this, matcher);
};

/*
 * RegExp.prototype[@@match] (core-js fix-regexp-well-known-symbol-logic): installed
 * with String.prototype.match wherever the gate above fails. A regexp whose exec
 * is untouched goes straight to the engine; only an overridden exec (or a
 * sticky-emulated instance) takes the spec algorithm, which calls exec.
 */
const regExpExecAtLoad = RegExp.prototype.exec;
const objectToStringR = Object.prototype.toString;
const symbolKeyMatch: any = typeof Symbol !== 'undefined' ? (Symbol as any).match : undefined;
// the engine's own @@match, when it has one (Chrome 50+, Safari 10+)
const nativeRegExpMatch: any = symbolKeyMatch ? (RegExp.prototype as any)[symbolKeyMatch] : undefined;

// ToString: String(symbol) returns "Symbol(...)"; the spec throws
const toStrMatch = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return typeof value === 'string' ? value : String(value);
};

// RegExpExec: a callable exec wins and must return an object or null
const regExpExecMatch = (R: any, S: string): any => {
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

export const regExpMatch = function (this: any, string: any): any {
  const rx = this;
  if (rx === null || (typeof rx !== 'object' && typeof rx !== 'function')) {
    throw new TypeError('RegExp.prototype[@@match] called on a non-object');
  }
  // inlined: toStrMatch(string)
  if (typeof string === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const S = typeof string === 'string' ? string : String(string);
  // inlined: execUntouchedMatch(rx)
  const exec = rx.exec;
  if (exec === regExpExecAtLoad || exec === RegExp.prototype.exec) {
    return nativeRegExpMatch ? nativeRegExpMatch.call(rx, S) : nativeMatch.call(S, rx);
  }
  const flags = toStrMatch(rx.flags);
  if (flags.indexOf('g') === -1) return regExpExecMatch(rx, S);
  const fullUnicode = flags.indexOf('u') !== -1 || flags.indexOf('v') !== -1;
  rx.lastIndex = 0;
  const A: string[] = [];
  let n = 0;
  for (;;) {
    const result = regExpExecMatch(rx, S);
    if (result === null) return n === 0 ? null : A;
    const matchStr = toStrMatch(result[0]);
    A[n++] = matchStr;
    if (matchStr === '') {
      // inlined: toLengthMatch(rx.lastIndex)
      let thisIndex = +rx.lastIndex; // +x, not Number(x)
      thisIndex = thisIndex !== thisIndex || thisIndex <= 0 ? 0 : Math.floor(thisIndex);
      if (thisIndex > 9007199254740991) {
        thisIndex = 9007199254740991;
      }
      // inlined: advanceMatch(S, thisIndex, fullUnicode) -- a surrogate pair is one step under u / v
      let nextIndex = thisIndex + 1;
      if (fullUnicode && thisIndex + 1 < S.length) {
        const c = S.charCodeAt(thisIndex);
        if (c >= 0xd800 && c <= 0xdbff) {
          const d = S.charCodeAt(thisIndex + 1);
          if (d >= 0xdc00 && d <= 0xdfff) {
            nextIndex = thisIndex + 2;
          }
        }
      }
      rx.lastIndex = nextIndex;
    }
  }
};

export const installRegExpMatch = (): void => {
  if (!symbolKeyMatch) return;
  try {
    Object.defineProperty(RegExp.prototype, symbolKeyMatch, { value: regExpMatch, writable: true, enumerable: false, configurable: true });
    try { Object.defineProperty(regExpMatch, 'name', { value: '[Symbol.match]', configurable: true }); } catch (e) { /* Function#name non-configurable pre-ES6 */ }
    Object.defineProperty(regExpMatch, '__polyfilled', { value: true });
  } catch (e) { /* locked-down RegExp.prototype: the native stays */ }
};
