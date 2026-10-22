// Based on core-js (es.array.for-each / internals/array-for-each)
// Behavioural (core-js's arrayMethodIsStrict): throws on a null `this`.
const STOP = {};

export const isSupported = (): boolean => {
  try {
    const method = Array.prototype.forEach;
    if (typeof method !== 'function') return false;
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
      (method as any).call(o, function (_v: any, k: number) { if (k === 1) throw STOP; });
      return false;
    } catch (e) {
      return e === STOP;
    }
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.foreach */

// Declared (callbackfn) only, for the spec length of 1; thisArg comes from arguments.
export const arrayForEach = function forEach(this: any, callbackfn: any): void {
  // inlined: ToObject(this)
  if (this === null || this === undefined) throw new TypeError('Array.prototype.forEach called on null or undefined');
  const O = Object(this);
  // inlined: ToLength(Get(O, "length")) -- before the callback check, as the spec orders it
  let length = +O.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  if (typeof callbackfn !== 'function') throw new TypeError('Array.prototype.forEach: callback is not a function');
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  for (let k = 0; k < length; k++) {
    if (k in O) (thisArg === undefined ? callbackfn(O[k], k, O) : callbackfn.call(thisArg, O[k], k, O));
  }
};
