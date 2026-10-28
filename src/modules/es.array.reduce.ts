const STOP = {};

export const isSupported = (): boolean => {
  try {
    const method = Array.prototype.reduce;
    if (typeof method !== 'function') return false;
    // core-js CHROME_BUG: Chrome 80-82 reduce
    const chrome = /Chrome\/(\d+)/.exec((window.navigator && window.navigator.userAgent) || '');
    if (chrome && +chrome[1] > 79 && +chrome[1] < 83) return false;
    // core-js arrayMethodIsStrict: throws on a null this
    try {
      (method as any).call(null, () => 1, 1);
      return false;
    } catch {
      /* strict, as it should be */
    }
    // ToLength, not ToUint32 (Chrome < 45): a 32-bit native reads this length as 1
    // and visits only index 0, where on a huge real length it would walk ~2^32
    // indices (the Chrome 38 hang). A ToLength native goes on to index 1, where the
    // callback throws, so the probe ends at once on both.
    const o: any = { length: 4294967297, 0: 0, 1: 1 };
    try {
      (method as any).call(o, function (_a: any, _v: any, k: number) { if (k === 1) throw STOP; }, 0);
      return false;
    } catch (e) {
      return e === STOP;
    }
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.reduce */

// Declared (callbackfn) only, for the spec length of 1; initialValue comes from arguments.
export const arrayReduce = function reduce(this: any, callbackfn: any): any {
  // inlined: ToObject(this)
  if (this === null || this === undefined) throw new TypeError('Array.prototype.reduce called on null or undefined');
  const O = Object(this);
  // inlined: ToLength(Get(O, "length")) -- before the callback check, as the spec orders it
  let length = +O.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  if (typeof callbackfn !== 'function') throw new TypeError('Array.prototype.reduce: callback is not a function');
  let k = 0;
  let accumulator: any;
  if (arguments.length > 1) {
    accumulator = arguments[1];
  } else {
    // no seed -- the first present element becomes the accumulator
    let present = false;
    for (; !present && k < length; k++) {
      if (k in O) { present = true; accumulator = O[k]; }
    }
    if (!present) throw new TypeError('Reduce of empty array with no initial value');
  }
  for (; k < length; k++) {
    if (k in O) accumulator = callbackfn(accumulator, O[k], k, O);
  }
  return accumulator;
};
