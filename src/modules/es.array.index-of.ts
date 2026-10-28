export const isSupported = (): boolean => {
  try {
    if (typeof Array.prototype.indexOf !== 'function') return false;
    // core-js NEGATIVE_ZERO: a match at 0 from fromIndex -0 is +0
    if (1 / (Array.prototype.indexOf as any).call([1], 1, -0) < 0) return false;
    // ToLength, not ToUint32 (Chrome < 45). Length -1: ToLength reads 0 and
    // returns at once; ToUint32 reads 2^32-1 and finds 'x' at its first index.
    // Never a walk, whatever the engine does with the length (see lastIndexOf).
    const o: any = { length: -1, 4294967294: 'x' };
    return (Array.prototype.indexOf as any).call(o, 'x', 4294967294) === -1;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.indexof */

// Declared (searchElement) only, for the spec length of 1; fromIndex comes from arguments.
export const arrayIndexOf = function indexOf(this: any, searchElement: any): number {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.indexOf called on null or undefined');
  }
  const object = Object(this);
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  if (length === 0) {
    return -1;
  }
  // inlined: toInteger(fromIndex)
  // + 0 turns -0 into +0, so a match at index 0 reports +0 as the spec's ToIntegerOrInfinity does.
  let start = arguments.length > 1 ? +arguments[1] : 0;
  start = (start !== start ? 0 : start < 0 ? Math.ceil(start) : Math.floor(start)) + 0;
  if (start >= length) {
    return -1;
  }
  if (start < 0) {
    start = Math.max(length + start, 0);
  }
  for (let i = start; i < length; i++) {
    // strict equality, holes skipped — NaN is never found, matching native
    if (i in object && object[i] === searchElement) {
      return i;
    }
  }
  return -1;
};

