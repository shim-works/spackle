export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.repeat === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.repeat */
export const stringRepeat = function (this: any, count: number): string {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.repeat called on null or undefined');
  }
  const source = typeof this === 'string' ? this : String(this); // String() is a call Chrome 41 won't inline; skip it on the primitive path
  // ToIntegerOrInfinity FIRST, then the range check: -0.5 truncates to -0,
  // which is not < 0, so repeat(-0.5) is '' -- checking before truncating
  // threw a RangeError for every count in (-1, 0).
  let times = +count; // +x, not Number(x): same coercion, no call
  if (times !== times) {
    times = 0; // NaN → 0
  }
  times = times < 0 ? Math.ceil(times) : Math.floor(times);
  if (times < 0 || times === Infinity) {
    throw new RangeError('Invalid count value: ' + count);
  }

  // Exponentiation by squaring: O(log n) concats instead of n.
  let result = '';
  let chunk = source;
  while (times > 0) {
    if (times % 2 === 1) {
      result += chunk;
    }
    times = Math.floor(times / 2);
    if (times > 0) {
      chunk += chunk;
    }
  }
  return result;
};

