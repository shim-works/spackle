export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.repeat === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.repeat */
// ToString: String(symbol) returns "Symbol(...)"; the spec throws a TypeError.
const toStr = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return typeof value === 'string' ? value : String(value);
};

export const stringRepeat = function (this: any, count: number): string {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.repeat called on null or undefined');
  }
  const source = toStr(this);
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

