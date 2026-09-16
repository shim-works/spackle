// Ported from: the prior implementation (math-imul.ts + is-math-imul-supported.ts)

// Math.imul — behavioral, because old WebKit (the Safari 7/8 era) multiplied
// the operands as floats and got the 32-bit wrap wrong on big unsigned values.
export const isSupported = (): boolean => {
  try {
    if (typeof Math.imul !== 'function') {
      return false;
    }
    // 0xffffffff is ToUint32(-1), so the C-style product must wrap to -5
    return Math.imul(0xffffffff, 5) === -5;
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
  // Why bother? JS only does math safely up to ~16 digits. Multiplying two big
  // 32-bit numbers can blow past that and give a slightly-wrong answer. So
  // instead of multiplying them whole, we chop each number into two smaller
  // pieces, multiply the pieces (small = always safe), then glue back together.

  // chop each number in half: "High" = top digits, "Low" = bottom digits
  const aHigh = (a >>> 16) & 0xffff;
  const aLow = a & 0xffff;
  const bHigh = (b >>> 16) & 0xffff;
  const bLow = b & 0xffff;

  // multiply the small pieces and add them back up. we only keep the bottom
  // 32 bits of the answer (that's what imul is for) — the `| 0` at the end
  // chops off anything that spilled over the top, which is exactly what we want.
  return (aLow * bLow + (((aHigh * bLow + aLow * bHigh) << 16) >>> 0)) | 0;
};

if (!isSupported()) {
  Object.defineProperty(Math, 'imul', { value: mathImul as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Math.imul, 'name', { value: 'imul', configurable: true });
  Object.defineProperty((Math.imul as any), '__polyfilled', { value: true });
}
