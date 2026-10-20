// ids: es.array-buffer.is-view, es.array-buffer.slice

// ArrayBuffer.isView + .slice — Safari 7 just plain lacks both; no broken
// partials in range, so a presence check is enough.
import { define } from '../define.js';

export const isSupported = (): boolean => {
  try {
    if (typeof ArrayBuffer === 'undefined') {
      return false;
    }

    return (
      typeof (ArrayBuffer as any).isView === 'function' &&
      typeof (ArrayBuffer.prototype as any).slice === 'function'
    );
  } catch {
    return false;
  }
};

export const isArrayBufferSupported = isSupported;

/** Spec: https://tc39.es/ecma262/#sec-properties-of-the-arraybuffer-constructor */

// isView duck-types (buffer + byteLength) instead of poking the
// [[ViewedArrayBuffer]] internal slot — real DataView / typed-array views all
// detect correctly; a hand-built lookalike would slip through.
export const arrayBufferIsView = (value: any): boolean => {
  return (
    !!value &&
    typeof value === 'object' &&
    !!value.buffer &&
    // The brand, not instanceof: Safari 7.1's ArrayBuffer and typed-array
    // constructors are host objects, where `x instanceof ArrayBuffer` is false
    // for a genuine buffer -- isView() would then answer false for every real
    // view on that engine.
    Object.prototype.toString.call(value.buffer) === '[object ArrayBuffer]' &&
    typeof value.byteLength === 'number'
  );
};

export const arrayBufferSlice = function (this: ArrayBuffer, begin?: any, end?: any) {
  const length = this.byteLength;

  // resolve the start: negatives count from the end, then clamp into the buffer
  let from = 0;
  if (begin !== undefined) {
    // inlined: toInteger(begin)
    from = +begin;
    from = from !== from ? 0 : from < 0 ? Math.ceil(from) : Math.floor(from);
  }
  from = from < 0 ? Math.max(length + from, 0) : Math.min(from, length);

  // resolve the end the same way (defaults to the buffer's length)
  let to = length;
  if (end !== undefined) {
    // inlined: toInteger(end)
    to = +end;
    to = to !== to ? 0 : to < 0 ? Math.ceil(to) : Math.floor(to);
  }
  to = to < 0 ? Math.max(length + to, 0) : Math.min(to, length);

  const count = Math.max(to - from, 0);
  const sliced = new ArrayBuffer(count);
  // Uint8Array.set is native on every target (original typed-array spec) —
  // single memcpy-style copy, no per-byte JS loop on the fast path.
  new Uint8Array(sliced).set(new Uint8Array(this, from, count));
  return sliced;
};

export const install = (): void => {
  if (typeof ArrayBuffer !== 'undefined') {
    if (typeof (ArrayBuffer as any).isView !== 'function') {
      define((ArrayBuffer as any), 'isView', arrayBufferIsView);
    }
    if (typeof (ArrayBuffer.prototype as any).slice !== 'function') {
      define((ArrayBuffer.prototype as any), 'slice', arrayBufferSlice);
    }
  }
};
