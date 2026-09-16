/**
 * Spec: https://tc39.es/proposal-float16array/
 *
 * Shared by es.math.f16round, es.data-view.get-float16 and
 * es.data-view.set-float16 -- one encoder/decoder, three ids. Stateless.
 *
 * IEEE 754 binary16: 1 sign bit, 5 exponent bits, 10 mantissa bits.
 * Bias 15, max finite 65504, smallest normal 2^-14, smallest subnormal 2^-24.
 */

// Scratch buffer for reinterpreting a double's bits. Allocated once at module
// scope -- these conversions are hot and per-call allocation would show up.
const scratch =
  typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined'
    ? new DataView(new ArrayBuffer(8))
    : null;

export const isSupported = (): boolean => {
  try {
    return (
      typeof (Math as any).f16round === 'function' &&
      typeof DataView !== 'undefined' &&
      typeof (DataView.prototype as any).getFloat16 === 'function' &&
      typeof (DataView.prototype as any).setFloat16 === 'function'
    );
  } catch {
    return false;
  }
};

export const isFloat16Supported = isSupported;

/** Encode a double as the 16 bits of its nearest binary16 value. */
export const doubleToFloat16Bits = (value: any): number => {
  const n = Number(value);

  if (n !== n) return 0x7e00; // NaN -> canonical quiet NaN
  if (n === Infinity) return 0x7c00;
  if (n === -Infinity) return 0xfc00;
  if (n === 0) {
    // preserve the sign of zero: 1/-0 is -Infinity
    return 1 / n === -Infinity ? 0x8000 : 0x0000;
  }

  const sign = n < 0 || (n === 0 && 1 / n < 0) ? 0x8000 : 0;
  const magnitude = Math.abs(n);

  // Overflow: anything at or past the halfway point to 65536 rounds to Inf.
  if (magnitude >= 65520) {
    return sign | 0x7c00;
  }
  // Underflow past the smallest subnormal (2^-24), with round-to-even at half.
  if (magnitude < 5.960464477539063e-8 / 2) {
    return sign;
  }

  // Subnormal range: below the smallest normal (2^-14).
  if (magnitude < 6.103515625e-5) {
    const scaled = magnitude / 5.960464477539063e-8; // in units of 2^-24
    const rounded = roundTiesToEven(scaled);
    return sign | rounded;
  }

  let exponent = Math.floor(Math.log(magnitude) / Math.LN2);
  // log is imprecise at the boundaries -- correct by comparison
  if (magnitude < Math.pow(2, exponent)) exponent--;
  if (magnitude >= Math.pow(2, exponent + 1)) exponent++;

  const mantissa = magnitude / Math.pow(2, exponent) - 1; // [0, 1)
  let mantissaBits = roundTiesToEven(mantissa * 1024);
  if (mantissaBits === 1024) {
    // rounding carried into the exponent
    mantissaBits = 0;
    exponent++;
    if (exponent > 15) return sign | 0x7c00;
  }
  return sign | ((exponent + 15) << 10) | mantissaBits;
};

// Round half to even, the IEEE default. Math.round breaks ties upward.
const roundTiesToEven = (value: number): number => {
  const floor = Math.floor(value);
  const fraction = value - floor;
  if (fraction < 0.5) return floor;
  if (fraction > 0.5) return floor + 1;
  return floor % 2 === 0 ? floor : floor + 1;
};

/** Decode 16 binary16 bits back into a double. */
export const float16BitsToDouble = (bits: number): number => {
  const sign = bits & 0x8000 ? -1 : 1;
  const exponent = (bits >> 10) & 0x1f;
  const mantissa = bits & 0x3ff;

  if (exponent === 0) {
    // zero or subnormal
    return mantissa === 0 ? sign * 0 : sign * mantissa * 5.960464477539063e-8;
  }
  if (exponent === 0x1f) {
    return mantissa === 0 ? sign * Infinity : NaN;
  }
  return sign * Math.pow(2, exponent - 15) * (1 + mantissa / 1024);
};

/**
 * Spec: https://tc39.es/proposal-float16array/#sec-math.f16round
 */
export const mathF16round = function (value: any): number {
  const n = Number(value);
  if (n !== n) return NaN;
  if (n === 0 || n === Infinity || n === -Infinity) return n;
  return float16BitsToDouble(doubleToFloat16Bits(n));
};

/**
 * Spec: https://tc39.es/proposal-float16array/#sec-dataview.prototype.getfloat16
 */
export const dataViewGetFloat16 = function (
  this: any,
  byteOffset: any,
  littleEndian?: any
): number {
  return float16BitsToDouble(this.getUint16(byteOffset, !!littleEndian));
};

/**
 * Spec: https://tc39.es/proposal-float16array/#sec-dataview.prototype.setfloat16
 */
export const dataViewSetFloat16 = function (
  this: any,
  byteOffset: any,
  value: any,
  littleEndian?: any
): void {
  this.setUint16(byteOffset, doubleToFloat16Bits(value), !!littleEndian);
};

if (!isSupported() && scratch) {
  if (typeof (Math as any).f16round !== 'function') {
    Object.defineProperty((Math as any), 'f16round', { value: mathF16round, writable: true, enumerable: false, configurable: true });
    Object.defineProperty((Math as any).f16round, 'name', { value: 'f16round', configurable: true });
    Object.defineProperty((Math as any).f16round, '__polyfilled', { value: true });
  }
  if (typeof DataView !== 'undefined' && DataView.prototype) {
    if (typeof (DataView.prototype as any).getFloat16 !== 'function') {
      Object.defineProperty((DataView.prototype as any), 'getFloat16', { value: dataViewGetFloat16, writable: true, enumerable: false, configurable: true });
      Object.defineProperty((DataView.prototype as any).getFloat16, 'name', { value: 'getFloat16', configurable: true });
      Object.defineProperty((DataView.prototype as any).getFloat16, '__polyfilled', {
        value: true,
      });
    }
    if (typeof (DataView.prototype as any).setFloat16 !== 'function') {
      Object.defineProperty((DataView.prototype as any), 'setFloat16', { value: dataViewSetFloat16, writable: true, enumerable: false, configurable: true });
      Object.defineProperty((DataView.prototype as any).setFloat16, 'name', { value: 'setFloat16', configurable: true });
      Object.defineProperty((DataView.prototype as any).setFloat16, '__polyfilled', {
        value: true,
      });
    }
  }
}
