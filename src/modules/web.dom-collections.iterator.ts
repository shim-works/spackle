// Gated per prototype inside install(): there's no single support question.
export const isSupported = (): boolean => {
  try {
    return (
      typeof NodeList !== "undefined" &&
      typeof (NodeList.prototype as any).keys === "function"
    );
  } catch {
    return false;
  }
};

/**
 * Spec: https://webidl.spec.whatwg.org/#es-iterable
 * Inspired by: core-js web.dom-collections.iterator
 */

const returnSelf = function (this: any) {
  return this;
};

// One shared prototype (see es.array.iterator). Length is read on every next(),
// so the collection stays live.
const CollectionIteratorPrototype: any = {};

CollectionIteratorPrototype.next = function (this: any): any {
  const collection = this._collection;
  if (collection === null || this._index >= collection.length) {
    // Release at exhaustion, as the spec does by clearing [[IteratedObject]] --
    // a spent iterator left in scope otherwise pins the whole collection.
    this._collection = null;
    return { value: undefined, done: true };
  }
  const index = this._index++;
  const kind = this._kind;
  if (kind === 0) return { value: index, done: false };
  if (kind === 1) return { value: collection[index], done: false };
  return { value: [index, collection[index]], done: false };
};

if (typeof Symbol !== "undefined" && (Symbol as any).iterator) {
  Object.defineProperty(CollectionIteratorPrototype, (Symbol as any).iterator, {
    value: returnSelf,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

export const domCollectionKeys = function (this: any) {
  // inlined: createCollectionIterator(this, 0)
  const iterator: any = Object.create(CollectionIteratorPrototype);
  iterator._collection = this;
  iterator._index = 0;
  iterator._kind = 0;
  return iterator;
};

export const domCollectionValues = function (this: any) {
  // inlined: createCollectionIterator(this, 1)
  const iterator: any = Object.create(CollectionIteratorPrototype);
  iterator._collection = this;
  iterator._index = 0;
  iterator._kind = 1;
  return iterator;
};

export const domCollectionEntries = function (this: any) {
  // inlined: createCollectionIterator(this, 2)
  const iterator: any = Object.create(CollectionIteratorPrototype);
  iterator._collection = this;
  iterator._index = 0;
  iterator._kind = 2;
  return iterator;
};

const patchCollection = (proto: any): void => {
  if (!proto.keys) {
    Object.defineProperty(proto, "keys", {
      value: domCollectionKeys,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    try {
      Object.defineProperty(proto.keys, "name", {
        value: "keys",
        configurable: true,
      });
    } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
    Object.defineProperty(proto.keys as any, "__polyfilled", { value: true });
  }
  if (!proto.values) {
    Object.defineProperty(proto, "values", {
      value: domCollectionValues,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    try {
      Object.defineProperty(proto.values, "name", {
        value: "values",
        configurable: true,
      });
    } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
    Object.defineProperty(proto.values as any, "__polyfilled", { value: true });
  }
  if (!proto.entries) {
    Object.defineProperty(proto, "entries", {
      value: domCollectionEntries,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    try {
      Object.defineProperty(proto.entries, "name", {
        value: "entries",
        configurable: true,
      });
    } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
    Object.defineProperty(proto.entries as any, "__polyfilled", {
      value: true,
    });
  }
  if (
    typeof Symbol !== "undefined" &&
    (Symbol as any).iterator &&
    !proto[(Symbol as any).iterator]
  ) {
    Object.defineProperty(proto, (Symbol as any).iterator, {
      value: proto.values,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(
      proto[(Symbol as any).iterator] as any,
      "__polyfilled",
      { value: true },
    );
  }
};

export const install = (): void => {
  if (typeof NodeList !== "undefined") {
    patchCollection(NodeList.prototype);
  }
  if (typeof DOMTokenList !== "undefined") {
    patchCollection(DOMTokenList.prototype);
  }
};

