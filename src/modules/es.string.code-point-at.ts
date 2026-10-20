export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.codePointAt === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.codepointat
 * Inspired by: MDN (surrogate-pair combination)
 */
export const stringCodePointAt = function (this: any, pos: number): number | undefined {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.codePointAt called on null or undefined');
  }
  const source = typeof this === 'string' ? this : String(this); // String() is a call Chrome 41 won't inline; skip it on the primitive path
  const length = source.length;
  let index = +pos; // +x, not Number(x): same coercion, no call
  if (index !== index) {
    index = 0; // NaN → 0
  }
  index = index < 0 ? Math.ceil(index) : Math.floor(index);
  if (index < 0 || index >= length) {
    return undefined;
  }

  const first = source.charCodeAt(index);
  // is `first` the leading half of a pair, with a second half right after it?
  if (first >= 0xd800 && first <= 0xdbff && index + 1 < length) {
    const second = source.charCodeAt(index + 1);
    // is `second` a valid trailing half?
    if (second >= 0xdc00 && second <= 0xdfff) {
      // the magic formula that recombines the two halves into one code point
      return (first - 0xd800) * 0x400 + (second - 0xdc00) + 0x10000;
    }
  }
  return first;
};

