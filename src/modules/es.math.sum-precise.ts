// Existence-only: Math.sumPrecise is absent everywhere on the floor.
export const isSupported = (): boolean => {
  try {
    return typeof (Math as any).sumPrecise === 'function';
  } catch {
    return false;
  }
};

export const isMathSumPreciseSupported = isSupported;

/**
 * Spec: https://tc39.es/proposal-math-sum/
 *
 * Exactly-rounded summation.
 *
 * The obvious approach -- Shewchuk / Neumaier compensated summation -- is wrong
 * here, and wrong in a way that returns NaN rather than merely an imprecise
 * answer: the two-sum step computes `hi = x + y`, and when both operands are
 * near MAX_VALUE that overflows to Infinity, making `lo = y - (hi - x)` come out
 * -Infinity and the next step Infinity + -Infinity = NaN. test262's sum.js is
 * full of such cases, deliberately -- "chosen for having exercised bugs in real
 * implementations".
 *
 * So the sum is accumulated EXACTLY instead, in fixed point. Every finite double
 * is `mantissa * 2^exp` for a 53-bit integer mantissa, and every exponent in the
 * double range lands somewhere in [2^-1074, 2^1024). One fixed-point accumulator
 * spanning that whole range holds any partial sum exactly, cannot overflow, and
 * the single rounding happens once at the very end -- which is what makes the
 * result exactly rounded rather than merely close.
 *
 * Positive and negative terms use separate non-negative accumulators, which
 * keeps borrow bookkeeping out of the hot loop; they are differenced at the end.
 */

// 24-bit limbs: a limb times a 23-bit shift stays under 2^47, so a partial add
// never leaves the exactly-representable integer range of a double.
const LIMB_BITS = 24;
const LIMB_BASE = 16777216; // 2^24
// bit 0 of the accumulator is 2^-1074, the smallest subnormal
const BIAS = 1074;
// enough for 2^1024 plus headroom for carries out of the top
const LIMB_COUNT = 96;

const scratch =
  typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined'
    ? new DataView(new ArrayBuffer(8))
    : null;

const makeAccumulator = (): number[] => {
  const limbs: number[] = [];
  for (let i = 0; i < LIMB_COUNT; i++) limbs.push(0);
  return limbs;
};

/** Carry-propagate so every limb sits back in [0, 2^24). */
const normalize = (limbs: number[]): void => {
  let carry = 0;
  for (let i = 0; i < LIMB_COUNT; i++) {
    const v = limbs[i] + carry;
    const r = v % LIMB_BASE;
    limbs[i] = r;
    carry = (v - r) / LIMB_BASE;
  }
};

/** Add |value| into the accumulator exactly. `value` must be finite and non-zero. */
const addMagnitude = (limbs: number[], value: number): void => {
  scratch!.setFloat64(0, Math.abs(value));
  const hi = scratch!.getUint32(0);
  const lo = scratch!.getUint32(4);
  const biasedExp = (hi >>> 20) & 0x7ff;
  const mantHi = hi & 0xfffff;

  let mantissa: number;
  let exp: number;
  if (biasedExp === 0) {
    mantissa = mantHi * 4294967296 + lo; // subnormal: no implicit leading 1
    exp = -1074;
  } else {
    mantissa = (mantHi + 0x100000) * 4294967296 + lo;
    exp = biasedExp - 1075;
  }
  if (mantissa === 0) return;

  const bit = exp + BIAS; // >= 0 for every finite double
  const limb = Math.floor(bit / LIMB_BITS);
  const shift = bit % LIMB_BITS;
  const scale = Math.pow(2, shift);

  // split the 53-bit mantissa into 24-bit chunks so each chunk * 2^shift stays
  // exactly representable
  const c0 = mantissa % LIMB_BASE;
  const c1 = Math.floor(mantissa / LIMB_BASE) % LIMB_BASE;
  const c2 = Math.floor(mantissa / (LIMB_BASE * LIMB_BASE));

  limbs[limb] += c0 * scale;
  limbs[limb + 1] += c1 * scale;
  if (c2 !== 0) limbs[limb + 2] += c2 * scale;
};

const compare = (a: number[], b: number[]): number => {
  for (let i = LIMB_COUNT - 1; i >= 0; i--) {
    if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
  }
  return 0;
};

/** a -= b, assuming a >= b and both normalized. */
const subtract = (a: number[], b: number[]): void => {
  let borrow = 0;
  for (let i = 0; i < LIMB_COUNT; i++) {
    let v = a[i] - b[i] - borrow;
    if (v < 0) {
      v += LIMB_BASE;
      borrow = 1;
    } else {
      borrow = 0;
    }
    a[i] = v;
  }
};

const bitAt = (limbs: number[], index: number): number => {
  const limb = Math.floor(index / LIMB_BITS);
  if (limb < 0 || limb >= LIMB_COUNT) return 0;
  return Math.floor(limbs[limb] / Math.pow(2, index % LIMB_BITS)) % 2;
};

