// Gated per prototype inside install(): there's no single support question.
import { define } from '../define.js';

export const isSupported = (): boolean => {
  try {
    return typeof NodeList !== 'undefined' && typeof (NodeList.prototype as any).forEach === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://dom.spec.whatwg.org/#interface-nodelist
 * Inspired by: core-js web.dom-collections.for-each
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

export const install = (): void => {
  if (typeof NodeList !== 'undefined' && !NodeList.prototype.forEach) {
    define((NodeList.prototype as any), 'forEach', domCollectionForEach);
  }
  // DOMTokenList (classList) is the other collection core-js patches here.
  if (
    typeof DOMTokenList !== 'undefined' &&
    !(DOMTokenList.prototype as any).forEach
  ) {
    define((DOMTokenList.prototype as any), 'forEach', domCollectionForEach);
  }
};

