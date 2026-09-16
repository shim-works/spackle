// Ported from: the prior implementation (array-splice.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.splice === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.splice
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

export const arraySplice = function (this: any): any[] {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.splice called on null or undefined');
  }
  const object = Object(this);
  const length = toLength(object.length);
  const argCount = arguments.length;
  const relativeStart = argCount > 0 ? toInteger(arguments[0]) : 0;
  const actualStart =
    relativeStart < 0 ? Math.max(length + relativeStart, 0) : Math.min(relativeStart, length);
  let insertCount: number;
  let actualDeleteCount: number;
  if (argCount === 0) {
    insertCount = 0;
    actualDeleteCount = 0;
  } else if (argCount === 1) {
    insertCount = 0;
    actualDeleteCount = length - actualStart;
  } else {
    insertCount = argCount - 2;
    actualDeleteCount = Math.min(Math.max(toInteger(arguments[1]), 0), length - actualStart);
  }
  const removed = speciesCreate(object, actualDeleteCount);
  for (let i = 0; i < actualDeleteCount; i++) {
    const from = actualStart + i;
    if (from in object) {
      removed[i] = object[from];
    }
  }
  removed.length = actualDeleteCount;
  const countDelta = insertCount - actualDeleteCount;
  if (countDelta < 0) {
    // shrinking: shift the tail left, then chop the leftovers
    for (let i = actualStart; i < length - actualDeleteCount; i++) {
      const from = i + actualDeleteCount;
      const to = i + insertCount;
      if (from in object) {
        object[to] = object[from];
      } else {
        delete object[to];
      }
    }
    for (let i = length; i > length + countDelta; i--) {
      delete object[i - 1];
    }
  } else if (countDelta > 0) {
    // growing: shift the tail right, back to front so nothing gets stomped
    for (let i = length - actualDeleteCount; i > actualStart; i--) {
      const from = i + actualDeleteCount - 1;
      const to = i + insertCount - 1;
      if (from in object) {
        object[to] = object[from];
      } else {
        delete object[to];
      }
    }
  }
  for (let i = 0; i < insertCount; i++) {
    object[actualStart + i] = arguments[i + 2];
  }
  object.length = length + countDelta;
  return removed;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'splice', { value: arraySplice as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.splice, 'name', { value: 'splice', configurable: true });
  Object.defineProperty((Array.prototype.splice as any), '__polyfilled', { value: true });
}
