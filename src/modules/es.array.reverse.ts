// Based on core-js (es.array.reverse)
const nativeReverse = Array.prototype.reverse;

// Safari 12.0 (webkit #188794) mis-reverses certain arrays: reversing [1,2]
// must actually change its string form (core-js's FORCED, inverted).
const reversesCorrectly = (): boolean => {
  try {
    const test = [1, 2];
    return String(test) !== String((test as any).reverse());
  } catch {
    return false;
  }
};
const SAFARI_12_BUG = typeof nativeReverse === 'function' && !reversesCorrectly();

const STOP = {};

export const isSupported = (): boolean => {
  try {
    if (typeof nativeReverse !== 'function' || SAFARI_12_BUG) return false;
    // ToLength, not ToUint32 (Chrome < 45): a 32-bit native reads this length as
    // 1 and swaps nothing, where on a huge real length it would walk ~2^31 pairs
    // (the Chrome 38 hang). A ToLength native reads index 0 first, whose getter
    // throws, so the probe ends at once on both.
    const o: any = { length: 4294967297 };
    Object.defineProperty(o, 0, { get: function () { throw STOP; }, configurable: true });
    try {
      (nativeReverse as any).call(o);
      return false;
    } catch (e) {
      return e === STOP;
    }
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.reverse */
export const arrayReverse = function reverse(this: any): any {
  // inlined: ToObject(this)
  if (this === null || this === undefined) throw new TypeError('Array.prototype.reverse called on null or undefined');
  const O = Object(this);
  // A real array's length is below 2^32, so ToUint32 and ToLength agree: the
  // native stays the fast path, and only array-likes take the spec loop.
  if (Array.isArray(O)) {
    // touching .length normalizes the holey/packed state Safari 12 got wrong
    if (SAFARI_12_BUG) O.length = O.length;
    return (nativeReverse as any).call(O);
  }
  // inlined: ToLength(Get(O, "length"))
  let len = +O.length;
  len = len !== len || len <= 0 ? 0 : len > 9007199254740991 ? 9007199254740991 : Math.floor(len);
  const middle = Math.floor(len / 2);
  // Set and DeletePropertyOrThrow throw on failure: this module is strict.
  for (let lower = 0; lower !== middle; lower++) {
    const upper = len - lower - 1;
    const lowerExists = lower in O;
    const lowerValue = lowerExists ? O[lower] : undefined;
    const upperExists = upper in O;
    const upperValue = upperExists ? O[upper] : undefined;
    if (lowerExists && upperExists) {
      O[lower] = upperValue;
      O[upper] = lowerValue;
    } else if (upperExists) {
      O[lower] = upperValue;
      delete O[upper];
    } else if (lowerExists) {
      delete O[lower];
      O[upper] = lowerValue;
    }
  }
  return O;
};
