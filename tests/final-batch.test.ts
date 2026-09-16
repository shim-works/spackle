import { wrapErrorConstructor } from '../src/modules/es.error.cause.js';
import {
  mathF16round,
  dataViewGetFloat16,
  dataViewSetFloat16,
  doubleToFloat16Bits,
  float16BitsToDouble,
} from '../src/modules/_float16-impl.js';
import { mathSumPrecise } from '../src/modules/es.math.sum-precise.js';
import { arrayFromAsync } from '../src/modules/es.array.from-async.js';

describe('Error cause', () => {
  const Wrapped: any = wrapErrorConstructor(TypeError);

  it('reads cause off the options bag', () => {
    expect(new Wrapped('boom', { cause: 42 }).cause).toBe(42);
  });

  it('keeps instanceof working in both directions', () => {
    const error = new Wrapped('boom', { cause: 1 });
    // the assertion that catches a prototype-identity regression
    expect(error instanceof TypeError).toBe(true);
    expect(error instanceof Error).toBe(true);
    expect(error instanceof Wrapped).toBe(true);
    expect(Wrapped.prototype).toBe(TypeError.prototype);
  });

  it('keeps message, name and a real stack', () => {
    const error = new Wrapped('boom');
    expect(error.message).toBe('boom');
    expect(error.name).toBe('TypeError');
    expect(typeof error.stack).toBe('string');
  });

  it('adds no cause property when no options bag is given', () => {
    expect('cause' in new Wrapped('boom')).toBe(false);
    expect('cause' in new Wrapped('boom', {})).toBe(false);
  });

  it('defines cause non-enumerably, like every other Error own property', () => {
    const error = new Wrapped('boom', { cause: 1 });
    expect(error.propertyIsEnumerable('cause')).toBe(false);
    expect(Object.keys(error)).not.toContain('cause');
  });

  it('accepts an undefined cause as a present one', () => {
    const error = new Wrapped('boom', { cause: undefined });
    expect('cause' in error).toBe(true);
    expect(error.cause).toBe(undefined);
  });

  it('works without new', () => {
    expect(Wrapped('boom', { cause: 2 }).cause).toBe(2);
  });
});

describe('float16', () => {
  it('round-trips values that are exact in binary16', () => {
    for (const value of [0, 1, -1, 2, -2, 0.5, -0.5, 1024, 65504]) {
      expect(mathF16round(value)).toBe(value);
    }
  });

  it('preserves the sign of zero', () => {
    expect(1 / mathF16round(-0)).toBe(-Infinity);
    expect(1 / mathF16round(0)).toBe(Infinity);
  });

  it('handles the non-finite cases', () => {
    expect(mathF16round(Infinity)).toBe(Infinity);
    expect(mathF16round(-Infinity)).toBe(-Infinity);
    expect(mathF16round(NaN)).toBeNaN();
  });

  it('overflows to Infinity past the top of the range', () => {
    expect(mathF16round(65504)).toBe(65504); // largest finite half
    expect(mathF16round(70000)).toBe(Infinity);
    expect(mathF16round(-70000)).toBe(-Infinity);
  });

  it('rounds a value that binary16 cannot hold exactly', () => {
    // 1.1 is not representable; nearest half is 1.099609375
    expect(mathF16round(1.1)).toBeCloseTo(1.0996, 4);
    expect(mathF16round(1.1)).not.toBe(1.1);
  });

  it('handles subnormals and underflow', () => {
    const smallestSubnormal = 5.960464477539063e-8;
    expect(mathF16round(smallestSubnormal)).toBe(smallestSubnormal);
    expect(mathF16round(smallestSubnormal / 4)).toBe(0);
  });

  it('encodes the documented bit patterns', () => {
    expect(doubleToFloat16Bits(0)).toBe(0x0000);
    expect(doubleToFloat16Bits(-0)).toBe(0x8000);
    expect(doubleToFloat16Bits(1)).toBe(0x3c00);
    expect(doubleToFloat16Bits(-2)).toBe(0xc000);
    expect(doubleToFloat16Bits(Infinity)).toBe(0x7c00);
    expect(float16BitsToDouble(0x3c00)).toBe(1);
    expect(float16BitsToDouble(0x7c00)).toBe(Infinity);
    expect(float16BitsToDouble(0x7e00)).toBeNaN();
  });

  it('reads and writes through a DataView, both endiannesses', () => {
    const view = new DataView(new ArrayBuffer(4));
    dataViewSetFloat16.call(view, 0, 1.5, true);
    expect(dataViewGetFloat16.call(view, 0, true)).toBe(1.5);

    dataViewSetFloat16.call(view, 2, -0.25, false);
    expect(dataViewGetFloat16.call(view, 2, false)).toBe(-0.25);
  });

  it('writes two bytes, and endianness actually swaps them', () => {
    const view = new DataView(new ArrayBuffer(2));
    dataViewSetFloat16.call(view, 0, 1, true);
    const little = [view.getUint8(0), view.getUint8(1)];
    dataViewSetFloat16.call(view, 0, 1, false);
    const big = [view.getUint8(0), view.getUint8(1)];
    expect(little).toEqual([big[1], big[0]]);
  });
});