/**
 * Convert the exact magnitude to the nearest double, ties to even. The ONLY
 * rounding in the algorithm.
 */
const toDouble = (limbs: number[]): number => {
  let top = -1;
  for (let i = LIMB_COUNT - 1; i >= 0 && top < 0; i--) {
    if (limbs[i] !== 0) {
      for (let b = LIMB_BITS - 1; b >= 0; b--) {
        if (bitAt(limbs, i * LIMB_BITS + b)) {
          top = i * LIMB_BITS + b;
          break;
        }
      }
    }
  }
  if (top < 0) return 0;

  // top 53 bits, then one round bit and a sticky OR of everything beneath
  const low = top - 52 > 0 ? top - 52 : 0;
  let mantissa = 0;
  for (let i = top; i >= low; i--) mantissa = mantissa * 2 + bitAt(limbs, i);

  let exp = low - BIAS;
  if (low > 0) {
    const roundBit = bitAt(limbs, low - 1);
    let sticky = 0;
    for (let i = low - 2; i >= 0; i--) {
      if (bitAt(limbs, i)) {
        sticky = 1;
        break;
      }
    }
    if (roundBit === 1 && (sticky === 1 || mantissa % 2 === 1)) {
      mantissa += 1;
      if (mantissa === 9007199254740992) {
        // carried out of 53 bits -- renormalize
        mantissa = 4503599627370496;
        exp += 1;
      }
    }
  }
  // Math.pow overflows to Infinity past the double range, which is exactly the
  // answer the spec wants for a sum that large
  return mantissa * Math.pow(2, exp);
};

export const mathSumPrecise = function (items: any): number {
  if (items === null || items === undefined) {
    throw new TypeError('Math.sumPrecise called on null or undefined');
  }
  const iteratorKey =
    typeof Symbol !== 'undefined' ? (Symbol as any).iterator : undefined;
  if (!iteratorKey || typeof items[iteratorKey] !== 'function') {
    throw new TypeError('Math.sumPrecise argument is not iterable');
  }
  if (!scratch) {
    throw new TypeError('Math.sumPrecise requires DataView');
  }

  const positive = makeAccumulator();
  const negative = makeAccumulator();
  let count = 0;
  let sinceNormalize = 0;
  let sawNaN = false;
  let sawPosInfinity = false;
  let sawNegInfinity = false;
  // -0 survives only if EVERY value was -0 (or there were none at all)
  let allMinusZero = true;

  const iterator = items[iteratorKey]();
  for (;;) {
    const step = iterator.next();
    if (step.done) break;
    const value = step.value;

    if (typeof value !== 'number') {
      // spec closes the iterator before propagating, and must not coerce the
      // offending value -- so no String(value) anywhere in this path
      try {
        const ret = iterator.return;
        if (typeof ret === 'function') ret.call(iterator);
      } catch {
        /* the TypeError below is what matters */
      }
      throw new TypeError('Math.sumPrecise: every element must be a Number');
    }

    count++;
    if (value !== value) {
      sawNaN = true;
      allMinusZero = false;
      continue;
    }
    if (value === Infinity) {
      sawPosInfinity = true;
      allMinusZero = false;
      continue;
    }
    if (value === -Infinity) {
      sawNegInfinity = true;
      allMinusZero = false;
      continue;
    }
    if (value === 0) {
      // +0 breaks the all-minus-zero run; -0 does not
      if (1 / value > 0) allMinusZero = false;
      continue;
    }

    allMinusZero = false;
    addMagnitude(value > 0 ? positive : negative, value);
    // each add can push a limb up by < 2^47, so normalize well before the
    // exact-integer limit at 2^53
    if (++sinceNormalize >= 32) {
      normalize(positive);
      normalize(negative);
      sinceNormalize = 0;
    }
  }

  if (sawNaN) return NaN;
  if (sawPosInfinity && sawNegInfinity) return NaN;
  if (sawPosInfinity) return Infinity;
  if (sawNegInfinity) return -Infinity;
  if (count === 0 || allMinusZero) return -0;

  normalize(positive);
  normalize(negative);

  const order = compare(positive, negative);
  if (order === 0) return 0;
  if (order > 0) {
    subtract(positive, negative);
    return toDouble(positive);
  }
  subtract(negative, positive);
  return -toDouble(negative);
};

if (!isSupported()) {
  Object.defineProperty((Math as any), 'sumPrecise', { value: mathSumPrecise, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((Math as any).sumPrecise, 'name', { value: 'sumPrecise', configurable: true });
  Object.defineProperty((Math as any).sumPrecise, 'length', { value: 1, configurable: true });
  Object.defineProperty((Math as any).sumPrecise, '__polyfilled', { value: true });
}
