// Ported from: the prior implementation (string-from-code-point.ts + is-string-from-code-point-supported.ts)

// String.fromCodePoint — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken fromCodePoint, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof String.fromCodePoint === 'function';
  } catch {
    return false;
  }
};

export const isStringFromCodePointSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-string.fromcodepoint
 * GC: single parts array, single joined string.
 */
export const stringFromCodePoint = (...codePoints: number[]): string => {
  const parts: string[] = [];
  for (let i = 0; i < codePoints.length; i++) {
    let codePoint = Number(codePoints[i]);
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

if (!isSupported()) {
  Object.defineProperty(String, 'fromCodePoint', { value: stringFromCodePoint as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.fromCodePoint, 'name', { value: 'fromCodePoint', configurable: true });
  Object.defineProperty((String.fromCodePoint as any), '__polyfilled', { value: true });
}
