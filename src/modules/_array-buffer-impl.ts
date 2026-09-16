// Ported from: the prior implementation (array-buffer.ts + is-array-buffer-supported.ts)

// ArrayBuffer.isView + .slice — Safari 7 just plain lacks both; no broken
// partials in range, so a presence check is enough.
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

/**
 * Spec: https://tc39.es/ecma262/#sec-properties-of-the-arraybuffer-constructor
 */

// isView duck-types (buffer + byteLength) instead of poking the
// [[ViewedArrayBuffer]] internal slot — real DataView / typed-array views all
// detect correctly; a hand-built lookalike would slip through.
export const arrayBufferIsView = (value: any): boolean => {
  return (
    !!value &&
    typeof value === 'object' &&
    value.buffer instanceof ArrayBuffer &&
    typeof value.byteLength === 'number'
  );
};

// ToIntegerOrInfinity: truncate toward zero, NaN becomes 0.
const toInteger = (value: any): number => {
  const numeric = +value;
  if (numeric !== numeric) return 0;
  return numeric >= 0 ? Math.floor(numeric) : Math.ceil(numeric);
};

export const arrayBufferSlice = function (this: ArrayBuffer, begin?: any, end?: any) {
  const length = this.byteLength;

  // resolve the start: negatives count from the end, then clamp into the buffer
  let from = begin === undefined ? 0 : toInteger(begin);
  from = from < 0 ? Math.max(length + from, 0) : Math.min(from, length);

  // resolve the end the same way (defaults to the buffer's length)
  let to = end === undefined ? length : toInteger(end);
  to = to < 0 ? Math.max(length + to, 0) : Math.min(to, length);

  const count = Math.max(to - from, 0);
  const sliced = new ArrayBuffer(count);
  // Uint8Array.set is native on every target (original typed-array spec) —
  // single memcpy-style copy, no per-byte JS loop on the fast path.
  new Uint8Array(sliced).set(new Uint8Array(this, from, count));
  return sliced;
};

if (typeof ArrayBuffer !== 'undefined' && !isSupported()) {
  if (typeof (ArrayBuffer as any).isView !== 'function') {
    Object.defineProperty((ArrayBuffer as any), 'isView', { value: arrayBufferIsView, writable: true, enumerable: false, configurable: true });
    Object.defineProperty((ArrayBuffer as any).isView, 'name', { value: 'isView', configurable: true });
    Object.defineProperty(((ArrayBuffer as any).isView as any), '__polyfilled', { value: true });
  }
  if (typeof (ArrayBuffer.prototype as any).slice !== 'function') {
    Object.defineProperty((ArrayBuffer.prototype as any), 'slice', { value: arrayBufferSlice, writable: true, enumerable: false, configurable: true });
    Object.defineProperty((ArrayBuffer.prototype as any).slice, 'name', { value: 'slice', configurable: true });
    Object.defineProperty(((ArrayBuffer.prototype as any).slice as any), '__polyfilled', { value: true });
  }
}
