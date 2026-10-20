import { arrayPush } from '../src/modules/es.array.push.js';
import { arrayUnshift } from '../src/modules/es.array.unshift.js';
import { arrayReverse } from '../src/modules/es.array.reverse.js';

/**
 * Conformance for the push/unshift/reverse islands. These fix real in-range
 * bugs (Safari <= 15.4 non-writable length, Safari 12 reverse); we exercise the
 * hand-rolled impls directly.
 */
describe('Array.prototype.push island', () => {
  it('appends and returns the new length', () => {
    const a = [1, 2];
    expect(arrayPush.call(a, 3, 4)).toBe(4);
    expect(a).toEqual([1, 2, 3, 4]);
  });
  it('throws TypeError on a non-writable length', () => {
    const frozen = Object.defineProperty([], 'length', { writable: false });
    expect(() => arrayPush.call(frozen, 1)).toThrow(TypeError);
  });
  it('rejects growth past the safe-integer ceiling', () => {
    expect(() => arrayPush.call({ length: 9007199254740991 }, 1)).toThrow(TypeError);
  });
});

describe('Array.prototype.unshift island', () => {
  it('prepends and returns the new length', () => {
    const a = [3, 4];
    expect(arrayUnshift.call(a, 1, 2)).toBe(4);
    expect(a).toEqual([1, 2, 3, 4]);
  });
  it('returns the length unchanged with no arguments', () => {
    const a = [1, 2];
    expect(arrayUnshift.call(a)).toBe(2);
    expect(a).toEqual([1, 2]);
  });
  it('throws TypeError on a non-writable length', () => {
    const frozen = Object.defineProperty([], 'length', { writable: false });
    expect(() => arrayUnshift.call(frozen, 1)).toThrow(TypeError);
  });
});

describe('Array.prototype.reverse island', () => {
  it('reverses in place and returns the same array', () => {
    const a = [1, 2, 3];
    expect(arrayReverse.call(a)).toBe(a);
    expect(a).toEqual([3, 2, 1]);
  });
});
