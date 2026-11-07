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
    if (('' as any).replace(probe) !== 7) return false;
    // core-js DELEGATES_TO_EXEC: the RegExp's own @@replace must go through exec
    let execCalled = false;
    const re: any = /a/;
    re.exec = function () {
      execCalled = true;
      return null;
    };
    re[symbol]('');
    if (!execCalled) return false;
    // core-js es.string.replace: named groups from exec reach the template
    // (Chrome < 64), $0 is literal, and an undefined capture isn't substituted
    const named: any = /./;
    named.exec = function () {
      const result: any = [];
      result.groups = { a: '7' };
      return result;
    };
    if (('' as any).replace(named, '$<a>') !== '7') return false;
    return replaceKeeps$0 && !replaceSubstitutesUndefinedCapture;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.replace */

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
  // inlined: toStr(this), toStr(searchValue), toStr(replaceValue) -- String(symbol)
  // returns "Symbol(...)"; the spec throws
  if (typeof this === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const string = typeof this === 'string' ? this : String(this);
  if (typeof searchValue === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const searchString = typeof searchValue === 'string' ? searchValue : String(searchValue);
  if (typeof replaceValue === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return (nativeReplace as any).call(string, searchString, typeof replaceValue === 'function' || typeof replaceValue === 'string' ? replaceValue : String(replaceValue));
};

/*
 * RegExp.prototype[@@replace] (core-js fix-regexp-well-known-symbol-logic): installed
 * with String.prototype.replace wherever the gate above fails. A regexp whose exec
 * is untouched goes straight to the engine; only an overridden exec (or a
 * sticky-emulated instance) takes the spec algorithm, which calls exec.
 */
const regExpExecAtLoad = RegExp.prototype.exec;
const objectToStringR = Object.prototype.toString;
const symbolKeyReplace: any = typeof Symbol !== 'undefined' ? (Symbol as any).replace : undefined;
// the engine's own @@replace, when it has one (Chrome 50+, Safari 10+)
const nativeRegExpReplace: any = symbolKeyReplace ? (RegExp.prototype as any)[symbolKeyReplace] : undefined;

// ToString: String(symbol) returns "Symbol(...)"; the spec throws
const toStrReplace = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return typeof value === 'string' ? value : String(value);
};

// RegExpExec: a callable exec wins and must return an object or null
const regExpExecReplace = (R: any, S: string): any => {
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

const toLengthReplace = (value: any): number => {
  let n = +value; // +x, not Number(x)
  n = n !== n || n <= 0 ? 0 : Math.floor(n);
  return n > 9007199254740991 ? 9007199254740991 : n;
};

// AdvanceStringIndex: a surrogate pair is one step under u / v
const advanceReplace = (S: string, index: number, unicode: boolean): number => {
  if (!unicode || index + 1 >= S.length) return index + 1;
  const c = S.charCodeAt(index);
  if (c < 0xd800 || c > 0xdbff) return index + 1;
  const d = S.charCodeAt(index + 1);
  return d < 0xdc00 || d > 0xdfff ? index + 1 : index + 2;
};

// core-js's replace probes, at load: they decide which templates the engine may expand
const replaceKeeps$0 = 'a'.replace(/./, '$0') === '$0';
const replaceSubstitutesUndefinedCapture = (function () {
  try {
    return nativeRegExpReplace ? nativeRegExpReplace.call(/./, 'a', '$0') === '' : false;
  } catch (e) {
    return false;
  }
})();
const unsafeSubstitute = replaceSubstitutesUndefinedCapture ? '$' : '$0';

// GetSubstitution (core-js get-substitution): $$ $& $` $' $n $nn $<name>
// \x60 is the backtick, spelt out: the ES5 output check reads a bare one as a template
const substitutionWithNames = /\$([$&'\x60]|\d{1,2}|<[^>]*>)/g;
const substitutionNoNames = /\$([$&'\x60]|\d{1,2})/g;
const getSubstitution = (matched: string, str: string, position: number, captures: any[], namedCaptures: any, replacement: string): string => {
  const tailPos = position + matched.length;
  const m = captures.length;
  const symbols = namedCaptures === undefined ? substitutionNoNames : substitutionWithNames;
  return (nativeReplace as any).call(replacement, symbols, function (match: string, ch: string): string {
    let capture: any;
    switch (ch.charAt(0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return str.slice(0, position);
      case "'": return str.slice(tailPos);
      case '<':
        capture = namedCaptures[ch.slice(1, -1)];
        break;
      default: {
        const n = +ch;
        if (n === 0) return match;
        if (n > m) {
          const f = Math.floor(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
          return match;
        }
        capture = captures[n - 1];
      }
    }
    return capture === undefined ? '' : capture;
  });
};

export const regExpReplace = function (this: any, string: any, replaceValue: any): any {
  const rx = this;
  if (rx === null || (typeof rx !== 'object' && typeof rx !== 'function')) {
    throw new TypeError('RegExp.prototype[@@replace] called on a non-object');
  }
  // inlined: toStrReplace(string)
  if (typeof string === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const S = typeof string === 'string' ? string : String(string);
  // The engine, unless the template needs what it gets wrong ($0, $<name>).
  // A function replacer is safe here too: without an overridden exec there are
  // no groups for the engine to drop (core-js routes it through JS regardless).
  // inlined: execUntouchedReplace(rx)
  const exec = rx.exec;
  if ((exec === regExpExecAtLoad || exec === RegExp.prototype.exec) && (typeof replaceValue === 'function' ||
      (typeof replaceValue === 'string' && replaceValue.indexOf(unsafeSubstitute) === -1 && replaceValue.indexOf('$<') === -1))) {
    return nativeRegExpReplace ? nativeRegExpReplace.call(rx, S, replaceValue) : (nativeReplace as any).call(S, rx, replaceValue);
  }
  const lengthS = S.length;
  const functionalReplace = typeof replaceValue === 'function';
  if (!functionalReplace) replaceValue = toStrReplace(replaceValue);
  const flags = toStrReplace(rx.flags);
  const global = flags.indexOf('g') !== -1;
  let fullUnicode = false;
  if (global) {
    fullUnicode = flags.indexOf('u') !== -1 || flags.indexOf('v') !== -1;
    rx.lastIndex = 0;
  }
  const results: any[] = [];
  for (;;) {
    const result = regExpExecReplace(rx, S);
    if (result === null) break;
    results[results.length] = result;
    if (!global) break;
    if (toStrReplace(result[0]) === '') rx.lastIndex = advanceReplace(S, toLengthReplace(rx.lastIndex), fullUnicode);
  }
  let accumulated = '';
  let nextSourcePosition = 0;
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const resultLength = toLengthReplace(result.length);
    const matched = toStrReplace(result[0]);
    let position = +result.index;
    position = position !== position ? 0 : position < 0 ? Math.ceil(position) : Math.floor(position);
    position = position < 0 ? 0 : position > lengthS ? lengthS : position;
    const captures: any[] = [];
    for (let n = 1; n < resultLength; n++) {
      const capN = result[n];
      captures[n - 1] = capN === undefined ? undefined : toStrReplace(capN);
    }
    let namedCaptures = result.groups;
    let replacement: string;
    if (functionalReplace) {
      const args: any[] = ([matched] as any[]).concat(captures, [position, S]);
      if (namedCaptures !== undefined) args[args.length] = namedCaptures;
      replacement = toStrReplace(replaceValue.apply(undefined, args));
    } else {
      if (namedCaptures !== undefined) {
        if (namedCaptures === null) throw new TypeError('Cannot convert undefined or null to object');
        namedCaptures = Object(namedCaptures);
      }
      replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
    }
    if (position >= nextSourcePosition) {
      accumulated += S.slice(nextSourcePosition, position) + replacement;
      nextSourcePosition = position + matched.length;
    }
  }
  return nextSourcePosition >= lengthS ? accumulated : accumulated + S.slice(nextSourcePosition);
};

export const installRegExpReplace = (): void => {
  if (!symbolKeyReplace) return;
  try {
    Object.defineProperty(RegExp.prototype, symbolKeyReplace, { value: regExpReplace, writable: true, enumerable: false, configurable: true });
    try { Object.defineProperty(regExpReplace, 'name', { value: '[Symbol.replace]', configurable: true }); } catch (e) { /* Function#name non-configurable pre-ES6 */ }
    Object.defineProperty(regExpReplace, '__polyfilled', { value: true });
  } catch (e) { /* locked-down RegExp.prototype: the native stays */ }
};
