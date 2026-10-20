export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.toWellFormed === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.towellformed */
export const stringToWellFormed = function (this: any): string {
  const str = typeof this === 'string' ? this : String(this); // String() is a call Chrome 41 won't inline; skip it on the primitive path
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

