// Behavioural: ES5 engines ship a toString that only works on real RegExps;
// ES2015 made it generic (reads source and flags off any object).
export const isSupported = (): boolean => {
  try {
    return (RegExp.prototype.toString as any).call({ source: 'a', flags: 'b' }) === '/a/b';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-regexp.prototype.tostring */

// ToString: String(symbol) returns "Symbol(...)"; the spec throws a TypeError.
const toStr = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return typeof value === 'string' ? value : String(value);
};

// generic on purpose: the spec reads source then flags off any object, so
// duck-typed regex-likes serialize too
export const regExpToString = function toString(this: any): string {
  if (this === null || (typeof this !== 'object' && typeof this !== 'function')) {
    throw new TypeError('RegExp.prototype.toString called on a non-object');
  }
  const pattern = toStr(this.source);
  return '/' + pattern + '/' + toStr(this.flags);
};
