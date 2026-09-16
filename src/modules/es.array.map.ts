// Ported from: the prior implementation (array-map.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.map === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.map
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

export const arrayMap = function (this: any, callback: any, thisArg?: any): any[] {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.map called on null or undefined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('callback is not a function');
  }
  const object = Object(this);
  const length = toLength(object.length);
  const result = speciesCreate(object, length);
  for (let i = 0; i < length; i++) {
    // holes stay holes — callback never sees them
    if (i in object) {
      result[i] = callback.call(thisArg, object[i], i, object);
    }
  }
  return result;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'map', { value: arrayMap as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.map, 'name', { value: 'map', configurable: true });
  Object.defineProperty((Array.prototype.map as any), '__polyfilled', { value: true });
}
