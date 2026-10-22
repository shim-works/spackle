// One probe for keys/values/entries/@@iterator (one core-js-compat id); each
// install is still gated individually (Chrome 38 has keys/entries, not values).
export const isSupported = (): boolean => {
  try {
    return (
      typeof Array.prototype.keys === "function" &&
      typeof Array.prototype.values === "function" &&
      typeof Array.prototype.entries === "function"
    );
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.values (+ keys/entries) */

const returnSelf = function (this: any) {
  return this;
};

// One shared prototype, so install-iterator's splice has something to hang the
// helpers off (never Object.prototype), and no closures per iterator.
// It inherits %IteratorPrototype% when a built-in iterator can lead us to it
// (the iterator island also splices it at install, for engines where none can).
const findIteratorPrototype = (): any => {
  const key = typeof Symbol !== "undefined" ? (Symbol as any).iterator : undefined;
  if (!key) return Object.prototype;
  const g: any = typeof window !== "undefined" ? window : globalThis;
  const samples: Array<() => any> = [
    function () { return ("" as any)[key](); },
    function () { return new g.Map()[key](); },
    function () { return new g.Set()[key](); },
  ];
  for (let i = 0; i < samples.length; i++) {
    try {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(samples[i]()));
      if (proto && proto !== Object.prototype) return proto;
    } catch (e) {
      /* missing or unusable -- try the next */
    }
  }
  return Object.prototype;
};
const ArrayIteratorPrototype: any = Object.create(findIteratorPrototype());

const hasOwn = Object.prototype.hasOwnProperty;

// %ArrayIteratorPrototype%.next. The brand check is an own _kind slot: an object
// that merely inherits from an iterator is not one.
const arrayIteratorNext = function next(this: any): any {
  if (this === null || typeof this !== 'object' || !hasOwn.call(this, '_kind')) {
    throw new TypeError('next method called on an object that is not an Array Iterator');
  }
  const object = this._object;
  // already exhausted -- _object was released below, nothing left to read
  if (object === null) {
    return { value: undefined, done: true };
  }
  // Length is read every step, per spec: a loop that pushes keeps iterating.
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  if (this._index >= length) {
    // Release at exhaustion. A done iterator left in scope otherwise keeps the
    // whole array alive.
    this._object = null;
    return { value: undefined, done: true };
  }
  const index = this._index++;
  const kind = this._kind;
  if (kind === "keys") {
    return { value: index, done: false };
  }
  if (kind === "values") {
    return { value: object[index], done: false };
  }
  return { value: [index, object[index]], done: false };
};

try {
  Object.defineProperty(arrayIteratorNext, 'name', { value: 'next', configurable: true });
} catch (e) { /* Function#name non-configurable pre-ES6 */ }
Object.defineProperty(ArrayIteratorPrototype, 'next', {
  value: arrayIteratorNext,
  writable: true,
  enumerable: false,
  configurable: true,
});
if (typeof Symbol !== "undefined" && (Symbol as any).toStringTag) {
  Object.defineProperty(ArrayIteratorPrototype, (Symbol as any).toStringTag, {
    value: "Array Iterator",
    writable: false,
    enumerable: false,
    configurable: true,
  });
}

// Internal slots stay non-enumerable, like the spec's: Object.keys(iterator) is [].
// One reused descriptor; its value is cleared after each use.
const slotDesc: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: false };
const makeIterator = (object: any, kind: string): any => {
  const iterator: any = Object.create(ArrayIteratorPrototype);
  slotDesc.value = object;
  Object.defineProperty(iterator, '_object', slotDesc);
  slotDesc.value = 0;
  Object.defineProperty(iterator, '_index', slotDesc);
  slotDesc.value = kind;
  Object.defineProperty(iterator, '_kind', slotDesc);
  slotDesc.value = undefined;
  return iterator;
};

