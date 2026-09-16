// Ported from: the prior implementation (dom-collections-for-each.ts)

// the prior implementation calls this unconditionally -- applyDomCollectionForEachPolyfill
// gates per-prototype internally, so there's no single boolean "is this
// supported" question to ask up front.
export const isSupported = (): boolean => {
  try {
    return typeof NodeList !== 'undefined' && typeof (NodeList.prototype as any).forEach === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://dom.spec.whatwg.org/#interface-nodelist (forEach via the
 * Inspired by: core-js web.dom-collections.for-each (shared fn across collections)
 */

// Shared across the collection types — defined once, assigned to each prototype.
export const domCollectionForEach = function (
  this: any,
  callback: (value: any, index: number, collection: any) => void,
  thisArg?: any,
): void {
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  for (let i = 0; i < this.length; i++) {
    callback.call(thisArg, this[i], i, this);
  }
};

export const applyDomCollectionForEachPolyfill = (): void => {
  if (typeof NodeList !== 'undefined' && !NodeList.prototype.forEach) {
    Object.defineProperty((NodeList.prototype as any), 'forEach', { value: domCollectionForEach, writable: true, enumerable: false, configurable: true });
    Object.defineProperty((NodeList.prototype as any).forEach, 'name', { value: 'forEach', configurable: true });
    Object.defineProperty((NodeList.prototype.forEach as any), '__polyfilled', { value: true });
  }
  // DOMTokenList (classList) is the other collection core-js patches here.
  if (
    typeof DOMTokenList !== 'undefined' &&
    !(DOMTokenList.prototype as any).forEach
  ) {
    Object.defineProperty((DOMTokenList.prototype as any), 'forEach', { value: domCollectionForEach, writable: true, enumerable: false, configurable: true });
    Object.defineProperty((DOMTokenList.prototype as any).forEach, 'name', { value: 'forEach', configurable: true });
    Object.defineProperty(((DOMTokenList.prototype as any).forEach as any), '__polyfilled', { value: true });
  }
};

applyDomCollectionForEachPolyfill();
