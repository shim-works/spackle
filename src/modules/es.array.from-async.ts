// Existence-only: Array.fromAsync is absent everywhere on the floor.
export const isSupported = (): boolean => {
  try {
    const fromAsync = (Array as any).fromAsync;
    if (typeof fromAsync !== 'function') return false;
    // core-js INCORRECT_CONSTRUCTURING: an array-like is built with one construct call
    let counter = 0;
    fromAsync.call(function () { counter++; return []; }, { length: 0 });
    return counter === 1;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/proposal-array-from-async/
 *
 * An explicit promise chain (no downlevelled async helpers). Values are awaited
 * one at a time, in order, as the spec requires.
 */
const PUT: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };

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

const isObject = (value: any): boolean =>
  value !== null && (typeof value === 'object' || typeof value === 'function');

// Declared (asyncItems) for the spec length of 1; mapfn and thisArg come from arguments.
export const arrayFromAsync = function fromAsync(this: any, asyncItems: any): any {
  if (typeof Promise === 'undefined') {
    throw new TypeError('Array.fromAsync requires Promise');
  }
  const C = this;
  const mapfn = arguments.length > 1 ? arguments[1] : undefined;
  const thisArg = arguments.length > 2 ? arguments[2] : undefined;

  // Everything below runs inside a promise job body, so every abrupt completion
  // -- even a synchronous one -- becomes a rejection, never a throw.
  return new Promise(function (resolve: any, reject: any) {
    if (mapfn !== undefined && typeof mapfn !== 'function') {
      throw new TypeError('Array.fromAsync: mapfn is not a function');
    }
    if (asyncItems === null || asyncItems === undefined) {
      throw new TypeError('Array.fromAsync called on null or undefined');
    }
    const asyncKey = typeof Symbol !== 'undefined' ? (Symbol as any).asyncIterator : undefined;
    const syncKey = typeof Symbol !== 'undefined' ? (Symbol as any).iterator : '@@iterator';

    // GetMethod(asyncItems, @@asyncIterator), then @@iterator only when absent
    let usingAsync: any = asyncKey ? asyncItems[asyncKey] : undefined;
    if (usingAsync === null) usingAsync = undefined;
    if (usingAsync !== undefined && typeof usingAsync !== 'function') {
      throw new TypeError('Array.fromAsync: @@asyncIterator is not a function');
    }
    let usingSync: any;
    if (usingAsync === undefined && syncKey) {
      usingSync = asyncItems[syncKey];
      if (usingSync === null) usingSync = undefined;
      if (usingSync !== undefined && typeof usingSync !== 'function') {
        throw new TypeError('Array.fromAsync: @@iterator is not a function');
      }
    }

    if (usingAsync !== undefined || usingSync !== undefined) {
      const A: any = isConstructor(C) ? new C() : [];
      const isAsync = usingAsync !== undefined;
      const iterator = (isAsync ? usingAsync : usingSync).call(asyncItems);
      if (!isObject(iterator)) throw new TypeError('Array.fromAsync: iterator is not an object');
      const next = iterator.next;
      let k = 0;

      // Close the source after a mapfn / definition / value-await failure; errors
      // from next(), done or value themselves never close it.
      const closeThenReject = function (error: any): void {
        let closing: any;
        try {
          const ret = iterator['return'];
          if (ret !== undefined && ret !== null) closing = ret.call(iterator);
        } catch {
          /* the original error wins over a throwing return() */
        }
        if (isAsync) {
          Promise.resolve(closing).then(function () { reject(error); }, function () { reject(error); });
        } else {
          reject(error);
        }
      };

      const store = function (value: any): void {
        try {
          if (k >= 9007199254740991) throw new TypeError('Array.fromAsync: too many elements');
          PUT.value = value;
          Object.defineProperty(A, k, PUT);
          PUT.value = undefined;
        } catch (error) {
          PUT.value = undefined;
          closeThenReject(error);
          return;
        }
        k++;
        step();
      };

      const mapAndStore = function (value: any): void {
        if (mapfn === undefined) {
          store(value);
          return;
        }
        let mapped: any;
        try {
          mapped = mapfn.call(thisArg, value, k);
        } catch (error) {
          closeThenReject(error);
          return;
        }
        // Await(mappedValue): exactly one await per element
        Promise.resolve(mapped).then(store, closeThenReject);
      };

      const onResult = function (result: any): void {
        try {
          if (!isObject(result)) throw new TypeError('Array.fromAsync: iterator result is not an object');
          if (result.done) {
            A.length = k;
            resolve(A);
            return;
          }
          const value = result.value;
          if (isAsync) {
            // an async iterator's values are used as they come, not awaited again
            mapAndStore(value);
          } else {
            // CreateAsyncFromSyncIterator awaits each value; a rejection closes the source
            Promise.resolve(value).then(mapAndStore, closeThenReject);
          }
        } catch (error) {
          reject(error);
        }
      };

      const step = function (): void {
        let result: any;
        try {
          result = next.call(iterator);
        } catch (error) {
          reject(error);
          return;
        }
        if (isAsync) Promise.resolve(result).then(onResult, reject);
        else onResult(result);
      };

      step();
      return;
    }

    // array-like path: ToObject, LengthOfArrayLike, Construct(C, [len])
    const arrayLike = Object(asyncItems);
    let length = +arrayLike.length;
    length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
    const A: any = isConstructor(C) ? new C(length) : new Array(length);
    let k = 0;
    const store = function (value: any): void {
      try {
        PUT.value = value;
        Object.defineProperty(A, k, PUT);
        PUT.value = undefined;
      } catch (error) {
        PUT.value = undefined;
        reject(error);
        return;
      }
      k++;
      step();
    };
    const mapAndStore = function (value: any): void {
      if (mapfn === undefined) {
        store(value);
        return;
      }
      let mapped: any;
      try {
        mapped = mapfn.call(thisArg, value, k);
      } catch (error) {
        reject(error);
        return;
      }
      Promise.resolve(mapped).then(store, reject);
    };
    const step = function (): void {
      try {
        if (k >= length) {
          A.length = length;
          resolve(A);
          return;
        }
        // Await(Get(arrayLike, k))
        Promise.resolve(arrayLike[k]).then(mapAndStore, reject);
      } catch (error) {
        reject(error);
      }
    };
    step();
  });
};
