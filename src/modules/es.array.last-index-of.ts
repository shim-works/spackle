export const isSupported = (): boolean => {
  try {
    if (typeof Array.prototype.lastIndexOf !== 'function') return false;
    // core-js NEGATIVE_ZERO: a match at 0 from fromIndex -0 is +0
    if (1 / (Array.prototype.lastIndexOf as any).call([1], 1, -0) < 0) return false;
    // core-js arrayMethodIsStrict: throws on a null this
    try {
      (Array.prototype.lastIndexOf as any).call(null, 1);
      return false;
    } catch {
      /* strict, as it should be */
    }
    // ToLength, not ToUint32 (Chrome < 45). Length -1: ToLength reads 0 and
    // returns at once; ToUint32 reads 2^32-1 and finds 'x' at its first index.
    // Never a walk, whatever the engine does with the length -- a huge positive
    // length walked ~2^31 indices on the Foxtel box (WPE, mipsel) for 15 minutes.
    const o: any = { length: -1, 4294967294: 'x' };
    return (Array.prototype.lastIndexOf as any).call(o, 'x') === -1;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.lastindexof */

export const arrayLastIndexOf = function lastIndexOf(this: any, searchElement: any): number {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.lastIndexOf called on null or undefined');
  }
  const object = Object(this);
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  if (length === 0) {
    return -1;
  }
  let start = length - 1;
  if (arguments.length > 1) {
    // inlined: toInteger(arguments[1])
    start = +arguments[1];
    // + 0 turns -0 into +0, so a match at index 0 reports +0.
    start = (start !== start ? 0 : start < 0 ? Math.ceil(start) : Math.floor(start)) + 0;
  }
  if (start >= 0) {
    start = Math.min(start, length - 1);
  } else {
    start = length + start;
  }
  for (let i = start; i >= 0; i--) {
    // strict equality, holes skipped — NaN is never found, matching native
    if (i in object && object[i] === searchElement) {
      return i;
    }
  }
  return -1;
};

