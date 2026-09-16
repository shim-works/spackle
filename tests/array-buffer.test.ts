import { arrayBufferIsView, arrayBufferSlice, isArrayBufferSupported } from '../src/modules/_array-buffer-impl.js';


describe('ArrayBuffer.isView — polyfill vs native', () => {
  it('true for typed array views and DataView', () => {
    const buf = new ArrayBuffer(8);
    const view = new Uint8Array(buf);
    const nativeResult = ArrayBuffer.isView(view);
    const specResult = arrayBufferIsView(view);
    expect(specResult).toBe(nativeResult);
    expect(arrayBufferIsView(new DataView(buf))).toBe(ArrayBuffer.isView(new DataView(buf)));
    expect(arrayBufferIsView(new Float64Array(2))).toBe(ArrayBuffer.isView(new Float64Array(2)));
  });

  // test262: non-views — buffer itself, plain arrays, primitives, null
  it('false for non-views', () => {
    const buf = new ArrayBuffer(8);
    expect(arrayBufferIsView(buf)).toBe(ArrayBuffer.isView(buf));
    expect(arrayBufferIsView([])).toBe(ArrayBuffer.isView([]));
    expect(arrayBufferIsView({})).toBe(ArrayBuffer.isView({}));
    expect(arrayBufferIsView(null)).toBe(ArrayBuffer.isView(null as any));
    expect(arrayBufferIsView(undefined)).toBe(ArrayBuffer.isView(undefined as any));
    expect(arrayBufferIsView(42)).toBe(ArrayBuffer.isView(42 as any));
    expect(arrayBufferIsView('view')).toBe(ArrayBuffer.isView('view' as any));
  });
});

describe('ArrayBuffer.prototype.slice — polyfill vs native', () => {
  const mk = (): ArrayBuffer => {
    const buf = new ArrayBuffer(8);
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < 8; i++) bytes[i] = i + 1;
    return buf;
  };
  const toArray = (buf: ArrayBuffer): number[] => Array.prototype.slice.call(new Uint8Array(buf));

  it('copies a middle region', () => {
    const buf = mk();
    const nativeResult = toArray(buf.slice(2, 5));
    const specResult = toArray(arrayBufferSlice.call(buf, 2, 5));
    expect(specResult).toEqual(nativeResult);
  });

  // test262: relative (negative) indices, missing end, start > end, out of range
  it('handles negative / missing / inverted bounds', () => {
    const buf = mk();
    expect(toArray(arrayBufferSlice.call(buf, -3))).toEqual(toArray(buf.slice(-3)));
    expect(toArray(arrayBufferSlice.call(buf, 0, -2))).toEqual(toArray(buf.slice(0, -2)));
    expect(toArray(arrayBufferSlice.call(buf))).toEqual(toArray(buf.slice()));
    expect(toArray(arrayBufferSlice.call(buf, 5, 2))).toEqual(toArray(buf.slice(5, 2)));
    expect(toArray(arrayBufferSlice.call(buf, 99))).toEqual(toArray(buf.slice(99)));
    expect(toArray(arrayBufferSlice.call(buf, -99))).toEqual(toArray(buf.slice(-99)));
  });

  // test262: result is a new buffer — mutating it leaves the source intact
  it('returns a copy, not a view', () => {
    const buf = mk();
    const spec = arrayBufferSlice.call(buf, 0, 4);
    expect(spec instanceof ArrayBuffer).toBe(true);
    new Uint8Array(spec)[0] = 99;
    expect(new Uint8Array(buf)[0]).toBe(1);
  });

  it('probe reports native support in a modern browser', () => {
    expect(isArrayBufferSupported()).toBe(true);
  });
});
