// core-js's whitespaces list and its string-trim-forced probe: a native must
// strip all of these, none of U+200B, U+0085, U+180E (engines on Unicode before
// 6.3 strip U+180E), and carry its own name.
const WHITESPACE = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';
const NON = '\u200B\u0085\u180E';

export const isSupported = (): boolean => {
  try {
    const fn: any = (String.prototype as any).trimEnd;
    if (typeof fn !== 'function') return false;
    if (fn.call(WHITESPACE) !== '' || fn.call(NON) !== NON) return false;
    return typeof fn.name !== 'string' || fn.name === 'trimEnd';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.trimend */
// A code-unit scan rather than core-js's regexes: same result, no backtracking
// on interior whitespace runs, and no new string when there is nothing to trim.
export const stringTrimEnd = function (this: any): string {
  // RequireObjectCoercible + ToString(this): `this` can be any value.
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.trimEnd called on null or undefined');
  }
  // inlined: toStr(this) -- String(symbol) returns "Symbol(...)"; the spec throws
  if (typeof this === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const s: string = typeof this === 'string' ? this : String(this);
  let start = 0;
  let end = s.length;
  while (end > start) {
    const c = s.charCodeAt(end - 1);
    // inlined: isWhite(c) -- WHITESPACE by code unit; ASCII answers in two comparisons
    if (!(c <= 32 ? c === 32 || (c >= 9 && c <= 13) : c >= 0xa0 && (c === 0xa0 || c === 0x1680 || (c >= 0x2000 && c <= 0x200a) || c === 0x2028 || c === 0x2029 || c === 0x202f || c === 0x205f || c === 0x3000 || c === 0xfeff))) break;
    end--;
  }
  return start === 0 && end === s.length ? s : s.slice(start, end);
};
