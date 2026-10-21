import { stringMatch, isSupported as matchSupported } from '../src/modules/es.string.match.js';
import { stringSearch, isSupported as searchSupported } from '../src/modules/es.string.search.js';
import { stringReplace, isSupported as replaceSupported } from '../src/modules/es.string.replace.js';
import { stringSplit, isSupported as splitSupported } from '../src/modules/es.string.split.js';

// core-js's fix-regexp-well-known-symbol-logic, String side
describe('match / search / replace / split: @@-method delegation', () => {
  const cases: Array<[string, any, () => boolean, any[]]> = [
    ['match', stringMatch, matchSupported, []],
    ['search', stringSearch, searchSupported, []],
    ['replace', stringReplace, replaceSupported, ['rv']],
    ['split', stringSplit, splitSupported, ['lim']],
  ];

  for (const [key, f, gate, rest] of cases) {
    const symbol = (Symbol as any)[key];

    it(`${key}: the gate keeps a native that delegates`, () => {
      expect(gate()).toBe(true);
    });

    it(`${key}: calls the argument's handler with the receiver as is`, () => {
      const ret = {};
      let got: any;
      const obj: any = { [symbol](this: any) { got = [this, ...arguments]; return ret; } };
      expect(f.call('O', obj, ...rest)).toBe(ret);
      expect(got).toEqual([obj, 'O', ...rest]);
    });

    it(`${key}: refuses a non-callable handler, ignores primitives`, () => {
      expect(() => f.call('x', { [symbol]: 1 })).toThrow(TypeError);
      const saved = Object.getOwnPropertyDescriptor(String.prototype, symbol);
      Object.defineProperty(String.prototype, symbol, { get() { throw new Error('read on a primitive'); }, configurable: true });
      try {
        expect(() => f.call('a,b', ',', ...rest)).not.toThrow();
      } finally {
        if (saved) Object.defineProperty(String.prototype, symbol, saved);
        else delete (String.prototype as any)[symbol];
      }
    });
  }

  it('replace converts replaceValue even when nothing matches', () => {
    let calls = 0;
    expect(stringReplace.call('', 'a', { toString() { calls++; return 'b'; } })).toBe('');
    expect(calls).toBe(1);
  });

  it('replace still treats a real RegExp as one', () => {
    expect(stringReplace.call('a1b1', /\d/g, 'X')).toBe('aXbX');
    expect(stringReplace.call('a.b', '.', '$&$&')).toBe('a..b');
  });
});
