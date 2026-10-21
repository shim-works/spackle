const STOP = {};

export const isSupported = (): boolean => {
  try {
    const method = Array.prototype.reduceRight;
    if (typeof method !== 'function') return false;
    // ToLength, not ToUint32 (Chrome < 45): a 32-bit native reads this length as 1
    // and finds nothing, where on a huge real length it would walk ~2^32 indices
    // (the Chrome 38 hang). A ToLength native starts at index 2^32, present, where
    // the callback throws, so the probe ends at once on both.
    const o: any = { length: 4294967297, 4294967296: 'x' };
    try {
      (method as any).call(o, function () { throw STOP; }, 0);
      return false;
    } catch (e) {
      return e === STOP;
    }
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.reduceright */

// Declared (callbackfn) only, for the spec length of 1; initialValue comes from arguments.
export const arrayReduceRight = function reduceRight(this: any, callbackfn: any): any {
  // inlined: ToObject(this)
  if (this === null || this === undefined) throw new TypeError('Array.prototype.reduceRight called on null or undefined');
  const O = Object(this);
  // inlined: ToLength(Get(O, "length")) -- before the callback check, as the spec orders it
  let length = +O.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  if (typeof callbackfn !== 'function') throw new TypeError('Array.prototype.reduceRight: callback is not a function');
  let k = length - 1;
  let accumulator: any;
  if (arguments.length > 1) {
    accumulator = arguments[1];
  } else {
    // no seed -- the last present element becomes the accumulator
    let present = false;
    for (; !present && k >= 0; k--) {
      if (k in O) { present = true; accumulator = O[k]; }
    }
    if (!present) throw new TypeError('Reduce of empty array with no initial value');
  }
  for (; k >= 0; k--) {
    if (k in O) accumulator = callbackfn(accumulator, O[k], k, O);
  }
  return accumulator;
};
