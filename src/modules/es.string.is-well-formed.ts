export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.isWellFormed === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.iswellformed */
// ToString: String(symbol) returns "Symbol(...)"; the spec throws a TypeError.
const toStr = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return typeof value === 'string' ? value : String(value);
};

export const stringIsWellFormed = function (this: any): boolean {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.isWellFormed called on null or undefined');
  }
  const str = toStr(this);
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // lone low surrogate — a paired one would've been consumed below
    if (code >= 0xdc00 && code <= 0xdfff) {
      return false;
    }
    if (code >= 0xd800 && code <= 0xdbff) {
      // high surrogate must be followed by a low one
      const next = str.charCodeAt(i + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) {
        return false;
      }
      i++; // skip the low half of the pair
    }
  }
  return true;
};

