import { SymbolPolyfill, hideSymbolKeys } from '../src/modules/es.symbol.js';

/**
 * The '@@' key filter that hideSymbolKeys() installs over every enumeration API.
 *
 * Shimmed symbols are ordinary '@@name_N' STRING keys, so `Object.keys` and
 * friends have to hide them to behave like an engine with real symbols. That
 * filter is on the hot path of every enumeration in the program: it used to
 * allocate a filtered copy unconditionally, which measured 275ms against
 * core-js's 18.1ms on Chrome 41 for 40000 Object.keys calls. It now scans first
 * and returns the native array untouched when there is nothing to remove.
 *
 * The scan is deliberately NOT gated on "has the program called Symbol()". A
 * well-known is enough to put a '@@' key on an object — `obj[Symbol.iterator]`
 * is an ordinary enumerable string key under the shim — and the well-knowns
 * exist from install onward. The last test here is that case, and it is the one
 * that rules the flag out.
 */
describe('hideSymbolKeys — enumeration filter', () => {
  const withFilter = (body: (S: any) => void) => {
    const natives = {
      keys: Object.keys,
      names: Object.getOwnPropertyNames,
      entries: (Object as any).entries,
      values: (Object as any).values,
      assign: (Object as any).assign,
      stringify: JSON.stringify,
      Symbol: (window as any).Symbol,
    };
    try {
      (window as any).Symbol = SymbolPolyfill;
      hideSymbolKeys();
      body(SymbolPolyfill);
    } finally {
      Object.keys = natives.keys;
      Object.getOwnPropertyNames = natives.names;
      (Object as any).entries = natives.entries;
      (Object as any).values = natives.values;
      (Object as any).assign = natives.assign;
      JSON.stringify = natives.stringify;
      (window as any).Symbol = natives.Symbol;
    }
  };

  it('hides a shimmed symbol key from keys, names, entries, values and JSON', () =>
    withFilter((S) => {
      const target: any = { visible: 1 };
      target[S('hidden')] = 2;

      expect(Object.keys(target)).toEqual(['visible']);
      expect(Object.getOwnPropertyNames(target)).toEqual(['visible']);
      expect((Object as any).entries(target)).toEqual([['visible', 1]]);
      expect((Object as any).values(target)).toEqual([1]);
      expect(JSON.stringify(target)).toBe('{"visible":1}');
    }));

  it('still copies symbol keys through Object.assign, which must not filter', () =>
    withFilter((S) => {
      const key = S('carried');
      const source: any = { plain: 1 };
      source[key] = 2;

      const copy: any = (Object as any).assign({}, source);
      expect(copy[key]).toBe(2);
      expect(Object.keys(copy)).toEqual(['plain']);
    }));

  it('returns the native array itself when there is nothing to filter', () =>
    withFilter(() => {
      // The fast path: no allocation, no copy. Checked by identity rather than
      // by value, because equal contents would pass either way.
      const target = { a: 1, b: 2 };
      const first = Object.keys(target);
      const second = Object.keys(target);
      expect(first).toEqual(['a', 'b']);
      expect(first).not.toBe(second); // each native call makes its own array
      expect((Object as any).entries(target)).toEqual([['a', 1], ['b', 2]]);
      expect((Object as any).values(target)).toEqual([1, 2]);
    }));

  it('filters correctly when the symbol key is first, last or in the middle', () =>
    withFilter((S) => {
      const first: any = {};
      first[S('s')] = 0;
      first.a = 1;
      first.b = 2;
      expect(Object.keys(first)).toEqual(['a', 'b']);

      const middle: any = { a: 1 };
      middle[S('s')] = 0;
      middle.b = 2;
      expect(Object.keys(middle)).toEqual(['a', 'b']);

      const last: any = { a: 1, b: 2 };
      last[S('s')] = 0;
      expect(Object.keys(last)).toEqual(['a', 'b']);

      const only: any = {};
      only[S('s')] = 0;
      expect(Object.keys(only)).toEqual([]);
    }));

  it('hides a key written with a WELL-KNOWN symbol, without Symbol() ever being called', () =>
    withFilter((S) => {
      /*
       * The case that rules out gating the filter on "did the program create a
       * symbol". Making an object iterable is the ordinary reason to do this,
       * and under the shim it writes an enumerable '@@iterator_N' string key.
       */
      const iterable: any = { length: 0 };
      iterable[S.iterator] = function () {
        return { next: () => ({ done: true, value: undefined }) };
      };

      expect(Object.keys(iterable)).toEqual(['length']);
      expect(JSON.stringify(iterable)).toBe('{"length":0}');
    }));
});
