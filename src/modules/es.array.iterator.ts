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

// One shared prototype, so _iterator-impl's splice has something to hang the
// helpers off (never Object.prototype), and no closures per iterator.
const ArrayIteratorPrototype: any = {};

ArrayIteratorPrototype.next = function (this: any): any {
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
  // inlined: makeArrayIterator(Object(this), "keys")
  const iterator: any = Object.create(ArrayIteratorPrototype);
  iterator._object = Object(this);
  iterator._index = 0;
  iterator._kind = "keys";
  return iterator;
};

export const arrayValues = function (this: any): any {
  // inlined: guard(this, "values")
  if (this === null || this === undefined) {
    throw new TypeError("Array.prototype.values called on null or undefined");
  }
  // inlined: makeArrayIterator(Object(this), "values")
  const iterator: any = Object.create(ArrayIteratorPrototype);
  iterator._object = Object(this);
  iterator._index = 0;
  iterator._kind = "values";
  return iterator;
};

export const arrayEntries = function (this: any): any {
  // inlined: guard(this, "entries")
  if (this === null || this === undefined) {
    throw new TypeError("Array.prototype.entries called on null or undefined");
  }
  // inlined: makeArrayIterator(Object(this), "entries")
  const iterator: any = Object.create(ArrayIteratorPrototype);
  iterator._object = Object(this);
  iterator._index = 0;
  iterator._kind = "entries";
  return iterator;
};

export const install = (): void => {
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
    !(Array.prototype as any)[(Symbol as any).iterator]
  ) {
    Object.defineProperty(Array.prototype as any, (Symbol as any).iterator, {
      value: Array.prototype.values,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
};
