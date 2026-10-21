import { describe, expect, it } from 'vitest';
import { uint8ArrayToBase64, uint8ArrayToHex } from '../src/modules/install-uint8-array.js';
import { arrayBufferIsView } from '../src/modules/install-array-buffer.js';

/**
 * Safari 7.1 exposes ArrayBuffer and the typed-array constructors as HOST
 * OBJECTS: `typeof Uint8Array === 'object'`, and a genuine view is not
 * `instanceof Uint8Array`. Brand checks written as `x instanceof Uint8Array`
 * therefore reject perfectly good input there -- which is exactly what
 * toBase64 / toHex / setFromBase64 did, on real Uint8Arrays.
 *
 * Node cannot be that engine, so the condition is faked the only way that
 * matters to the code under test: swap the global for a non-callable object,
 * which is what breaks `instanceof`. Object.prototype.toString still reports
 * the brand, exactly as it does on the real engine.
 */
const withHostObjectConstructor = (name: 'Uint8Array' | 'ArrayBuffer', body: () => void): void => {
  const real = (globalThis as any)[name];
  // A plain object: `x instanceof thisThing` throws "not callable", and
  // `typeof thisThing` is 'object' -- both Safari 7.1 symptoms.
  (globalThis as any)[name] = { prototype: real.prototype };
  try {
    body();
  } finally {
    (globalThis as any)[name] = real;
  }
};

describe('typed-array brand checks survive host-object constructors', () => {
  it('toBase64 / toHex accept a real Uint8Array when instanceof cannot work', () => {
    const view = new Uint8Array([72, 105]);
    withHostObjectConstructor('Uint8Array', () => {
      expect(uint8ArrayToBase64.call(view)).toBe('SGk=');
      expect(uint8ArrayToHex.call(view)).toBe('4869');
    });
  });

  it('and still reject things that are not Uint8Arrays', () => {
    withHostObjectConstructor('Uint8Array', () => {
      expect(() => uint8ArrayToBase64.call(new Float32Array(2) as any)).toThrow(TypeError);
      expect(() => uint8ArrayToBase64.call({} as any)).toThrow(TypeError);
      expect(() => uint8ArrayToBase64.call([1, 2] as any)).toThrow(TypeError);
      // a @@toStringTag spoof carries the brand but not the element size
      const spoof: any = { byteLength: 2 };
      spoof[Symbol.toStringTag] = 'Uint8Array';
      expect(() => uint8ArrayToBase64.call(spoof)).toThrow(TypeError);
    });
  });

  it('ArrayBuffer.isView answers correctly when instanceof cannot work', () => {
    // Built BEFORE the swap: the fake global is not constructible, where the
    // real host object is. instanceof is the only thing being simulated.
    const view = new Uint8Array(4);
    const dataView = new DataView(new ArrayBuffer(4));
    const bareBuffer = new ArrayBuffer(4);
    withHostObjectConstructor('ArrayBuffer', () => {
      expect(arrayBufferIsView(view)).toBe(true);
      expect(arrayBufferIsView(dataView)).toBe(true);
      expect(arrayBufferIsView(bareBuffer as any)).toBe(false);
      expect(arrayBufferIsView({ buffer: {}, byteLength: 1 })).toBe(false);
      expect(arrayBufferIsView(null)).toBe(false);
    });
  });
});
