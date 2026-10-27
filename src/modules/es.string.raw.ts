export const isSupported = (): boolean => {
  try {
    return typeof String.raw === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.raw */
export const stringRaw = function raw(template: any): string {
  if (template === null || template === undefined) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  const literals = Object(template).raw;
  if (literals === null || literals === undefined) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  const boxed = Object(literals);
  // ToLength, not >>> 0: a length of -1 is 0 here, not 4294967295 segments
  let literalCount = +boxed.length; // +x, not Number(x)
  literalCount = literalCount !== literalCount || literalCount <= 0 ? 0 : literalCount > 9007199254740991 ? 9007199254740991 : Math.floor(literalCount);
  if (literalCount === 0) {
    return '';
  }

  // walk the string chunks; after each one (except the last) drop in the
  // matching substitution, if the caller supplied one
  let result = '';
  const substitutionCount = arguments.length - 1;
  for (let i = 0; ; i++) {
    // inlined: toStr(boxed[i]) -- String(symbol) returns "Symbol(...)"; the spec throws
    const literal = boxed[i];
    if (typeof literal === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
    result += typeof literal === 'string' ? literal : String(literal);
    if (i + 1 === literalCount) {
      return result; // last chunk has no substitution after it
    }
    if (i < substitutionCount) {
      // inlined: toStr(arguments[i + 1])
      const substitution = arguments[i + 1];
      if (typeof substitution === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
      result += typeof substitution === 'string' ? substitution : String(substitution);
    }
  }
};
