export const isSupported = (): boolean => {
  try {
    // core-js TO_STRING_CONVERSION_BUG: a primitive this is converted to a string
    return typeof String.prototype.toWellFormed === 'function' && (String.prototype.toWellFormed as any).call(1) === '1';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.towellformed */
// ToString: String(symbol) returns "Symbol(...)"; the spec throws a TypeError.
const toStr = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return typeof value === 'string' ? value : String(value);
};

export const stringToWellFormed = function (this: any): string {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.toWellFormed called on null or undefined');
  }
  const str = toStr(this);
  let out = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 0xdc00 && code <= 0xdfff) {
      // lone low surrogate — a paired one would've been consumed below
      out += '�';
    } else if (code >= 0xd800 && code <= 0xdbff) {
      const next = str.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        // intact pair — copy both halves through
        out += str.charAt(i) + str.charAt(i + 1);
        i++;
      } else {
        out += '�';
      }
    } else {
      out += str.charAt(i);
    }
  }
  return out;
};

