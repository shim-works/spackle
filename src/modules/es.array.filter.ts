// Ported from: the prior implementation (array-filter.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.filter === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.filter
 *
 * Known limitations:
 * - [scope] gated existence-only: the native stays in place on engines that
 *   merely lack Symbol.species awareness — swapping a hot method for that
 *   delta would cost more than it buys.
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

export const arrayFilter = function (this: any, callback: any, thisArg?: any): any[] {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.filter called on null or undefined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('callback is not a function');
  }
  const object = Object(this);
  const length = toLength(object.length);
  const result = speciesCreate(object, 0);
  let out = 0;
  for (let i = 0; i < length; i++) {
    if (i in object) {
      const value = object[i];
      if (callback.call(thisArg, value, i, object)) {
        result[out++] = value;
      }
    }
  }
  return result;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'filter', { value: arrayFilter as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.filter, 'name', { value: 'filter', configurable: true });
  Object.defineProperty((Array.prototype.filter as any), '__polyfilled', { value: true });
}
