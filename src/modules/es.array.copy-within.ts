// Array.prototype.copyWithin: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.copyWithin === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.copywithin */
const MAX_SAFE_LENGTH = 0x1fffffffffffff;
const max = Math.max;
const min = Math.min;
const ceil = Math.ceil;
const floor = Math.floor;

// Declared (target, start) for the spec length of 2; end comes from arguments.
export const arrayCopyWithin = function copyWithin(this: any, target: any, start: any): any {
  const end = arguments.length > 2 ? arguments[2] : undefined;
  // inlined: toObject(this)
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.copyWithin called on null or undefined');
  }
  const object: any = Object(this);

  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length === 0 ? 0 : length < 0 ? ceil(length) : floor(length);
  length = length > 0 ? min(length, MAX_SAFE_LENGTH) : 0;

  // inlined: toAbsoluteIndex(target, length)
  let to = +target;
  to = to !== to || to === 0 ? 0 : to < 0 ? ceil(to) : floor(to);
  to = to < 0 ? max(to + length, 0) : min(to, length);

  // inlined: toAbsoluteIndex(start, length)
  let from = +start;
  from = from !== from || from === 0 ? 0 : from < 0 ? ceil(from) : floor(from);
  from = from < 0 ? max(from + length, 0) : min(from, length);

  // inlined: end === undefined ? length : toAbsoluteIndex(end, length)
  let final = length;
  if (end !== undefined) {
    final = +end;
    final = final !== final || final === 0 ? 0 : final < 0 ? ceil(final) : floor(final);
    final = final < 0 ? max(final + length, 0) : min(final, length);
  }

  let count = min(final - from, length - to);
  let direction = 1;
  if (from < to && to < from + count) {
    direction = -1;
    from += count - 1;
    to += count - 1;
  }

  while (count-- > 0) {
    if (from in object) object[to] = object[from];
    else if (!delete object[to]) throw new TypeError('Cannot delete property');
    to += direction;
    from += direction;
  }

  return object;
};
