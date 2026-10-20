import { mathSumPrecise } from '../src/modules/es.math.sum-precise.js';

/**
 * Math.sumPrecise. Covers the re-entrancy latch: with no try/finally, a
 * throwing input must still release it, or later calls fall onto the
 * allocating path (still correct, so correctness is what is checked here).
 */
describe('Math.sumPrecise', () => {
  it('sums exactly where naive addition rounds', () => {
    expect(mathSumPrecise([1e20, 0.1, -1e20])).toBe(0.1);
    expect(mathSumPrecise([0.1, 0.2])).toBe(0.30000000000000004);
  });

  it('throws on a non-number item, and the next call is still exact', () => {
    expect(() => mathSumPrecise([1, 'x' as any])).toThrow(TypeError);
    expect(mathSumPrecise([1e20, 0.1, -1e20])).toBe(0.1);
  });

  it('throws when the iterable itself throws, and the next call is still exact', () => {
    const bad: any = {
      [Symbol.iterator]() {
        return { next() { throw new Error('boom'); } };
      },
    };
    expect(() => mathSumPrecise(bad)).toThrow('boom');
    expect(mathSumPrecise([3, 4])).toBe(7);
  });
});
