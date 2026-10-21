export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.trimEnd === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.trimend */
// ToString: String(symbol) returns "Symbol(...)"; the spec throws a TypeError.
const toStr = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return typeof value === 'string' ? value : String(value);
};

export const stringTrimEnd = function (this: any): string {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.trimEnd called on null or undefined');
  }
  return (toStr(this)).replace(/\s+$/, '');
};

