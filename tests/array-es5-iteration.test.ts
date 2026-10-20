import { arrayEvery } from '../src/modules/es.array.every.js';
import { arraySome } from '../src/modules/es.array.some.js';
import { arrayForEach } from '../src/modules/es.array.for-each.js';
import { arrayJoin } from '../src/modules/es.array.join.js';

/**
 * Conformance for the ES5 array iteration/join islands. core-js reinstalls
 * these for spec-strictness; we exercise the hand-rolled impls directly,
 * including hole-skipping, thisArg, and the null-this guard.
 */
describe('Array.prototype.every island', () => {
  it('returns true only when every element passes', () => {
    expect(arrayEvery.call([1, 2, 3], (x: number) => x < 5)).toBe(true);
    expect(arrayEvery.call([1, 2, 9], (x: number) => x < 5)).toBe(false);
  });
  it('honours thisArg and skips holes', () => {
    const ctx = { limit: 5 };
    expect(arrayEvery.call([1, 2, 3], function (this: any, x: number) { return x < this.limit; }, ctx)).toBe(true);
    let visited = 0;
    arrayEvery.call([1, , 3] as any, () => { visited++; return true; });
    expect(visited).toBe(2);
  });
  it('throws on a null this', () => {
    expect(() => arrayEvery.call(null as any, () => true)).toThrow(TypeError);
  });
});

describe('Array.prototype.some island', () => {
  it('returns true when any element passes', () => {
    expect(arraySome.call([1, 2, 3], (x: number) => x > 2)).toBe(true);
    expect(arraySome.call([1, 2, 3], (x: number) => x > 9)).toBe(false);
  });
});

describe('Array.prototype.forEach island', () => {
  it('visits each present index with (value, index, array)', () => {
    const seen: string[] = [];
    arrayForEach.call([10, 20], (v: number, i: number) => seen.push(i + ':' + v));
    expect(seen).toEqual(['0:10', '1:20']);
  });
  it('skips holes', () => {
    const idx: number[] = [];
    arrayForEach.call([1, , 3] as any, (_v: number, i: number) => idx.push(i));
    expect(idx).toEqual([0, 2]);
  });
});

describe('Array.prototype.join island', () => {
  it('defaults the separator to a comma', () => {
    expect(arrayJoin.call([1, 2, 3])).toBe('1,2,3');
  });
  it('uses an explicit separator', () => {
    expect(arrayJoin.call([1, 2, 3], '-')).toBe('1-2-3');
  });
  it('works on a primitive string this', () => {
    expect(arrayJoin.call('abc', '|')).toBe('a|b|c');
  });
  it('throws on a null this', () => {
    expect(() => arrayJoin.call(null as any, ',')).toThrow(TypeError);
  });
});
