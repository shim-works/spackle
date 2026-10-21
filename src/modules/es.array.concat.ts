/**
 * Behavioural: Chrome 41 / Safari 8's concat ignores @@isConcatSpreadable, which
 * es.symbol backfills there. Both directions of the flag are probed.
 */
export const isSupported = (): boolean => {
  try {
    if (typeof Array.prototype.concat !== 'function') {
      return false;
    }
    const symbols: any = typeof Symbol !== 'undefined' ? Symbol : undefined;
    const key = symbols && symbols.isConcatSpreadable;
    // No flag to honour and none coming: the ES1 concat is the whole feature.
    if (!key) {
      return false;
    }

    // false blocks the spread: the array rides along whole, as one element.
    const blocked: any = [1, 2];
    blocked[key] = false;
    if ([0].concat(blocked).length !== 2) {
      return false;
    }

    // true forces it: a plain object with a length spreads like an array.
    const forced: any = { length: 2, 0: 1, 1: 2 };
    forced[key] = true;
    if ([0].concat(forced).length !== 3) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.concat
 *
 * Known limitations:
 * - [scope] the gate probes @@isConcatSpreadable only. An engine that honours
 *   the flag but ignores @@species on concat (Chrome 48-50) keeps its native.
 */

// One descriptor for CreateDataPropertyOrThrow, reused by every call; value is
// cleared after each run so it never pins an element.
const dataDesc: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };
// CreateDataPropertyOrThrow, the fast way when it is the same thing: on an array
// this call created, with nothing at that index up the prototype chain, a plain
// write cannot hit a setter or a read-only slot. Anything else (a @@species or
// `this` constructor's object, an index defined on Array.prototype) goes through
// defineProperty, as the spec requires. core-js always pays for defineProperty.
const ArrayProto = Array.prototype;

// Declared (_item) for the spec length of 1; the items come from arguments.
export const arrayConcat = function concat(this: any, _item?: any): any[] {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.concat called on null or undefined');
  }
  const object = Object(this);
  // inlined: ArraySpeciesCreate(object, 0)
  let result: any;
  let plain = true; // false once a @@species constructor builds the result
  if (!Array.isArray(object)) {
    result = new Array(0);
  } else {
    let ctor: any = object.constructor;
    if (ctor !== null && (typeof ctor === 'object' || typeof ctor === 'function')) {
      if (typeof Symbol !== 'undefined' && (Symbol as any).species) {
        ctor = ctor[(Symbol as any).species];
        if (ctor === null) ctor = undefined;
      }
    } else if (ctor !== undefined) {
      throw new TypeError('Array.prototype.concat: constructor is not an object');
    }
    if (ctor === undefined || ctor === Array) {
      result = new Array(0);
    } else {
      if (typeof ctor !== 'function') throw new TypeError('Array.prototype.concat: @@species is not a constructor');
      result = new ctor(0);
      plain = false;
    }
  }
  let out = 0;
  // the receiver goes through the same spread test as every argument
  let source: any = object;
  let argIndex = 0;
  while (true) {
    // inlined: IsConcatSpreadable(source)
    let spreadable = false;
    if (source !== null && (typeof source === 'object' || typeof source === 'function')) {
      const flag =
        typeof Symbol !== 'undefined' && (Symbol as any).isConcatSpreadable
          ? source[(Symbol as any).isConcatSpreadable]
          : undefined;
      spreadable = flag !== undefined ? !!flag : Array.isArray(source);
    }
    if (spreadable) {
      // inlined: toLength(source.length)
      let length = +source.length;
      length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
      if (out + length > 9007199254740991) {
        throw new TypeError('Array.prototype.concat: result length exceeds 2^53-1');
      }
      for (let i = 0; i < length; i++) {
        // holes stay holes
        if (i in source) {
          if (plain && !(out in ArrayProto)) result[out] = source[i];
          else {
            dataDesc.value = source[i];
            Object.defineProperty(result, out, dataDesc);
          }
        }
        out++;
      }
    } else {
      if (out >= 9007199254740991) {
        throw new TypeError('Array.prototype.concat: result length exceeds 2^53-1');
      }
      if (plain && !(out in ArrayProto)) result[out++] = source;
      else {
        dataDesc.value = source;
        Object.defineProperty(result, out++, dataDesc);
      }
    }
    if (argIndex >= arguments.length) {
      break;
    }
    source = arguments[argIndex++];
  }
  dataDesc.value = undefined;
  result.length = out;
  return result;
};
