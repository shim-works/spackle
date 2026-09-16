// Ported from: the prior implementation (dom-collections-iterator.ts)

// Same deal as web.dom-collections.for-each -- gates per-prototype
// internally, called unconditionally, no single up-front boolean.
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
 * Inspired by: core-js web.dom-collections.iterator (shared fns across
 */

// kind: 0 = keys, 1 = values, 2 = entries. One small closure per iterator —
// same allocation profile as native. The iterator is itself iterable once a
// Symbol exists (native-first check, no dependency on the Symbol polyfill).
const createCollectionIterator = (collection: any, kind: number): any => {
  let i = 0;
  const iterator: any = {
    next: function () {
      if (i >= collection.length) {
        return { value: undefined, done: true };
      }
      const index = i++;
      if (kind === 0) return { value: index, done: false };
      if (kind === 1) return { value: collection[index], done: false };
      return { value: [index, collection[index]], done: false };
    },
  };
  if (typeof Symbol !== "undefined" && (Symbol as any).iterator) {
    Object.defineProperty(iterator, (Symbol as any).iterator, {
      value: function () {
        return this;
      },
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
  return iterator;
};

export const domCollectionKeys = function (this: any) {
  return createCollectionIterator(this, 0);
};

export const domCollectionValues = function (this: any) {
  return createCollectionIterator(this, 1);
};

export const domCollectionEntries = function (this: any) {
  return createCollectionIterator(this, 2);
};

const patchCollection = (proto: any): void => {
  if (!proto.keys) {
    Object.defineProperty(proto, "keys", {
      value: domCollectionKeys,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(proto.keys, "name", {
      value: "keys",
      configurable: true,
    });
    Object.defineProperty(proto.keys as any, "__polyfilled", { value: true });
  }
  if (!proto.values) {
    Object.defineProperty(proto, "values", {
      value: domCollectionValues,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(proto.values, "name", {
      value: "values",
      configurable: true,
    });
    Object.defineProperty(proto.values as any, "__polyfilled", { value: true });
  }
  if (!proto.entries) {
    Object.defineProperty(proto, "entries", {
      value: domCollectionEntries,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(proto.entries, "name", {
      value: "entries",
      configurable: true,
    });
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

export const applyDomCollectionIteratorPolyfill = (): void => {
  if (typeof NodeList !== "undefined") {
    patchCollection(NodeList.prototype);
  }
  if (typeof DOMTokenList !== "undefined") {
    patchCollection(DOMTokenList.prototype);
  }
};

applyDomCollectionIteratorPolyfill();
