export const isSupported = (): boolean => {
  try {
    // core-js: at() indexes code units, not code points
    return typeof String.prototype.at === 'function' && ('\uD842\uDFB7' as any).at(-2) === '\uD842';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.at */
export const stringAt = function (this: any, index: number): string | undefined {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.at called on null or undefined');
  }
  // inlined: toStr(this) -- String(symbol) returns "Symbol(...)"; the spec throws
  if (typeof this === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const source = typeof this === 'string' ? this : String(this);
  const length = source.length;
  let relativeIndex = +index; // +x, not Number(x): same coercion, no call
  if (relativeIndex !== relativeIndex) {
    relativeIndex = 0; // NaN → 0
  }
  relativeIndex = relativeIndex < 0 ? Math.ceil(relativeIndex) : Math.floor(relativeIndex);
  // the whole point of .at over [] is negative indexing: -1 means last char,
  // so a negative index counts back from the end
  const actualIndex = relativeIndex < 0 ? length + relativeIndex : relativeIndex;
  if (actualIndex < 0 || actualIndex >= length) {
    return undefined;
  }
  return source.charAt(actualIndex);
};

