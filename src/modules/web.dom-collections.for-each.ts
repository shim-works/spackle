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

/*
 * WebIDL: an iterable declaration on an interface with indexed properties
 * (NodeList, DOMTokenList) makes forEach the %Array.prototype.forEach% function
 * itself -- an enumerable operation. Installed as that native, so it is neither
 * renamed nor marked; domCollectionForEach above serves engines without one.
 */
const installForEach = (proto: any): void => {
  const arrayForEach = (Array.prototype as any).forEach;
  // Present already: keep it, unless spackle replaced Array.prototype.forEach --
  // then follow it, so the collection's forEach stays that same function.
  if (proto.forEach && !(arrayForEach && arrayForEach.__polyfilled === true && proto.forEach !== arrayForEach)) return;
  if (typeof arrayForEach === 'function') {
    Object.defineProperty(proto, 'forEach', { value: arrayForEach, writable: true, enumerable: true, configurable: true });
  } else {
    define(proto, 'forEach', domCollectionForEach);
  }
};

export const install = (): void => {
  if (typeof NodeList !== 'undefined') installForEach(NodeList.prototype);
  // DOMTokenList (classList) is the other indexed iterable interface.
  if (typeof DOMTokenList !== 'undefined') installForEach(DOMTokenList.prototype);
};
