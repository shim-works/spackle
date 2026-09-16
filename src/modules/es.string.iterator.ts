// Ported from: the prior implementation (string-iterator.ts)

export const isSupported = (): boolean => {
  try {
    return (
      typeof Symbol === "undefined" ||
      !(Symbol as any).iterator ||
      typeof (String.prototype as any)[(Symbol as any).iterator] === "function"
    );
  } catch {
    return true; // no usable Symbol -- nothing for this module to do
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype-@@iterator
 * GC: one iterator object per call; steps lazily, no up-front code point array.
 */

export const stringIterator = function (this: any): any {
  if (this === null || this === undefined) {
    throw new TypeError(
      "String.prototype[Symbol.iterator] called on null or undefined",
    );
  }
  const string = String(this);
  let index = 0;
  const iterator: any = {
    next: function () {
      if (index >= string.length) {
        return { value: undefined, done: true };
      }
      const first = string.charCodeAt(index);
      let size = 1;
      // a lead surrogate followed by a trail surrogate is one code point spread
      // over two units — yield them together so emoji and CJK-extension chars
      // don't get chopped in half
      if (first >= 0xd800 && first <= 0xdbff && index + 1 < string.length) {
        const second = string.charCodeAt(index + 1);
        if (second >= 0xdc00 && second <= 0xdfff) {
          size = 2;
        }
      }
      const value = string.substring(index, index + size);
      index += size;
      return { value: value, done: false };
    },
  };
  // self-iterable so for..of / spread accept the iterator itself
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

if (
  typeof Symbol !== "undefined" &&
  (Symbol as any).iterator &&
  !isSupported()
) {
  Object.defineProperty(String.prototype as any, (Symbol as any).iterator, {
    value: stringIterator,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(stringIterator, "name", {
    value: "[Symbol.iterator]",
    configurable: true,
  });
  Object.defineProperty(
    (String.prototype as any)[(Symbol as any).iterator] as any,
    "__polyfilled",
    { value: true },
  );
}
