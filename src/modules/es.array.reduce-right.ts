const STOP = {};

export const isSupported = (): boolean => {
  try {
    const method = Array.prototype.reduceRight;
    if (typeof method !== 'function') return false;
    // core-js CHROME_BUG: Chrome 80-82 reduceRight
    const chrome = /Chrome\/(\d+)/.exec((window.navigator && window.navigator.userAgent) || '');
    if (chrome && +chrome[1] > 79 && +chrome[1] < 83) return false;
    // core-js arrayMethodIsStrict: throws on a null this
    try {
      (method as any).call(null, () => 1, 1);
      return false;
    } catch {
      /* strict, as it should be */
    }
    // ToLength, not ToUint32 (Chrome < 45). Length -1: ToLength reads 0 and
    // returns the initial value at once; ToUint32 reads 2^32-1 and hits the
    // throwing getter at its first index. Never a walk, whatever the engine does
    // with the length (see lastIndexOf).
    const o: any = { length: -1 };
    Object.defineProperty(o, 4294967294, { get: function () { throw STOP; }, configurable: true });
    return (method as any).call(o, function () { return 1; }, 0) === 0;
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
