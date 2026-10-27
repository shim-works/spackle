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

// generic on purpose: the spec reads source then flags off any object, so
// duck-typed regex-likes serialize too
export const regExpToString = function toString(this: any): string {
  if (this === null || (typeof this !== 'object' && typeof this !== 'function')) {
    throw new TypeError('RegExp.prototype.toString called on a non-object');
  }
  // inlined: toStr(this.source), toStr(this.flags) -- String(symbol) returns
  // "Symbol(...)"; the spec throws
  const source = this.source;
  if (typeof source === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const pattern = typeof source === 'string' ? source : String(source);
  const flags = this.flags;
  if (typeof flags === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return '/' + pattern + '/' + (typeof flags === 'string' ? flags : String(flags));
};
