// ids: es.array-buffer.transfer, es.array-buffer.transfer-to-fixed-length
//
// Appended to the native ArrayBuffer. Detaching is a host operation, borrowed from
// structuredClone with a transfer list, else a MessageChannel port; nothing
// installs if neither detaches (core-js's outcome too). postMessage to the page
// isn't probed: it would fire a stray `message` event on load.

import { define } from '../define.js';

export const isSupported = (): boolean => {
  try {
    if (typeof ArrayBuffer === 'undefined') {
      return false;
    }

    const proto: any = ArrayBuffer.prototype;
    if (typeof proto.transfer !== 'function' || typeof proto.transferToFixedLength !== 'function') {
      return false;
    }

    // Behavioural, not presence: a buffer that has been transferred away must
    // actually be empty afterwards, or the members are decoration.
    const probe = new ArrayBuffer(2);
    const moved = proto.transfer.call(probe, 2);
    return moved.byteLength === 2 && probe.byteLength === 0;
  } catch {
    return false;
  }
};

export const isArrayBufferTransferSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-arraybuffer.prototype.transfer
 *       https://tc39.es/ecma262/#sec-arraybuffer.prototype.transfertofixedlength
 *
 * Known limitations:
 * - [scope] Resizable buffers do not exist on these engines, so `transfer` and
 *   `transferToFixedLength` are the same operation. The distinction only
 *   becomes observable once `new ArrayBuffer(n, { maxByteLength })` works.
 * - [incomplete] Installs only where the host can actually detach. An engine
 *   with MessageChannel but no transferable support gets neither method --
 *   the same outcome core-js produces, and better than a `transfer` that
 *   quietly returns a copy while the source stays alive.
 * - [incomplete] On engines whose view constructors do not enforce detachment
 *   (Chrome 38 / V8 3.28 builds a DataView over a neutered buffer without
 *   complaint), detachment is observable only for buffers THIS module detached,
 *   via the flag below. A buffer the application detaches itself -- its own
 *   postMessage transfer list -- reports `detached === false` there, and no
 *   amount of probing can tell it from `new ArrayBuffer(0)`.
 */

// Stamped on buffers this module detaches (also read by es.array-buffer.detached):
// on Chrome 38 a neutered buffer still accepts `new DataView(buffer)`.
const DETACHED_FLAG = '__spackleDetached';

// Reused descriptor: no allocation per call.
const DETACHED_DESC: PropertyDescriptor = { value: true, configurable: true };
const markDetached = (buffer: any): void => {
  try {
    Object.defineProperty(buffer, DETACHED_FLAG, DETACHED_DESC);
  } catch (e) {
    /* sealed buffer object -- the view probe below is the only signal left */
  }
};

const isDetached = (buffer: any): boolean => {
  if (buffer.byteLength !== 0) {
    return false;
  }
  if (buffer[DETACHED_FLAG] === true) {
    return true;
  }
  try {
    new DataView(buffer);
    return false;
  } catch (e) {
    return true;
  }
};

/*
 * The detach primitive, resolved once: web.structured-clone's ES5 shim copies
 * without detaching, so a late lookup would silently stop detaching.
 */
type Detacher = ((buffer: any) => void) | null;

// window on the engines this targets; globalThis only so the same file works
// when the CJS build is required under Node.
const globalRef: any =
  typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : undefined;

const closePorts = (channel: any): void => {
  try {
    channel.port1.close();
    channel.port2.close();
  } catch (e) {
    /* ports that cannot be closed are still collectable once unreferenced */
  }
};

const resolveDetacher = (): Detacher => {
  const host: any = globalRef;
  if (!host) {
    return null;
  }

  try {
    const clone = host.structuredClone;
    if (typeof clone === 'function') {
      const probe = new ArrayBuffer(2);
      clone(probe, { transfer: [probe] });
      if (probe.byteLength === 0) {
        return function (buffer: any): void {
          clone(buffer, { transfer: [buffer] });
        };
      }
    }
  } catch (e) {
    /* no usable structuredClone -- try the port below */
  }

  try {
    const Channel = host.MessageChannel;
    if (typeof Channel === 'function') {
      const probe = new ArrayBuffer(2);
      const channel = new Channel();
      channel.port1.postMessage(null, [probe]);
      closePorts(channel);

      if (probe.byteLength === 0) {
        // A channel per call, closed before returning: transfer() is rare, so don't
        // hold one for the life of the page.
        return function (buffer: any): void {
          const live = new Channel();
          // no try/finally (not in the baseline): if postMessage throws, the
          // unclosed ports are still collectable once unreferenced
          live.port1.postMessage(null, [buffer]);
          closePorts(live);
        };
      }
    }
  } catch (e) {
    /* no transferable postMessage either */
  }

  return null;
};

// Probed lazily (install or first transfer()): importing shouldn't allocate a channel.
let detacher: Detacher = null;
let detacherResolved = false;

const getDetacher = (): Detacher => {
  if (!detacherResolved) {
    detacherResolved = true;
    detacher = resolveDetacher();
  }
  return detacher;
};

export const canDetach = (): boolean => getDetacher() !== null;

const transferImpl = function (source: any, newLength: any): ArrayBuffer {
  if (!source || typeof source !== 'object' || Object.prototype.toString.call(source) !== '[object ArrayBuffer]') {
    throw new TypeError('ArrayBuffer.prototype.transfer called on a non-ArrayBuffer');
  }
  if (isDetached(source)) {
    throw new TypeError('Cannot transfer a detached ArrayBuffer');
  }
  const detach = getDetacher();
  if (!detach) {
    throw new TypeError('This engine cannot detach an ArrayBuffer');
  }

  const oldLength = source.byteLength;
  let length = oldLength;
  if (newLength !== undefined) {
    // inlined: toIndex(newLength)
    const numeric = +newLength;
    length = numeric !== numeric ? 0 : numeric >= 0 ? Math.floor(numeric) : Math.ceil(numeric);
    if (length < 0 || length > 9007199254740991) {
      throw new RangeError('Invalid ArrayBuffer length');
    }
  }
  const next = new ArrayBuffer(length);

  // Copy BEFORE detaching -- the source is unreadable afterwards. Uint8Array#set
  // is one memcpy-style copy; core-js loops byte by byte through a DataView.
  const copyLength = Math.min(length, oldLength);
  if (copyLength > 0) {
    new Uint8Array(next).set(new Uint8Array(source, 0, copyLength));
  }

  detach(source);
  markDetached(source);
  return next;
};

export const arrayBufferTransfer = function (this: any, newLength?: any): ArrayBuffer {
  return transferImpl(this, newLength);
};

// Identical while resizable buffers do not exist on these engines; kept as its
// own export so the two module ids stay separately addressable.
export const arrayBufferTransferToFixedLength = function (this: any, newLength?: any): ArrayBuffer {
  return transferImpl(this, newLength);
};

export const install = (): void => {
  if (typeof ArrayBuffer === 'undefined') {
    return;
  }

  const proto: any = ArrayBuffer.prototype;

  // Presence first, probe second: probing allocates a MessageChannel, and there
  // is no reason to pay for that if both members are already there.
  if (typeof proto.transfer === 'function' && typeof proto.transferToFixedLength === 'function') {
    return;
  }
  if (!getDetacher()) {
    return;
  }

  if (typeof proto.transfer !== 'function') {
    define(proto, 'transfer', arrayBufferTransfer);
  }
  if (typeof proto.transferToFixedLength !== 'function') {
    define(proto, 'transferToFixedLength', arrayBufferTransferToFixedLength);
  }
};
