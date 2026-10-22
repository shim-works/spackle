// Math.imul — behavioral, because old WebKit (the Safari 7/8 era) multiplied
// the operands as floats and got the 32-bit wrap wrong on big unsigned values.
export const isSupported = (): boolean => {
  try {
    if (typeof Math.imul !== 'function') {
      return false;
    }
    // 0xffffffff is ToUint32(-1), so the C-style product must wrap to -5
    // core-js's es.math.imul also forces a wrong length (Safari 7.1: 1)
    return Math.imul(0xffffffff, 5) === -5 && Math.imul.length === 2;
  } catch {
    return false;
  }
};

export const isMathImulSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-math.imul
 * Inspired by: MDN / core-js (16-bit half split)
 */
export const mathImul = (a: number, b: number): number => {

  const aHigh = (a >>> 16) & 0xffff;
  const aLow = a & 0xffff;
  const bHigh = (b >>> 16) & 0xffff;
  const bLow = b & 0xffff;

  // keep the low 32 bits; `| 0` wraps
  return (aLow * bLow + (((aHigh * bLow + aLow * bHigh) << 16) >>> 0)) | 0;
};

