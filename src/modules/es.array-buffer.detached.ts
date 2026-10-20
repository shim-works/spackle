// ArrayBuffer.prototype.detached. Needs no host detach primitive, so it installs
// wherever there is an ArrayBuffer, even where `transfer` cannot work.

import { defineGetter } from '../define.js';

export const isSupported = (): boolean => {
  try {
    if (typeof ArrayBuffer === 'undefined') {
      return false;
    }
    if (!('detached' in ArrayBuffer.prototype)) {
      return false;
    }

    // Behavioural, not presence: a zero-length buffer must still report false.
    return (new ArrayBuffer(0) as any).detached === false;
  } catch {
    return false;
  }
};

export const isArrayBufferDetachedSupported = isSupported;

/** Spec: https://tc39.es/ecma262/#sec-get-arraybuffer.prototype.detached */

// Detached: no bytes AND no view can be built over it (`new ArrayBuffer(0)` has
// no bytes either). Chrome 38 builds views over neutered buffers, so
// es.array-buffer.transfer also stamps what it detaches with this flag.
const DETACHED_FLAG = '__spackleDetached';

export const arrayBufferDetached = function (this: any): boolean {
  if (!this || typeof this !== 'object' || Object.prototype.toString.call(this) !== '[object ArrayBuffer]') {
    throw new TypeError('ArrayBuffer.prototype.detached called on a non-ArrayBuffer');
  }

  if (this.byteLength !== 0) {
    return false;
  }
  if (this[DETACHED_FLAG] === true) {
    return true;
  }

  try {
    new DataView(this);
    return false;
  } catch (e) {
    return true;
  }
};

export const install = (): void => {
  if (typeof ArrayBuffer === 'undefined') {
    return;
  }
  if ('detached' in ArrayBuffer.prototype) {
    return;
  }

  defineGetter(ArrayBuffer.prototype, 'detached', arrayBufferDetached);
};