describe('Math.sumPrecise', () => {
  it('keeps precision that naive summation loses', () => {
    // the canonical case: left-to-right gives 0
    expect([1e20, 0.1, -1e20].reduce((a, b) => a + b, 0)).toBe(0);
    expect(mathSumPrecise([1e20, 0.1, -1e20])).toBe(0.1);
  });

  it('sums ordinary values', () => {
    expect(mathSumPrecise([1, 2, 3])).toBe(6);
    expect(mathSumPrecise([0.1, 0.2])).toBe(0.30000000000000004);
  });

  it('returns -0 for an empty iterable, not +0', () => {
    const result = mathSumPrecise([]);
    // toBe is Object.is, so this distinguishes -0 from +0 on its own
    expect(result).toBe(-0);
    expect(1 / result).toBe(-Infinity);
  });

  it('handles the non-finite cases', () => {
    expect(mathSumPrecise([1, NaN])).toBeNaN();
    expect(mathSumPrecise([1, Infinity])).toBe(Infinity);
    expect(mathSumPrecise([1, -Infinity])).toBe(-Infinity);
    expect(mathSumPrecise([Infinity, -Infinity])).toBeNaN();
  });

  it('accepts any iterable, not just arrays', () => {
    expect(mathSumPrecise(new Set([1, 2, 3]))).toBe(6);
  });

  it('rejects non-numbers and non-iterables', () => {
    expect(() => mathSumPrecise([1, '2'])).toThrow(TypeError);
    expect(() => mathSumPrecise(1)).toThrow(TypeError);
    expect(() => mathSumPrecise(null)).toThrow(TypeError);
  });
});

describe('Array.fromAsync', () => {
  const asyncIterableOf = (values: any[]) => ({
    [Symbol.asyncIterator]() {
      let index = 0;
      return {
        next: () =>
          Promise.resolve(
            index < values.length
              ? { value: values[index++], done: false }
              : { value: undefined, done: true }
          ),
      };
    },
  });

  it('collects an async iterable', async () => {
    await expect(arrayFromAsync(asyncIterableOf([1, 2, 3]))).resolves.toEqual([1, 2, 3]);
  });

  it('resolves promise elements of a sync iterable', async () => {
    await expect(
      arrayFromAsync([Promise.resolve(1), 2, Promise.resolve(3)])
    ).resolves.toEqual([1, 2, 3]);
  });

  it('handles an array-like', async () => {
    await expect(arrayFromAsync({ length: 2, 0: 'a', 1: 'b' })).resolves.toEqual([
      'a',
      'b',
    ]);
  });

  it('applies a mapFn with the index and awaits its result', async () => {
    await expect(
      arrayFromAsync([1, 2], (v: number, i: number) => Promise.resolve(v * 10 + i))
    ).resolves.toEqual([10, 21]);
  });

  it('preserves order even when later values settle first', async () => {
    const slowThenFast = [
      new Promise((resolve) => setTimeout(() => resolve('slow'), 20)),
      Promise.resolve('fast'),
    ];
    await expect(arrayFromAsync(slowThenFast)).resolves.toEqual(['slow', 'fast']);
  });

  it('rejects when an element rejects', async () => {
    await expect(arrayFromAsync([Promise.reject(new Error('boom'))])).rejects.toThrow(
      'boom'
    );
  });

  it('rejects on a bad mapFn or a nullish source', async () => {
    await expect(arrayFromAsync([1], 1 as any)).rejects.toThrow(TypeError);
    await expect(arrayFromAsync(null)).rejects.toThrow(TypeError);
  });

  it('always returns a promise, never a bare array', () => {
    expect(typeof arrayFromAsync([1]).then).toBe('function');
  });
});

