// String.fromCodePoint: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    // core-js INCORRECT_LENGTH
    return typeof String.fromCodePoint === 'function' && String.fromCodePoint.length === 1;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-string.fromcodepoint
 *
 * `arguments`, not a rest parameter (an array per call); the unread parameter
 * keeps String.fromCodePoint.length at 1.
 */
export const stringFromCodePoint = function (_codePoint?: number): string {
  const parts: string[] = [];
  for (let i = 0; i < arguments.length; i++) {
    let codePoint = +arguments[i]; // +x, not Number(x): same coercion, no call
    // must be a whole number in the valid Unicode range, else it's garbage
    if (codePoint < 0 || codePoint > 0x10ffff || codePoint !== (codePoint | 0)) {
      throw new RangeError(`Invalid code point: ${codePoint}`);
    }
    if (codePoint > 0xffff) {
      // above the basic plane: split into a high + low surrogate pair
      codePoint -= 0x10000;
      parts[parts.length] = String.fromCharCode(
        (codePoint >> 10) + 0xd800, // high surrogate = top 10 bits
        (codePoint & 0x3ff) + 0xdc00 // low surrogate = bottom 10 bits
      );
    } else {
      // fits in one code unit — fromCharCode handles it directly
      parts[parts.length] = String.fromCharCode(codePoint);
    }
  }
  return parts.join('');
};