// self-iterable so for..of / spread work when Symbols exist
if (typeof Symbol !== "undefined" && (Symbol as any).iterator) {
  Object.defineProperty(ArrayIteratorPrototype, (Symbol as any).iterator, {
    value: returnSelf,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

export const arrayKeys = function (this: any): any {
  // inlined: guard(this, "keys")
  if (this === null || this === undefined) {
    throw new TypeError("Array.prototype.keys called on null or undefined");
  }
  return makeIterator(Object(this), "keys");
};

export const arrayValues = function (this: any): any {
  // inlined: guard(this, "values")
  if (this === null || this === undefined) {
    throw new TypeError("Array.prototype.values called on null or undefined");
  }
  return makeIterator(Object(this), "values");
};

export const arrayEntries = function (this: any): any {
  // inlined: guard(this, "entries")
  if (this === null || this === undefined) {
    throw new TypeError("Array.prototype.entries called on null or undefined");
  }
  return makeIterator(Object(this), "entries");
};

export const install = (): void => {
  const iteratorKey = typeof Symbol !== "undefined" ? (Symbol as any).iterator : undefined;
  // core-js's BUGGY_SAFARI_ITERATORS: Safari 7.1-8 ship keys/entries whose
  // iterators have no next. Then all three (and @@iterator) are spackle's.
  let buggyNative = false;
  try {
    buggyNative = typeof Array.prototype.keys === "function" && !("next" in (Array.prototype.keys as any).call([]));
  } catch (e) {
    buggyNative = true;
  }
  if (buggyNative) {
    delete (Array.prototype as any).keys;
    delete (Array.prototype as any).values;
    delete (Array.prototype as any).entries;
  }
  const nativeIterator: any = iteratorKey && !buggyNative ? (Array.prototype as any)[iteratorKey] : undefined;
  if (typeof Array.prototype.keys !== "function") {
    Object.defineProperty(Array.prototype, "keys", {
      value: arrayKeys as any,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    try {
      Object.defineProperty(Array.prototype.keys, "name", {
        value: "keys",
        configurable: true,
      });
    } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
    Object.defineProperty(Array.prototype.keys as any, "__polyfilled", {
      value: true,
    });
  }
  if (typeof Array.prototype.values !== "function") {
    if (typeof nativeIterator === "function") {
      // core-js's iterator-define: values is the native @@iterator, so both hand
      // out the engine's own %ArrayIteratorPrototype%. Its name can't be changed
      // on Chrome < 43, so where it isn't 'values', both get a named wrapper.
      // Not `const values`: esbuild would rename the inner function to values2.
      const valuesMethod =
        nativeIterator.name === "values"
          ? nativeIterator
          : function values(this: any) {
              return nativeIterator.call(this);
            };
      Object.defineProperty(Array.prototype, "values", {
        value: valuesMethod,
        writable: true,
        enumerable: false,
        configurable: true,
      });
      if (valuesMethod !== nativeIterator) {
        Object.defineProperty(valuesMethod, "__polyfilled", { value: true });
        Object.defineProperty(Array.prototype, iteratorKey, {
          value: valuesMethod,
          writable: true,
          enumerable: false,
          configurable: true,
        });
      }
    } else {
      Object.defineProperty(Array.prototype, "values", {
        value: arrayValues as any,
        writable: true,
        enumerable: false,
        configurable: true,
      });
      try {
        Object.defineProperty(Array.prototype.values, "name", {
          value: "values",
          configurable: true,
        });
      } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
      Object.defineProperty(Array.prototype.values as any, "__polyfilled", {
        value: true,
      });
    }
  }
  if (typeof Array.prototype.entries !== "function") {
    Object.defineProperty(Array.prototype, "entries", {
      value: arrayEntries as any,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    try {
      Object.defineProperty(Array.prototype.entries, "name", {
        value: "entries",
        configurable: true,
      });
    } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
    Object.defineProperty(Array.prototype.entries as any, "__polyfilled", {
      value: true,
    });
  }
  // alias of values; untagged, since it points at whatever .values is
  if (
    typeof Symbol !== "undefined" &&
    (Symbol as any).iterator &&
    (buggyNative || !(Array.prototype as any)[(Symbol as any).iterator])
  ) {
    Object.defineProperty(Array.prototype as any, (Symbol as any).iterator, {
      value: Array.prototype.values,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
  // core-js's setToStringTag on the native %ArrayIteratorPrototype%.
  const tag = typeof Symbol !== "undefined" ? (Symbol as any).toStringTag : undefined;
  if (tag && typeof nativeIterator === "function") {
    const proto = Object.getPrototypeOf(nativeIterator.call([]));
    if (proto !== Object.prototype && !Object.prototype.hasOwnProperty.call(proto, tag)) {
      Object.defineProperty(proto, tag, {
        value: "Array Iterator",
        writable: false,
        enumerable: false,
        configurable: true,
      });
    }
  }
};
