export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.findIndex === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.findindex */

// Declared (callbackfn) only, for the spec length of 1; thisArg comes from arguments.
export const arrayFindIndex = function findIndex(this: any, callbackfn: any): number {
  // inlined: ToObject(this)
  if (this === null || this === undefined) throw new TypeError('Array.prototype.findIndex called on null or undefined');
  const O = Object(this);
  // inlined: ToLength(Get(O, "length")) -- before the callback check, as the spec orders it
  let length = +O.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  if (typeof callbackfn !== 'function') throw new TypeError('Array.prototype.findIndex: callback is not a function');
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  for (let k = 0; k < length; k++) {
    // holes are visited too (the predicate sees undefined), unlike forEach
    if (callbackfn.call(thisArg, O[k], k, O)) return k;
  }
  return -1;
};
