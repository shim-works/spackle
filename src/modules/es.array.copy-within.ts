// Ported from: the prior implementation (array-copy-within.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.copyWithin === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.copywithin
 * Inspired by: core-js / MDN (overlap-safe direction)
 */
const MAX_SAFE_LENGTH = 9007199254740991; // 2^53 - 1

// clamp whatever .length gives us into a sane 0..MAX integer
const toLength = (value: any): number => {
  const numeric = Number(value);
  if (isNaN(numeric) || numeric <= 0) {
    return 0;
  }
  if (numeric > MAX_SAFE_LENGTH) {
    return MAX_SAFE_LENGTH;
  }
  return Math.floor(numeric);
};

// turn an arg into a whole number, rounding toward zero
const toInteger = (value: any): number => {
  const numeric = Number(value);
  if (isNaN(numeric)) {
    return 0;
  }
  if (numeric === Infinity || numeric === -Infinity) {
    return numeric;
  }
  return numeric < 0 ? Math.ceil(numeric) : Math.floor(numeric);
};

// relative index clamped into [0, length] — negatives count from the end
const clampRelative = (value: any, length: number): number => {
  const relative = toInteger(value);
  if (relative < 0) {
    return Math.max(length + relative, 0);
  }
  return Math.min(relative, length);
};

export const arrayCopyWithin = function <T>(
  this: ArrayLike<T>,
  target: number,
  start: number,
  end?: number
): any {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.copyWithin called on null or undefined');
  }
  // box it so strings / array-likes behave like real arrays
  const object = Object(this);
  const length = toLength(object.length);

  // where we're writing to, where we're reading from, and where reading stops
  let to = clampRelative(target, length);
  let from = clampRelative(start, length);
  const final = end === undefined ? length : clampRelative(end, length);

  // how many slots we can actually move without running off either end
  let count = Math.min(final - from, length - to);
  let direction = 1;
  if (from < to && to < from + count) {
    // ranges overlap going forward — flip to backward so we don't stomp
    // elements we haven't read yet
    direction = -1;
    from += count - 1;
    to += count - 1;
  }

  while (count > 0) {
    if (from in object) {
      object[to] = object[from];
    } else {
      // source slot is a hole, so punch a hole in the destination too
      delete object[to];
    }
    from += direction;
    to += direction;
    count--;
  }
  return object;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'copyWithin', { value: arrayCopyWithin as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.copyWithin, 'name', { value: 'copyWithin', configurable: true });
  Object.defineProperty((Array.prototype.copyWithin as any), '__polyfilled', { value: true });
}
