import { numberIsSafeInteger } from '../src/modules/es.number.is-safe-integer.js';


/**
 * test262-derived conformance suite for the Number.isSafeInteger polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Number/isSafeInteger/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Number/isSafeInteger
 */
describe('Number.isSafeInteger — test262 conformance', () => {
  it('is true for safe integers', () => {
    expect(numberIsSafeInteger(0)).toBe(true);
    expect(numberIsSafeInteger(-0)).toBe(true);
    expect(numberIsSafeInteger(1)).toBe(true);
    expect(numberIsSafeInteger(9007199254740991)).toBe(true); // 2^53 - 1
    expect(numberIsSafeInteger(-9007199254740991)).toBe(true);
  });

  it('is false at and beyond the safe boundary', () => {
    expect(numberIsSafeInteger(9007199254740992)).toBe(false); // 2^53
    expect(numberIsSafeInteger(-9007199254740992)).toBe(false);
  });

  it('is false for non-integers', () => {
    expect(numberIsSafeInteger(1.5)).toBe(false);
    expect(numberIsSafeInteger(0.1)).toBe(false);
  });

  it('is false for NaN and Infinity', () => {
    expect(numberIsSafeInteger(NaN)).toBe(false);
    expect(numberIsSafeInteger(Infinity)).toBe(false);
    expect(numberIsSafeInteger(-Infinity)).toBe(false);
  });

  it('does not coerce non-number arguments', () => {
    expect(numberIsSafeInteger('3' as any)).toBe(false);
    expect(numberIsSafeInteger(true as any)).toBe(false);
    expect(numberIsSafeInteger(null as any)).toBe(false);
    expect(numberIsSafeInteger([] as any)).toBe(false);
  });

  it('matches native across a sample + timing', () => {
    const samples = [0, 1.5, 9007199254740991, 9007199254740992, NaN, Infinity];
    const native = Number.isSafeInteger;
    for (let i = 0; i < samples.length; i++) {
      expect(numberIsSafeInteger(samples[i])).toBe(native(samples[i]));
    }
  });
});
