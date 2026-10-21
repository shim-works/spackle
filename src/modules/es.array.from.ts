// Match core-js's correctness-of-iteration gate: keep the native only if it
// consumes a custom iterable and closes that iterator when mapping throws.
export const isSupported = (): boolean => {
  try {
    if (typeof Array.from !== 'function') return false;

    const iteratorKey =
      typeof Symbol !== 'undefined' && (Symbol as any).iterator
        ? (Symbol as any).iterator
        : '@@iterator';
    let stepped = false;
    let nextCalls = 0;
    let closed = false;
    const iterable: any = {};
    iterable[iteratorKey] = function () {
      return {
        next: function () {
          nextCalls++;
          stepped = true;
          return { value: 1, done: nextCalls > 1 };
        },
        return: function () {
          closed = true;
          return { value: undefined, done: true };
        },
      };
    };

    try {
      Array.from(iterable, function () {
        throw new Error('Array.from probe');
      });
    } catch (e) {
      // The mapping error is deliberate; check below that the iterator closed.
    }
    return stepped && closed;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.from
 *
 * Known limitations:
 * - [incomplete] With no native Symbol (Safari 7/8), strings take the array-like
 *   path and split by UTF-16 code unit, so astral code points (emoji) break into
 *   surrogate halves. A native Symbol (Chrome 38 / Safari 9+) keeps them whole.
 */

// once-flag for the astral-split warn below — this path can run per keystroke
let warnedAstralSplit = false;

// One descriptor for CreateDataPropertyOrThrow, reused by every call; value is
// cleared after each run so it never pins an element.
const dataDesc: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };
// CreateDataPropertyOrThrow, the fast way when it is the same thing: on an array
// this call created, with nothing at that index up the prototype chain, a plain
// write cannot hit a setter or a read-only slot. Anything else (a @@species or
// `this` constructor's object, an index defined on Array.prototype) goes through
// defineProperty, as the spec requires. core-js always pays for defineProperty.
const ArrayProto = Array.prototype;

// IsConstructor without calling the candidate: the native Reflect.construct
// (captured before any polyfill) throws for a non-constructor newTarget. On
// engines without it, a function with an own prototype is the best ES5 test.
const nativeConstruct: any =
  typeof Reflect !== 'undefined' && typeof (Reflect as any).construct === 'function' ? (Reflect as any).construct : undefined;
const noArgs: any[] = [];
const isConstructor = (C: any): boolean => {
  if (typeof C !== 'function') return false;
  if (nativeConstruct) {
    try {
      nativeConstruct(String, noArgs, C);
      return true;
    } catch {
      return false;
    }
  }
  return Object.prototype.hasOwnProperty.call(C, 'prototype');
};

// Declared (items) for the spec length of 1; mapfn and thisArg come from arguments.
export const arrayFrom = function from(this: any, items: any): any {
  const C: any = this;
  const mapfn = arguments.length > 1 ? arguments[1] : undefined;
  const thisArg = arguments.length > 2 ? arguments[2] : undefined;
  if (mapfn !== undefined && typeof mapfn !== 'function') {
    throw new TypeError('Array.from: when provided, the second argument must be a function');
  }
  if (items === null || items === undefined) {
    throw new TypeError('Array.from requires an array-like or iterable object');
  }

  // GetMethod(items, @@iterator); the '@@iterator' string key on Symbol-less engines
  let usingIterator: any =
    typeof Symbol !== 'undefined' && (Symbol as any).iterator ? items[(Symbol as any).iterator] : items['@@iterator'];
  if (usingIterator === null) usingIterator = undefined;
  if (usingIterator !== undefined && typeof usingIterator !== 'function') {
    throw new TypeError('Array.from: @@iterator is not a function');
  }

  if (usingIterator !== undefined) {
    // false when `this` is a constructor that builds the result itself
    const plain = !(C !== Array && isConstructor(C));
    const A: any = plain ? [] : new C();
    const iterator = usingIterator.call(items);
    if (iterator === null || (typeof iterator !== 'object' && typeof iterator !== 'function')) {
      throw new TypeError('Array.from: iterator is not an object');
    }
    // GetIteratorDirect reads next once
    const next = iterator.next;
    let k = 0;
    while (true) {
      const step = next.call(iterator);
      if (step === null || (typeof step !== 'object' && typeof step !== 'function')) {
        throw new TypeError('Array.from: iterator result is not an object');
      }
      if (step.done) {
        A.length = k;
        return A;
      }
      const value = step.value;
      // a throwing mapfn or a failed definition closes the iterator; errors from
      // next()/done/value propagate without closing it
      try {
        if (k >= 9007199254740991) throw new TypeError('Array.from: too many elements');
        if (plain && !(k in ArrayProto)) A[k] = mapfn !== undefined ? mapfn.call(thisArg, value, k) : value;
        else {
          dataDesc.value = mapfn !== undefined ? mapfn.call(thisArg, value, k) : value;
          Object.defineProperty(A, k, dataDesc);
        }
        dataDesc.value = undefined;
      } catch (error) {
        dataDesc.value = undefined;
        const ret = iterator['return'];
        if (ret !== undefined && ret !== null) {
          // a throw from return() itself must not mask the original error
          try {
            ret.call(iterator);
          } catch {
            /* the original error is what matters */
          }
        }
        throw error;
      }
      k++;
    }
  }

  // array-like path
  if (typeof items === 'string' && !warnedAstralSplit && /[\uD800-\uDFFF]/.test(items)) {
    warnedAstralSplit = true;
    console.warn(
      '[spackle] Array.from: no Symbol.iterator on this engine, so strings split by UTF-16 unit — astral characters break into surrogate halves'
    );
  }
  const arrayLike = Object(items);
  // inlined: toLength(arrayLike.length)
  let length = +arrayLike.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  // Construct(C, [len]) here -- the length IS known on this path
  // false when `this` is a constructor that builds the result itself
  const plain = !(C !== Array && isConstructor(C));
  const A: any = plain ? new Array(length) : new C(length);
  for (let k = 0; k < length; k++) {
    const kValue = arrayLike[k];
    if (plain && !(k in ArrayProto)) A[k] = mapfn !== undefined ? mapfn.call(thisArg, kValue, k) : kValue;
    else {
      dataDesc.value = mapfn !== undefined ? mapfn.call(thisArg, kValue, k) : kValue;
      Object.defineProperty(A, k, dataDesc);
    }
  }
  dataDesc.value = undefined;
  A.length = length;
  return A;
};
