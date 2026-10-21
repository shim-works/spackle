export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.findLast === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.findlast */

// Declared (callbackfn) only, for the spec length of 1; thisArg comes from arguments.
export const arrayFindLast = function findLast(this: any, callbackfn: any): any {
  // inlined: ToObject(this)
  if (this === null || this === undefined) throw new TypeError('Array.prototype.findLast called on null or undefined');
  const O = Object(this);
  // inlined: ToLength(Get(O, "length")) -- before the callback check, as the spec orders it
  let length = +O.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  if (typeof callbackfn !== 'function') throw new TypeError('Array.prototype.findLast: callback is not a function');
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  for (let k = length - 1; k >= 0; k--) {
    const kValue = O[k];
    if (callbackfn.call(thisArg, kValue, k, O)) return kValue;
  }
  return undefined;
};
