// Authored for spackle (no the prior implementation origin) -- based on core-js (es.parse-int / internals/number-parse-int)

// All valid Unicode whitespace code points (core-js internals/whitespaces),
// built from char codes so the source carries no literal whitespace and this
// island depends on no other polyfill.
const WHITESPACE_CODES = [
  0x0009, 0x000a, 0x000b, 0x000c, 0x000d, 0x0020, 0x00a0, 0x1680, 0x2000, 0x2001,
  0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a, 0x202f,
  0x205f, 0x3000, 0x2028, 0x2029, 0xfeff,
];
let whitespaces = '';
for (let i = 0; i < WHITESPACE_CODES.length; i++) {
  whitespaces += String.fromCharCode(WHITESPACE_CODES[i]);
}

// Capture native BEFORE install so the probe + fallback reference the original.
const nativeParseInt = parseInt;
const trimRegExp = new RegExp('^[' + whitespaces + ']+|[' + whitespaces + ']+$', 'g');
const hexRegExp = /^[+-]?0x/i;

// self-contained trim (don't lean on String.prototype.trim, which may itself be
// a target of another island)
const trim = (value: any): string => String(value).replace(trimRegExp, '');

// Behavioral: parseInt exists everywhere in range, but old engines mis-trim some
// whitespace and mis-detect the 0x prefix. Mirrors core-js's FORCED (inverted):
// a healthy native parses the full whitespace set and the hex prefix correctly.
export const isSupported = (): boolean => {
  try {
    return nativeParseInt(whitespaces + '08') === 8 && nativeParseInt(whitespaces + '0x16') === 22;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-parseint-string-radix
 */
export const numberParseInt = function parseInt(string: any, radix?: any): number {
  const S = trim(string);
  return nativeParseInt(S, (radix >>> 0) || (hexRegExp.test(S) ? 16 : 10));
};

if (!isSupported()) {
  Object.defineProperty((window as any), 'parseInt', { value: numberParseInt, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).parseInt, 'name', { value: 'parseInt', configurable: true });
  Object.defineProperty((window as any).parseInt, '__polyfilled', { value: true });
}
