// Based on core-js (es.array.for-each / internals/array-for-each)
// Behavioural (core-js's arrayMethodIsStrict): throws on a null `this`.
export const isSupported = (): boolean => {
  try {
    const method = Array.prototype.forEach;
    if (typeof method !== 'function') return false;
    try {
      (method as any).call(null, () => 1, 1);
      return false;
    } catch {
      return true;
    }
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.foreach */

export const arrayForEach = function forEach(this: any, callbackfn: any): void {
  // inlined: toObject(this)
  if (this === null || this === undefined) throw new TypeError('Cannot convert undefined or null to object');
  const O = Object(this);
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  // inlined: toLength(O.length)
  let length = +O.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  for (let index = 0; index < length; index++) {
    if (index in O) {
      callbackfn.call(thisArg, O[index], index, O);
    }
  }
};

