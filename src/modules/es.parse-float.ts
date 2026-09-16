// Authored for spackle (no the prior implementation origin) -- based on core-js (es.parse-float / internals/number-parse-float)

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

const nativeParseFloat = parseFloat;
const trimRegExp = new RegExp('^[' + whitespaces + ']+|[' + whitespaces + ']+$', 'g');

const trim = (value: any): string => String(value).replace(trimRegExp, '');

// Behavioral: parseFloat exists in range, but old engines mis-trim some
// whitespace and lose the sign on `-0`. Mirrors core-js's FORCED (inverted): a
// healthy native returns -Infinity for `1 / parseFloat(ws + '-0')`.
export const isSupported = (): boolean => {
  try {
    return 1 / nativeParseFloat(whitespaces + '-0') === -Infinity;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-parsefloat-string
 */
export const numberParseFloat = function parseFloat(string: any): number {
  const trimmed = trim(string);
  const result = nativeParseFloat(trimmed);
  // preserve the -0 the native drops when the input is a signed whitespace-y zero
  return result === 0 && trimmed.charAt(0) === '-' ? -0 : result;
};

if (!isSupported()) {
  Object.defineProperty((window as any), 'parseFloat', { value: numberParseFloat, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).parseFloat, 'name', { value: 'parseFloat', configurable: true });
  Object.defineProperty((window as any).parseFloat, '__polyfilled', { value: true });
}
