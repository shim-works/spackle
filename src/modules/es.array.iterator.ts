// Ported from: the prior implementation (array-iterators.ts)

// Bundled probe: core-js-compat tracks keys/values/entries/Symbol.iterator
// as one module id, so isSupported() reflects the whole cluster even
// though each install below is still gated individually below (matching
// load-language.ts exactly -- Chrome 38 shipped keys/entries but not
// values, which landed in Chrome 66).
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

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.values (+ keys/entries)
 */
const MAX_SAFE_LENGTH = 9007199254740991; // 2^53 - 1

// clamp whatever .length gives us into a sane 0..MAX integer
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

// builds one lazy iterator that walks the array by index, no snapshot up front
const makeArrayIterator = function (
  object: any,
  length: number,
  kind: string,
): any {
  let index = 0;
  const iterator: any = {
    next: function () {
      if (index >= length) {
        return { value: undefined, done: true };
      }
      const currentIndex = index++;
      let value: any;
      if (kind === "keys") {
        value = currentIndex;
      } else if (kind === "values") {
        value = object[currentIndex];
      } else {
        value = [currentIndex, object[currentIndex]];
      }
      return { value: value, done: false };
    },
  };
  // make it self-iterable so for..of / spread work when Symbols exist
  if (typeof Symbol !== "undefined" && (Symbol as any).iterator) {
    Object.defineProperty(iterator, (Symbol as any).iterator, {
      value: function () {
        return iterator;
      },
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
  return iterator;
};

// shared null/undefined check, then box into an object
const guard = (self: any, name: string): any => {
  if (self === null || self === undefined) {
    throw new TypeError(
      "Array.prototype." + name + " called on null or undefined",
    );
  }
  return Object(self);
};

export const arrayKeys = function (this: any): any {
  const object = guard(this, "keys");
  return makeArrayIterator(object, toLength(object.length), "keys");
};

export const arrayValues = function (this: any): any {
  const object = guard(this, "values");
  return makeArrayIterator(object, toLength(object.length), "values");
};

export const arrayEntries = function (this: any): any {
  const object = guard(this, "entries");
  return makeArrayIterator(object, toLength(object.length), "entries");
};

if (typeof Array.prototype.keys !== "function") {
  Object.defineProperty(Array.prototype, "keys", {
    value: arrayKeys as any,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(Array.prototype.keys, "name", {
    value: "keys",
    configurable: true,
  });
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
  Object.defineProperty(Array.prototype.values, "name", {
    value: "values",
    configurable: true,
  });
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
  Object.defineProperty(Array.prototype.entries, "name", {
    value: "entries",
    configurable: true,
  });
  Object.defineProperty(Array.prototype.entries as any, "__polyfilled", {
    value: true,
  });
}
// alias of values, matching load-language.ts -- no __polyfilled tag here
// on purpose, since it just points at whatever .values ends up being
// (native or polyfilled above).
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
