import { isSupported as forEachSupported } from '../src/modules/es.array.for-each.js';
import { isSupported as someSupported } from '../src/modules/es.array.some.js';
import { isSupported as everySupported } from '../src/modules/es.array.every.js';
import { isSupported as reduceSupported } from '../src/modules/es.array.reduce.js';
import { isSupported as reduceRightSupported } from '../src/modules/es.array.reduce-right.js';
import { arrayReverse, isSupported as reverseSupported } from '../src/modules/es.array.reverse.js';
import { arrayJoin, isSupported as joinSupported } from '../src/modules/es.array.join.js';

/**
 * The ToLength probes: Chrome < 45 natives read length with ToUint32, so an
 * array-like with a negative or huge length walks ~2^32 indices (the Chrome 38
 * hang). Each probe has to end at once on a correct native too, which these
 * engines are: every gate must report supported without hanging.
 */
describe('ToLength probes on a correct native', () => {
  it('report supported, and return at once', () => {
    const gates = [forEachSupported, someSupported, everySupported, reduceSupported, reduceRightSupported, reverseSupported, joinSupported];
    for (const gate of gates) expect(gate()).toBe(true);
  });
});

describe('Array.prototype.reverse island on array-likes', () => {
  it('converts length with ToLength: a negative length is 0', () => {
    const o: any = { length: -4294967294, 0: 'x', 1: 'y' };
    expect(arrayReverse.call(o)).toBe(o);
    expect([o[0], o[1]]).toEqual(['x', 'y']);
  });

  it('keeps holes, moving them with the swap', () => {
    const o: any = { length: 3, 0: 'a', 2: undefined };
    delete o[2];
    arrayReverse.call(o);
    expect(0 in o).toBe(false);
    expect(o[2]).toBe('a');
  });

  it('still reverses a real array through the native', () => {
    expect(arrayReverse.call([1, 2, 3])).toEqual([3, 2, 1]);
  });
});

describe('Array.prototype.join island on array-likes', () => {
  it('converts length with ToLength', () => {
    expect(arrayJoin.call({ length: -1, 0: 'a' })).toBe('');
    expect(arrayJoin.call({ length: 2.9, 0: 'a', 1: 'b', 2: 'c' })).toBe('a,b');
    expect(arrayJoin.call({ length: 3, 0: null, 2: 'z' }, '-')).toBe('--z');
  });

  it('returns "" for an array-like that contains itself, like every engine', () => {
    const o: any = { length: 2, 0: 'a' };
    o[1] = { toString: () => arrayJoin.call(o) };
    expect(arrayJoin.call(o)).toBe('a,');
  });

  it('releases its cycle stack when an element throws', () => {
    const o: any = { length: 1, 0: { toString() { throw new Error('boom'); } } };
    expect(() => arrayJoin.call(o)).toThrow('boom');
    expect(arrayJoin.call({ length: 1, 0: 'ok' })).toBe('ok');
  });

  it('refuses a Symbol element', () => {
    expect(() => arrayJoin.call({ length: 1, 0: Symbol('s') })).toThrow(TypeError);
  });
});
