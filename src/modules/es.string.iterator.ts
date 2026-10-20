import { define } from '../define.js';

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

/** Spec: https://tc39.es/ecma262/#sec-string.prototype-@@iterator */

const returnSelf = function (this: any) {
  return this;
};

// One shared prototype (see es.array.iterator).
const StringIteratorPrototype: any = {};

StringIteratorPrototype.next = function (this: any): any {
  const string = this._string;
  if (string === null || this._index >= string.length) {
    // Release at exhaustion so a spent iterator does not pin the string.
    this._string = null;
    return { value: undefined, done: true };
  }
  const index = this._index;
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
  this._index = index + size;
  return { value: string.substring(index, index + size), done: false };
};

// self-iterable so for..of / spread accept the iterator itself
if (typeof Symbol !== "undefined" && (Symbol as any).iterator) {
  Object.defineProperty(StringIteratorPrototype, (Symbol as any).iterator, {
    value: returnSelf,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

export const stringIterator = function (this: any): any {
  if (this === null || this === undefined) {
    throw new TypeError(
      "String.prototype[Symbol.iterator] called on null or undefined",
    );
  }
  const iterator: any = Object.create(StringIteratorPrototype);
  iterator._string = typeof this === 'string' ? this : String(this); // String() is a call Chrome 41 won't inline; skip it on the primitive path
  iterator._index = 0;
  return iterator;
};

export const install = (): void => {
  if (typeof Symbol !== "undefined" && (Symbol as any).iterator) {
    define(
      String.prototype as any,
      (Symbol as any).iterator,
      stringIterator,
      "[Symbol.iterator]",
    );
  }
};
