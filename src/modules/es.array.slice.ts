// Ported from: the prior implementation (array-slice.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.slice === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.slice
 *
 * Known limitations:
 * - [scope] gated existence-only: the native stays in place on engines that
 *   merely lack Symbol.species awareness.
 */

const MAX_SAFE_LENGTH = 9007199254740991; // 2^53 - 1

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

// ToIntegerOrInfinity, minus the infinities we never hit after clamping
const toInteger = (value: any): number => {
  const numeric = Number(value);
  if (isNaN(numeric)) {
    return 0;
  }
  return numeric < 0 ? Math.ceil(numeric) : Math.floor(numeric);
};

// ArraySpeciesCreate: honor constructor[Symbol.species] when someone wired a
// subclass, else plain Array
const speciesCreate = (original: any, length: number): any => {
  if (!Array.isArray(original)) {
    return new Array(length);
  }
  let ctor: any = original.constructor;
  if (typeof Symbol !== 'undefined' && (Symbol as any).species && ctor != null) {
    const species = ctor[(Symbol as any).species];
    ctor = species == null ? undefined : species;
  }
  if (ctor === undefined || ctor === Array) {
    return new Array(length);
  }
  if (typeof ctor !== 'function') {
    throw new TypeError('constructor property is not a constructor');
  }
  return new ctor(length);
};

export const arraySlice = function (this: any, start?: any, end?: any): any[] {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.slice called on null or undefined');
  }
  const object = Object(this);
  const length = toLength(object.length);
  let from = toInteger(start);
  from = from < 0 ? Math.max(length + from, 0) : Math.min(from, length);
  let to = end === undefined ? length : toInteger(end);
  to = to < 0 ? Math.max(length + to, 0) : Math.min(to, length);
  const count = Math.max(to - from, 0);
  const result = speciesCreate(object, count);
  let out = 0;
  for (let i = from; i < to; i++) {
    // holes stay holes in the copy
    if (i in object) {
      result[out] = object[i];
    }
    out++;
  }
  result.length = count;
  return result;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'slice', { value: arraySlice as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.slice, 'name', { value: 'slice', configurable: true });
  Object.defineProperty((Array.prototype.slice as any), '__polyfilled', { value: true });
}
