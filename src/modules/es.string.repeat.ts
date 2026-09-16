// Ported from: the prior implementation (string-repeat.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.repeat === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.repeat
 */
export const stringRepeat = function (this: any, count: number): string {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.repeat called on null or undefined');
  }
  const source = String(this);
  let times = Number(count);
  if (times !== times) {
    times = 0; // NaN → 0
  }
  if (times < 0 || times === Infinity) {
    throw new RangeError('Invalid count value: ' + count);
  }
  times = Math.floor(times);

  // "exponentiation by squaring": instead of appending `source` one-at-a-time
  // `times` times, we double a chunk and only tack it on when the current bit
  // of `times` is set. turns O(n) concats into O(log n) — matters for big
  // counts on the low-end TV engines this package targets.
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

if (!isSupported()) {
  Object.defineProperty(String.prototype, 'repeat', { value: stringRepeat as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.prototype.repeat, 'name', { value: 'repeat', configurable: true });
  Object.defineProperty((String.prototype.repeat as any), '__polyfilled', { value: true });
}
