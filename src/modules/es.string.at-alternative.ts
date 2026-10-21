export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.at === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.at */
// ToString: String(symbol) returns "Symbol(...)"; the spec throws a TypeError.
const toStr = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return typeof value === 'string' ? value : String(value);
};

export const stringAt = function (this: any, index: number): string | undefined {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.at called on null or undefined');
  }
  const source = toStr(this);
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

