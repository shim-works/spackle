export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.isWellFormed === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.iswellformed */
export const stringIsWellFormed = function (this: any): boolean {
  const str = typeof this === 'string' ? this : String(this); // String() is a call Chrome 41 won't inline; skip it on the primitive path
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

