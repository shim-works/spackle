// Ported from: the prior implementation (array-fill.ts + is-array-fill-supported.ts)

// Array.prototype.fill — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken fill, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.fill === 'function';
  } catch {
    return false;
  }
};

export const isArrayFillSupported = isSupported;

/* eslint-disable no-undefined */
/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.fill
 */

// ToLength: clamp a .length value to a valid array length [0, 2^53 - 1].
// Non-numbers and NaN become 0; negatives become 0; fractions are floored.
const MAX_SAFE_LENGTH = 9007199254740991; // 2^53 - 1
const toLength = (value: any): number => {
  const numeric = Number(value);
  if (isNaN(numeric) || numeric <= 0) {
    return 0;
  }
  if (numeric > MAX_SAFE_LENGTH) {
    return MAX_SAFE_LENGTH;
  }
  return Math.floor(numeric);
};

// ToInteger: NaN -> 0; +/-Infinity preserved; otherwise truncate toward zero.
// (Note: `x >> 0` would be wrong here — it is an int32 op that turns Infinity
// into 0 and wraps indices above 2^31.)
const toInteger = (value: any): number => {
  const numeric = Number(value);
  if (isNaN(numeric)) {
    return 0;
  }
  if (numeric === Infinity || numeric === -Infinity) {
    return numeric;
  }
  if (numeric < 0) {
    return Math.ceil(numeric);
  }
  return Math.floor(numeric);
};

// Resolve a relative index (start/end) against length: negatives count from the
// end, then clamp into [0, length].
const resolveIndex = (relative: number, length: number): number => {
  let index = relative;
  if (relative < 0) {
    index = length + relative;
  }
  if (index < 0) {
    return 0;
  }
  if (index > length) {
    return length;
  }
  return index;
};

export const arrayFill = function <T>(
  this: T[],
  value: T,
  start?: number,
  end?: number,
): T[] {
  const length = toLength(this.length);

  const from = resolveIndex(start === undefined ? 0 : toInteger(start), length);
  const to = resolveIndex(end === undefined ? length : toInteger(end), length);

  for (let i = from; i < to; i++) {
    this[i] = value;
  }
  return this;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'fill', { value: arrayFill as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.fill, 'name', { value: 'fill', configurable: true });
  Object.defineProperty((Array.prototype.fill as any), '__polyfilled', { value: true });
}
