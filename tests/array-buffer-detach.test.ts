import { noViewDetachEnforcement } from './engine-capabilities.js';
import { arrayBufferDetached, isSupported as detachedSupported } from '../src/modules/es.array-buffer.detached.js';
import {
  arrayBufferTransfer,
  arrayBufferTransferToFixedLength,
  canDetach,
  isSupported as transferSupported,
} from '../src/modules/es.array-buffer.transfer.js';

/**
 * Local conformance only -- the device-level coverage lives in spackle-verify,
 * which runs the ported test262 cases on the engine in front of you.
 *
 * Node has all three natives, so every case here is polyfill-vs-native on the
 * same input, the shape tests/array-buffer.test.ts uses.
 */

const filled = (length: number): ArrayBuffer => {
  const buf = new ArrayBuffer(length);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < length; i++) bytes[i] = i + 1;
  return buf;
};

const toArray = (buf: ArrayBuffer): number[] => Array.prototype.slice.call(new Uint8Array(buf));

describe('ArrayBuffer detach family', () => {
  it('the host can detach, so these tests mean something', () => {
    expect(canDetach()).toBe(true);
    expect(detachedSupported()).toBe(true); // node has the natives
    expect(transferSupported()).toBe(true);
  });

  describe('ArrayBuffer.prototype.detached — polyfill vs native', () => {
    it('false for a live buffer', () => {
      const buf = new ArrayBuffer(8);
      expect(arrayBufferDetached.call(buf)).toBe((buf as any).detached);
      expect(arrayBufferDetached.call(buf)).toBe(false);
    });

    // a zero-length buffer is 0 bytes and very much alive -- byteLength alone
    // cannot answer this
    it('false for an empty but live buffer', () => {
      const buf = new ArrayBuffer(0);
      expect(arrayBufferDetached.call(buf)).toBe((buf as any).detached);
      expect(arrayBufferDetached.call(buf)).toBe(false);
    });

    it('true once the buffer has been transferred away', () => {
      const buf = new ArrayBuffer(8);
      (buf as any).transfer();
      expect(arrayBufferDetached.call(buf)).toBe((buf as any).detached);
      expect(arrayBufferDetached.call(buf)).toBe(true);
    });

    // test262: the getter has a [[ArrayBufferData]] brand check
    it('throws on a non-ArrayBuffer', () => {
      expect(() => arrayBufferDetached.call({})).toThrow(TypeError);
      expect(() => arrayBufferDetached.call(new Uint8Array(4))).toThrow(TypeError);
      expect(() => arrayBufferDetached.call(null)).toThrow(TypeError);
    });
  });

  describe('ArrayBuffer.prototype.transfer — polyfill vs native', () => {
    it('preserves contents and length when called with no argument', () => {
      const nativeSource = filled(8);
      const specSource = filled(8);
      const nativeResult = (nativeSource as any).transfer();
      const specResult = arrayBufferTransfer.call(specSource);

      expect(toArray(specResult)).toEqual(toArray(nativeResult));
      expect(toArray(specResult)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('detaches the source', () => {
      const buf = filled(8);
      arrayBufferTransfer.call(buf);
      expect(buf.byteLength).toBe(0);
      expect((buf as any).detached).toBe(true);
    });

    it('zero-fills the tail when growing', () => {
      const nativeResult = (filled(4) as any).transfer(6);
      const specResult = arrayBufferTransfer.call(filled(4), 6);
      expect(toArray(specResult)).toEqual(toArray(nativeResult));
      expect(toArray(specResult)).toEqual([1, 2, 3, 4, 0, 0]);
    });

    it('truncates when shrinking', () => {
      const nativeResult = (filled(8) as any).transfer(3);
      const specResult = arrayBufferTransfer.call(filled(8), 3);
      expect(toArray(specResult)).toEqual(toArray(nativeResult));
      expect(toArray(specResult)).toEqual([1, 2, 3]);
    });

    it('accepts a zero length', () => {
      const specResult = arrayBufferTransfer.call(filled(4), 0);
      expect(specResult.byteLength).toBe(0);
    });

    // test262: transfer on an already-detached buffer is a TypeError
    it('throws when the source is already detached', () => {
      const buf = filled(8);
      arrayBufferTransfer.call(buf);
      expect(() => arrayBufferTransfer.call(buf)).toThrow(TypeError);
    });

    it('throws on a non-ArrayBuffer', () => {
      expect(() => arrayBufferTransfer.call({})).toThrow(TypeError);
      expect(() => arrayBufferTransfer.call(new Uint8Array(4))).toThrow(TypeError);
    });

    // test262: ToIndex rejects negatives
    it('throws RangeError on a negative length', () => {
      expect(() => arrayBufferTransfer.call(filled(4), -1)).toThrow(RangeError);
    });
  });

  describe('ArrayBuffer.prototype.transferToFixedLength — polyfill vs native', () => {
    it('matches native on copy, grow and shrink', () => {
      expect(toArray(arrayBufferTransferToFixedLength.call(filled(4)))).toEqual(
        toArray((filled(4) as any).transferToFixedLength())
      );
      expect(toArray(arrayBufferTransferToFixedLength.call(filled(4), 6))).toEqual(
        toArray((filled(4) as any).transferToFixedLength(6))
      );
      expect(toArray(arrayBufferTransferToFixedLength.call(filled(8), 2))).toEqual(
        toArray((filled(8) as any).transferToFixedLength(2))
      );
    });

    it('detaches the source', () => {
      const buf = filled(8);
      arrayBufferTransferToFixedLength.call(buf);
      expect((buf as any).detached).toBe(true);
    });
  });

  /*
   * Chrome 38 / V8 3.28 neuters a buffer to zero bytes and then builds views
   * over it anyway, so the DataView probe reports "attached" forever. Node has
   * no such engine to test on, so the engine is faked: a permissive DataView is
   * exactly the shape that broke, and the flag transfer() stamps is what has to
   * carry both readers through it.
   */
  describe('an engine whose views do not enforce detachment', () => {
    const withPermissiveDataView = (body: () => void): void => {
      const RealDataView = globalThis.DataView;
      (globalThis as any).DataView = function () {} as any;
      try {
        body();
      } finally {
        (globalThis as any).DataView = RealDataView;
      }
    };

    it('still reports the source detached, and still refuses a second transfer', () => {
      const buf = filled(8);
      arrayBufferTransfer.call(buf);
      withPermissiveDataView(() => {
        expect(arrayBufferDetached.call(buf)).toBe(true);
        expect(() => arrayBufferTransfer.call(buf)).toThrow(TypeError);
      });
    });

    // the flag is a fallback, not a replacement: an unstamped live buffer with
    // zero bytes must not start reading as detached
    it('does not mistake an empty live buffer for a detached one', () => {
      withPermissiveDataView(() => {
        expect(arrayBufferDetached.call(new ArrayBuffer(0))).toBe(false);
      });
    });
  });

  // Skipped where the engine's own constructors do not enforce it: on Chrome 38
  // they do not, spackle never replaces a native, and asserting it there is
  // asserting an engine trait.
  describe('views over a detached buffer', () => {
    it.skipIf(noViewDetachEnforcement())('cannot be constructed', () => {
      const buf = filled(8);
      arrayBufferTransfer.call(buf);
      // name rather than instanceof: under the jsdom environment the typed-array
      // constructors come from the window realm, so their TypeError is not the
      // same binding this file closes over.
      expect(() => new DataView(buf)).toThrow(/detached/i);
      expect(() => new Uint8Array(buf, 0, 1)).toThrow(/detached/i);
    });
  });
});
