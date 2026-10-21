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

/*
 * WebIDL: on an interface with indexed properties, keys/values/entries are the
 * %Array.prototype% functions themselves (enumerable operations) and @@iterator
 * is %Array.prototype.values% (non-enumerable). They are natives (or es.array's,
 * installed first), so they are neither renamed nor marked here. The collection
 * iterator above only serves engines with no Array iterators at all.
 */
const own: [string, any][] = [
  ['keys', domCollectionKeys],
  ['values', domCollectionValues],
  ['entries', domCollectionEntries],
];
const patchCollection = (proto: any, withMethods: boolean): void => {
  if (withMethods) {
    for (let i = 0; i < own.length; i++) {
      const name = own[i][0];
      const arrayFn = (Array.prototype as any)[name];
      // keep a present one unless spackle replaced the Array function it should equal
      if (proto[name] && !(arrayFn && arrayFn.__polyfilled === true && proto[name] !== arrayFn)) continue;
      if (typeof arrayFn === 'function') {
        Object.defineProperty(proto, name, { value: arrayFn, writable: true, enumerable: true, configurable: true });
      } else {
        Object.defineProperty(proto, name, { value: own[i][1], writable: true, enumerable: true, configurable: true });
        try {
          Object.defineProperty(own[i][1], 'name', { value: name, configurable: true });
        } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
        Object.defineProperty(own[i][1], '__polyfilled', { value: true });
      }
    }
  }
  const iteratorKey = typeof Symbol !== 'undefined' ? (Symbol as any).iterator : undefined;
  const arrayValues = (Array.prototype as any).values;
  if (iteratorKey && (!proto[iteratorKey] || (arrayValues && arrayValues.__polyfilled === true && proto[iteratorKey] !== arrayValues))) {
    Object.defineProperty(proto, iteratorKey, {
      value: typeof arrayValues === 'function' ? arrayValues : (proto.values || domCollectionValues),
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
};

export const install = (): void => {
  if (typeof NodeList !== 'undefined') patchCollection(NodeList.prototype, true);
  if (typeof DOMTokenList !== 'undefined') patchCollection(DOMTokenList.prototype, true);
  // HTMLCollection is iterable (@@iterator) but has no keys/values/entries/forEach
  if (typeof HTMLCollection !== 'undefined') patchCollection(HTMLCollection.prototype, false);
};
