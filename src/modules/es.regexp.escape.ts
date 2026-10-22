export const isSupported = (): boolean => {
  try {
    // core-js: a leading ASCII letter is hex-escaped
    return typeof RegExp.escape === 'function' && (RegExp as any).escape('ab') === '\\x61b';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-regexp.escape */

// Regex syntax characters plus '/' — these get a plain backslash.
const SYNTAX_CHARS = '^$\\.*+?()[]{}|/';

// Punctuators the spec hex-escapes so escaped text can't splice into a
// surrounding pattern (char class ranges, lookbehind arrows, comments, etc).
const OTHER_PUNCTUATORS = ",-=<>#&!%:;@~'`\"";

export const regExpEscape = (str: any): string => {
  // spec takes strings only — no coercion
  if (typeof str !== 'string') {
    throw new TypeError('RegExp.escape requires a string');
  }
  let out = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str.charAt(i);
    const code = str.charCodeAt(i);
    // every hex-escaping branch sets this; the escape itself is written once below
    let hex = false;
    // a leading ASCII letter/digit is hex-escaped so the result can't fuse
    // with what precedes it (e.g. "\1" + escaped "23" must not read as \123)
    if (
      i === 0 &&
      ((code >= 0x30 && code <= 0x39) || // 0-9
        (code >= 0x41 && code <= 0x5a) || // A-Z
        (code >= 0x61 && code <= 0x7a)) // a-z
    ) {
      hex = true;
    } else if (SYNTAX_CHARS.indexOf(ch) !== -1) {
      out += '\\' + ch;
    } else if (code >= 0x09 && code <= 0x0d) {
      // ControlEscape: \t \n \v \f \r, not \x09..\x0d
      out += '\\' + 'tnvfr'.charAt(code - 0x09);
    } else if (
      OTHER_PUNCTUATORS.indexOf(ch) !== -1 ||
      // inlined: isWhiteSpaceOrLineTerminator(code)
      (code >= 0x09 && code <= 0x0d) || // tab, LF, VT, FF, CR
      code === 0x20 ||
      code === 0xa0 ||
      code === 0x1680 ||
      (code >= 0x2000 && code <= 0x200a) ||
      code === 0x2028 ||
      code === 0x2029 ||
      code === 0x202f ||
      code === 0x205f ||
      code === 0x3000 ||
      code === 0xfeff
    ) {
      hex = true;
    } else if (code >= 0xd800 && code <= 0xdbff) {
      // high surrogate: an intact pair is one code point — passes verbatim;
      // a lone half gets escaped
      const next = str.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        out += ch + str.charAt(i + 1);
        i++;
      } else {
        hex = true;
      }
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      // lone low surrogate — a paired one was consumed above
      hex = true;
    } else {
      out += ch;
    }
    if (hex) {
      // inlined: hexEscape(code) -- \xHH up to 0xff, \uHHHH above
      const digits = code.toString(16);
      if (code <= 0xff) {
        out += '\\x' + (digits.length < 2 ? '0' + digits : digits);
      } else {
        let padded = digits;
        while (padded.length < 4) padded = '0' + padded;
        out += '\\u' + padded;
      }
    }
  }
  return out;
};

