// Array.prototype.fill: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.fill === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.fill */
const MAX_SAFE_LENGTH = 0x1fffffffffffff;
const max = Math.max;
const min = Math.min;
const ceil = Math.ceil;
const floor = Math.floor;

// Declared (value) for the spec length of 1; start and end come from arguments.
export const arrayFill = function fill(this: any, value: any): any {
  const start = arguments.length > 1 ? arguments[1] : undefined;
  const end = arguments.length > 2 ? arguments[2] : undefined;
  // inlined: toObject(this)
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.fill called on null or undefined');
  }
  const object: any = Object(this);

  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length === 0 ? 0 : length < 0 ? ceil(length) : floor(length);
  length = length > 0 ? min(length, MAX_SAFE_LENGTH) : 0;

  // inlined: toAbsoluteIndex(start, length) -- an omitted start is undefined,
  // which coerces to NaN and so to 0, so no arguments.length check is needed
  let index = +(start as any);
  index = index !== index || index === 0 ? 0 : index < 0 ? ceil(index) : floor(index);
  index = index < 0 ? max(index + length, 0) : min(index, length);

  // inlined: end === undefined ? length : toAbsoluteIndex(end, length)
  let endPosition = length;
  if (end !== undefined) {
    endPosition = +end;
    endPosition = endPosition !== endPosition || endPosition === 0 ? 0 : endPosition < 0 ? ceil(endPosition) : floor(endPosition);
    endPosition = endPosition < 0 ? max(endPosition + length, 0) : min(endPosition, length);
  }

  while (endPosition > index) object[index++] = value;
  return object;
};