/**
 * Regressions from real test262 (Math/sumPrecise/sum.js). These constants are
 * test262's own, "chosen for having exercised bugs in real implementations".
 * The previous Shewchuk-based implementation returned NaN for most of them:
 * its two-sum step overflowed to Infinity near MAX_VALUE, and
 * Infinity + -Infinity is NaN.
 */
describe('Math.sumPrecise near the overflow boundary (from test262)', () => {
  it('stays finite where the true sum is finite', () => {
    expect(mathSumPrecise([8.98846567431158e307, 8.988465674311579e307, -1.7976931348623157e308]))
      .toBe(9.9792015476736e291);
    expect(mathSumPrecise([-2.534858246857893e115, 8.988465674311579e307, 8.98846567431158e307]))
      .toBe(1.7976931348623157e308);
    expect(mathSumPrecise([-1.9807040628566093e28, 1.7976931348623157e308, 9.9792015476736e291]))
      .toBe(1.7976931348623157e308);
  });

  it('overflows only when the true sum really does', () => {
    expect(mathSumPrecise([8.98846567431158e307, 8.98846567431158e307])).toBe(Infinity);
    expect(mathSumPrecise([1.3588124894186193e308, 1.4803986201152006e223, 6.741349255733684e307]))
      .toBe(Infinity);
    expect(mathSumPrecise([6.197409167220438e-223, -9.979201547673601e291, -1.7976931348623157e308]))
      .toBe(-Infinity);
  });

  it('rounds exactly across a wide magnitude spread', () => {
    expect(mathSumPrecise([1e308, 1e308, 0.1, 0.1, 1e30, 0.1, -1e30, -1e308, -1e308]))
      .toBe(0.30000000000000004);
    expect(mathSumPrecise([-5.630637621603525e255, 9.565271205476345e307, 2.9937604643020797e292]))
      .toBe(9.565271205476347e307);
    expect(mathSumPrecise([4.49423283715579e307, 8.944251746776101e307, -0.0002441406250000001,
      1.1752060710043817e308, 4.940846717201632e292, -1.6836699406454528e308]))
      .toBe(8.353845887521184e307);
  });

  it('handles -0 exactly per spec', () => {
    expect(mathSumPrecise([-0])).toBe(-0);
    expect(mathSumPrecise([-0, -0])).toBe(-0);
    expect(mathSumPrecise([-0, 0])).toBe(0);
    expect(mathSumPrecise([1e308, -1e308])).toBe(0);
  });

  it('closes the iterator and does not coerce when a value is not a Number', () => {
    let returnCalls = 0;
    let coercions = 0;
    const hostile = {
      valueOf() { coercions++; throw new Error('must not coerce'); },
      toString() { coercions++; throw new Error('must not coerce'); },
    };
    const iterable = {
      [Symbol.iterator]: () => ({
        next: () => ({ done: false, value: hostile }),
        return() { returnCalls++; return {}; },
      }),
    };
    expect(() => mathSumPrecise(iterable)).toThrow(TypeError);
    expect(coercions).toBe(0);
    expect(returnCalls).toBe(1);
  });
});
