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
const objectToString = Object.prototype.toString;
const isObject = (value: any): boolean =>
  value !== null && (typeof value === 'object' || typeof value === 'function');
const getterOf = (owner: any, key: any): any => {
  try {
    const desc = owner && Object.getOwnPropertyDescriptor(owner, key);
    return desc && typeof desc.get === 'function' ? desc.get : undefined;
  } catch (e) {
    return undefined;
  }
};
const tagKey: any = typeof Symbol !== 'undefined' ? (Symbol as any).toStringTag : undefined;
// Native brand probes, captured at load. %TypedArray%.prototype[@@toStringTag]
// returns undefined (never throws) for a non-view; DataView's buffer getter throws
// for a non-DataView and, unlike byteLength, not for a detached one.
const typedArrayTagGetter: any =
  typeof Int8Array !== 'undefined' && tagKey ? getterOf(Object.getPrototypeOf(Int8Array.prototype), tagKey) : undefined;
const dataViewBufferGetter: any = typeof DataView !== 'undefined' ? getterOf(DataView.prototype, 'buffer') : undefined;
const bufferByteLengthGetter: any = typeof ArrayBuffer !== 'undefined' ? getterOf(ArrayBuffer.prototype, 'byteLength') : undefined;
const bufferDetachedGetter: any = typeof ArrayBuffer !== 'undefined' ? getterOf(ArrayBuffer.prototype, 'detached') : undefined;
// ES5 engines (Safari 7.1) brand by class string: views and buffers are host objects.
const VIEW_TAGS = '[object Int8Array][object Uint8Array][object Uint8ClampedArray][object Int16Array][object Uint16Array][object Int32Array][object Uint32Array][object Float32Array][object Float64Array][object Float16Array][object BigInt64Array][object BigUint64Array][object DataView]';

/** Spec: https://tc39.es/ecma262/#sec-arraybuffer.isview -- has [[ViewedArrayBuffer]]? */
export const arrayBufferIsView = function isView(value: any): boolean {
  if (!isObject(value)) return false;
  if (typedArrayTagGetter || dataViewBufferGetter) {
    if (typedArrayTagGetter && typedArrayTagGetter.call(value) !== undefined) return true;
    if (dataViewBufferGetter) {
      try {
        dataViewBufferGetter.call(value);
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }
  const tag = objectToString.call(value);
  return tag.charAt(tag.length - 1) === ']' && VIEW_TAGS.indexOf(tag) !== -1;
};

// RequireInternalSlot(O, [[ArrayBufferData]]) and not shared; returns byteLength.
const requireArrayBuffer = (O: any, what: string): number => {
  if (!isObject(O)) throw new TypeError(what + ' is not an ArrayBuffer');
  const tag = objectToString.call(O);
  if (tag === '[object SharedArrayBuffer]') throw new TypeError(what + ' is a SharedArrayBuffer');
  if (bufferByteLengthGetter) {
    // throws a TypeError for anything without [[ArrayBufferData]]
    return bufferByteLengthGetter.call(O);
  }
  if (tag !== '[object ArrayBuffer]') throw new TypeError(what + ' is not an ArrayBuffer');
  return O.byteLength;
};
const isDetached = (O: any): boolean => !!(bufferDetachedGetter && bufferDetachedGetter.call(O));

/** Spec: https://tc39.es/ecma262/#sec-arraybuffer.prototype.slice */
export const arrayBufferSlice = function slice(this: any, start?: any, end?: any): any {
  const O = this;
  const length = requireArrayBuffer(O, 'ArrayBuffer.prototype.slice receiver');
  if (isDetached(O)) throw new TypeError('ArrayBuffer.prototype.slice called on a detached ArrayBuffer');

  // resolve the start: negatives count from the end, then clamp into the buffer
  let first = +start; // ToIntegerOrInfinity; undefined -> NaN -> 0
  first = first !== first ? 0 : first < 0 ? Math.ceil(first) : Math.floor(first);
  first = first < 0 ? Math.max(length + first, 0) : Math.min(first, length);

  // resolve the end the same way (defaults to the buffer's length)
  let final = length;
  if (end !== undefined) {
    final = +end;
    final = final !== final ? 0 : final < 0 ? Math.ceil(final) : Math.floor(final);
  }
  final = final < 0 ? Math.max(length + final, 0) : Math.min(final, length);

  const newLength = Math.max(final - first, 0);

  // SpeciesConstructor(O, %ArrayBuffer%)
  let C: any = O.constructor;
  if (C === undefined) {
    C = ArrayBuffer;
  } else {
    if (!isObject(C)) throw new TypeError('ArrayBuffer constructor is not an object');
    const S = typeof Symbol !== 'undefined' && (Symbol as any).species ? C[(Symbol as any).species] : undefined;
    if (S === undefined || S === null) C = ArrayBuffer;
    else if (typeof S === 'function') C = S;
    else throw new TypeError('ArrayBuffer @@species is not a constructor');
  }
  const created: any = new C(newLength);
  const createdLength = requireArrayBuffer(created, 'ArrayBuffer.prototype.slice species result');
  if (isDetached(created)) throw new TypeError('ArrayBuffer.prototype.slice species result is detached');
  if (created === O) throw new TypeError('ArrayBuffer.prototype.slice species result is the receiver');
  if (createdLength < newLength) throw new TypeError('ArrayBuffer.prototype.slice species result is too small');
  // the species constructor could have detached O
  if (isDetached(O)) throw new TypeError('ArrayBuffer.prototype.slice: the receiver was detached');
  // Uint8Array.set is native on every target (original typed-array spec) --
  // single memcpy-style copy, no per-byte JS loop on the fast path.
  if (newLength > 0) new Uint8Array(created).set(new Uint8Array(O, first, newLength));
  return created;
};

export const installArrayBuffer = (): void => {
  if (typeof ArrayBuffer !== 'undefined') {
    if (typeof (ArrayBuffer as any).isView !== 'function') {
      define((ArrayBuffer as any), 'isView', arrayBufferIsView);
    }
    if (typeof (ArrayBuffer.prototype as any).slice !== 'function') {
      define((ArrayBuffer.prototype as any), 'slice', arrayBufferSlice);
    }
  }
};
