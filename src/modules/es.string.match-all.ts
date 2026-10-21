// String.prototype.matchAll — behavioral, because Chrome 73-79 shipped the
// pre-final draft that quietly accepts a non-global regexp; final ES2020 spec
// makes that a TypeError (silently matching once is never what callers meant).
export const isSupported = (): boolean => {
  try {
    if (typeof String.prototype.matchAll !== "function") {
      return false;
    }
    try {
      // a compliant engine refuses the non-global regexp here
      "".matchAll(/./ as any);
      return false;
    } catch {
      return true;
    }
  } catch {
    return false;
  }
};

export const isStringMatchAllSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.matchall
 * Inspired by: core-js (regexp-string-iterator), lean ES5 rewrite
 */

const returnSelf = function (this: any) {
  return this;
};

// One shared prototype (see es.array.iterator). Lazy, like the spec's
// %RegExpStringIteratorPrototype%: one exec per next().
const MatchIteratorPrototype: any = {};

MatchIteratorPrototype.next = function (this: any): any {
  const rx = this._rx;
  // inlined: DONE()
  if (rx === null) return { value: undefined, done: true };
  const s = this._s;
  // inlined: regExpExec(rx, s)
  let match: any;
  const exec = rx.exec;
  if (typeof exec === "function") {
    match = exec.call(rx, s);
    if (match !== null && typeof match !== "object") {
      throw new TypeError("RegExp exec method returned something other than an Object or null");
    }
  } else {
    match = RegExp.prototype.exec.call(rx, s);
  }
  if (match === null) {
    // Release at exhaustion: the regex and the subject string.
    this._rx = null;
    this._s = null;
    // inlined: DONE()
    return { value: undefined, done: true };
  }
  if (!this._global) {
    // a non-global matcher yields its one match and is done
    this._rx = null;
    this._s = null;
    return { value: match, done: false };
  }
  // a zero-width match never advances lastIndex on its own
  if (String(match[0]) === "") {
    // inlined: toLength(rx.lastIndex)
    let index = +rx.lastIndex;
    index = index !== index || index <= 0 ? 0 : index > 9007199254740991 ? 9007199254740991 : Math.floor(index);
    // inlined: advance(s, index, this._unicode)
    let next = index + 1;
    if (this._unicode && index + 1 < s.length) {
      const first = s.charCodeAt(index);
      if (first >= 0xd800 && first <= 0xdbff) {
        const second = s.charCodeAt(index + 1);
        if (second >= 0xdc00 && second <= 0xdfff) next = index + 2;
      }
    }
    rx.lastIndex = next;
  }
  return { value: match, done: false };
};

if (typeof Symbol !== "undefined" && (Symbol as any).iterator) {
  Object.defineProperty(MatchIteratorPrototype, (Symbol as any).iterator, {
    value: returnSelf,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

const objectToString = Object.prototype.toString;

// ToString: String(symbol) returns "Symbol(...)"; the spec throws a TypeError.
const toStr = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return typeof value === 'string' ? value : String(value);
};

// RegExp.prototype[@@matchAll], inline: no engine this installs on has one.
const regExpMatchAll = (R: any, s: string): any => {
  const Default = (window as any).RegExp;
  // SpeciesConstructor(R, %RegExp%)
  let C: any = R.constructor;
  if (C === undefined) {
    C = Default;
  } else {
    if (C === null || (typeof C !== "object" && typeof C !== "function")) {
      throw new TypeError("RegExp constructor is not an object");
    }
    const speciesKey = typeof Symbol !== "undefined" ? (Symbol as any).species : undefined; // inlined: symbolKey("species")
    const species = speciesKey ? C[speciesKey] : undefined;
    C = species === undefined || species === null ? Default : species;
    if (typeof C !== "function") throw new TypeError("RegExp species is not a constructor");
  }
  const flags = String(R.flags);
  // the default constructor gets the source string: ES5 engines throw on
  // new RegExp(regexp, flags), and the result is the same object either way
  const matcher = C === Default ? new C(R.source, flags) : new C(R, flags);
  // inlined: toLength(R.lastIndex)
  let lastIndex = +R.lastIndex;
  lastIndex = lastIndex !== lastIndex || lastIndex <= 0 ? 0 : lastIndex > 9007199254740991 ? 9007199254740991 : Math.floor(lastIndex);
  matcher.lastIndex = lastIndex;
  const iterator: any = Object.create(MatchIteratorPrototype);
  iterator._rx = matcher;
  iterator._s = s;
  iterator._global = flags.indexOf("g") !== -1;
  iterator._unicode = flags.indexOf("u") !== -1;
  return iterator;
};

export const stringMatchAll = function matchAll(this: any, regexp: any): any {
  if (this === null || this === undefined) {
    throw new TypeError(
      "String.prototype.matchAll called on null or undefined",
    );
  }
  const matchAllKey = typeof Symbol !== "undefined" ? (Symbol as any).matchAll : undefined; // inlined: symbolKey("matchAll")
  if (regexp !== null && regexp !== undefined) {
    // inlined: isRegExp(regexp) -- primitives skip straight past
    let isRegExpValue = false;
    if (typeof regexp === "object" || typeof regexp === "function") {
      const matchKey = typeof Symbol !== "undefined" ? (Symbol as any).match : undefined; // inlined: symbolKey("match")
      const matcher = matchKey ? regexp[matchKey] : undefined;
      isRegExpValue = matcher !== undefined ? !!matcher : objectToString.call(regexp) === "[object RegExp]";
    }
    if (isRegExpValue) {
      const flags = regexp.flags;
      if (flags === null || flags === undefined) {
        throw new TypeError("String.prototype.matchAll called with a RegExp whose flags are null or undefined");
      }
      if (toStr(flags).indexOf("g") === -1) {
        throw new TypeError(
          "String.prototype.matchAll called with a non-global RegExp argument",
        );
      }
    }
    // GetMethod(regexp, @@matchAll)
    const matcher = matchAllKey ? regexp[matchAllKey] : undefined;
    if (matcher !== undefined && matcher !== null) {
      if (typeof matcher !== "function") throw new TypeError("String.prototype.matchAll: @@matchAll is not a function");
      return matcher.call(regexp, this);
    }
    // A real RegExp is spec'd to HAVE @@matchAll (on its prototype); engines
    // without one get that method's steps run directly -- keeping its flags and
    // lastIndex, which RegExpCreate below would discard.
    if (objectToString.call(regexp) === "[object RegExp]" && !(matchAllKey && typeof (RegExp.prototype as any)[matchAllKey] === "function")) {
      return regExpMatchAll(regexp, toStr(this));
    }
  }
  const s = toStr(this);
  // RegExpCreate(regexp, "g"), then Invoke(rx, @@matchAll, S)
  const rx = new ((window as any).RegExp)(regexp === undefined ? "" : regexp, "g");
  const method = matchAllKey ? rx[matchAllKey] : undefined;
  if (typeof method === "function") {
    return method.call(rx, s);
  }
  return regExpMatchAll(rx, s);
};

export const install = (): void => {
  Object.defineProperty(String.prototype, "matchAll", {
    value: stringMatchAll as any,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  try {
    Object.defineProperty(String.prototype.matchAll, "name", {
      value: "matchAll",
      configurable: true,
    });
  } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
  Object.defineProperty(String.prototype.matchAll as any, "__polyfilled", {
    value: true,
  });
};
