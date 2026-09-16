// Ported from: the prior implementation (array-concat.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.concat === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.concat
 *
 * Known limitations:
 * - [scope] gated existence-only: the native stays in place on engines that
 *   merely lack Symbol.isConcatSpreadable / Symbol.species awareness.
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

// IsConcatSpreadable: a Symbol.isConcatSpreadable flag wins, otherwise arrays
// spread and everything else rides along whole
const isSpreadable = (value: any): boolean => {
  if (value === null || (typeof value !== 'object' && typeof value !== 'function')) {
    return false;
  }
  if (typeof Symbol !== 'undefined' && (Symbol as any).isConcatSpreadable) {
    const flag = value[(Symbol as any).isConcatSpreadable];
    if (flag !== undefined) {
      return !!flag;
    }
  }
  return Array.isArray(value);
};

export const arrayConcat = function (this: any): any[] {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.concat called on null or undefined');
  }
  const object = Object(this);
  const result = speciesCreate(object, 0);
  let out = 0;
  // the receiver goes through the same spread test as every argument
  let source: any = object;
  let argIndex = 0;
  while (true) {
    if (isSpreadable(source)) {
      const length = toLength(source.length);
      for (let i = 0; i < length; i++) {
        // holes stay holes
        if (i in source) {
          result[out] = source[i];
        }
        out++;
      }
    } else {
      result[out++] = source;
    }
    if (argIndex >= arguments.length) {
      break;
    }
    source = arguments[argIndex++];
  }
  result.length = out;
  return result;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'concat', { value: arrayConcat as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.concat, 'name', { value: 'concat', configurable: true });
  Object.defineProperty((Array.prototype.concat as any), '__polyfilled', { value: true });
}
