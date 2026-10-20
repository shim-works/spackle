import { WeakSet as WeakSetPolyfill } from '../src/modules/es.weak-set.js';

/**
 * Parity suite for the WeakSet island (delegates to live-global WeakMap).
 *
 * test262: https://github.com/tc39/test262/tree/main/test/built-ins/WeakSet
 */


describe('WeakSet — polyfill vs native', () => {
  it('add and has', () => {
    const obj = {};
    const native = new WeakSet();
    const polyfill = new WeakSetPolyfill();
    native.add(obj);
    polyfill.add(obj);
    expect(polyfill.has(obj)).toBe(native.has(obj));
  });

  it('has returns false for non-member', () => {
    const obj = {};
    const native = new WeakSet();
    const polyfill = new WeakSetPolyfill();
    expect(polyfill.has(obj)).toBe(native.has(obj));
  });

  it('delete removes entry', () => {
    const obj = {};
    const native = new WeakSet();
    const polyfill = new WeakSetPolyfill();
    native.add(obj);
    polyfill.add(obj);
    expect(polyfill.delete(obj)).toBe(native.delete(obj));
    expect(polyfill.has(obj)).toBe(native.has(obj));
  });

  it('delete returns false for non-member', () => {
    const obj = {};
    const native = new WeakSet();
    const polyfill = new WeakSetPolyfill();
    expect(polyfill.delete(obj)).toBe(native.delete(obj));
  });

  it('add returns this (chainable)', () => {
    const polyfill = new WeakSetPolyfill();
    const obj1 = {};
    const obj2 = {};
    const result = polyfill.add(obj1).add(obj2);
    expect(result).toBe(polyfill);
    expect(polyfill.has(obj1)).toBe(true);
    expect(polyfill.has(obj2)).toBe(true);
  });

  it('handles multiple objects independently', () => {
    const polyfill = new WeakSetPolyfill();
    const a = {};
    const b = {};
    const c = {};
    polyfill.add(a);
    polyfill.add(b);
    expect(polyfill.has(a)).toBe(true);
    expect(polyfill.has(b)).toBe(true);
    expect(polyfill.has(c)).toBe(false);
  });
});
