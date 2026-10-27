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

const hasOwn = Object.prototype.hasOwnProperty;

// %StringIteratorPrototype%.next. Brand check: an own _index slot (an object that
// merely inherits from a string iterator is not one).
const stringIteratorNext = function next(this: any): any {
  if (this === null || typeof this !== 'object' || !hasOwn.call(this, '_index')) {
    throw new TypeError('next method called on an object that is not a String Iterator');
  }
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

try {
  Object.defineProperty(stringIteratorNext, 'name', { value: 'next', configurable: true });
} catch (e) { /* Function#name non-configurable pre-ES6 */ }
Object.defineProperty(StringIteratorPrototype, 'next', {
  value: stringIteratorNext,
  writable: true,
  enumerable: false,
  configurable: true,
});
if (typeof Symbol !== "undefined" && (Symbol as any).toStringTag) {
  Object.defineProperty(StringIteratorPrototype, (Symbol as any).toStringTag, {
    value: "String Iterator",
    writable: false,
    enumerable: false,
    configurable: true,
  });
}

// self-iterable so for..of / spread accept the iterator itself
if (typeof Symbol !== "undefined" && (Symbol as any).iterator) {
  Object.defineProperty(StringIteratorPrototype, (Symbol as any).iterator, {
    value: returnSelf,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

// One reused descriptor for the slots; its value is cleared after each use.
const slotDesc: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: false };

export const stringIterator = function (this: any): any {
  if (this === null || this === undefined) {
    throw new TypeError(
      "String.prototype[Symbol.iterator] called on null or undefined",
    );
  }
  const iterator: any = Object.create(StringIteratorPrototype);
  // internal slots stay non-enumerable, like the spec's: Object.keys(iterator) is []
  // inlined: toStr(this) -- String(symbol) returns "Symbol(...)"; the spec throws
  if (typeof this === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  slotDesc.value = typeof this === 'string' ? this : String(this);
  Object.defineProperty(iterator, '_string', slotDesc);
  slotDesc.value = 0;
  Object.defineProperty(iterator, '_index', slotDesc);
  slotDesc.value = undefined;
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
