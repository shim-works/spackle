import { SymbolPolyfill, hideSymbolKeys } from '../src/modules/es.symbol.js';

// jsdom has a native Symbol, so the island no-ops on import and never installs
// its enumeration filters. Install them explicitly, the same way
// tests/url-polyfill.test.ts calls applyURLPolyfill().
hideSymbolKeys();

const REPLACED: [any, string][] = [
  [Object, 'keys'],
  [Object, 'getOwnPropertyNames'],
  [Object, 'entries'],
  [Object, 'values'],
  [Object, 'assign'],
  [JSON, 'stringify'],
];

// Install the filters for the duration of one test and put back whatever was
// there. The module-scope call above is not enough on its own in the ES5
// browser bundle: every test file is evaluated before any test runs, so a
// later file that swaps and restores Object.keys undoes it before these run.
// (vi.resetModules() re-imports are no-ops there too, so this is the route.)
const withShim = (fn: () => void): void => {
  // Already filtered (vitest, where the call above still holds): wrapping again
  // would stack a filter on a filter and assign would stop carrying symbol keys.
  if ((Object.keys as any).__polyfilled === true) {
    fn();
    return;
  }
  const saved = REPLACED.map(([owner, key]) => owner[key]);
  hideSymbolKeys();
  try {
    fn();
  } finally {
    REPLACED.forEach(([owner, key], i) => {
      owner[key] = saved[i];
    });
  }
};

/**
 * Conformance suite for the hand-rolled Symbol island (replaces es6-symbol).
 *
 * Symbol can't be fully polyfilled in ES5 (it's a primitive type), so this tests
 * the *observable* surface the islands + apps rely on, against native Symbol
 * where they legitimately agree, and asserts the documented divergences
 * explicitly. Note: es6-symbol delegates to native Symbol in Node, so it's not a
 * usable oracle here — native Symbol is the effective reference.
 *
 * Spec: https://tc39.es/ecma262/#sec-symbol-objects
 * test262: https://github.com/tc39/test262/tree/main/test/built-ins/Symbol
 */
describe('Symbol polyfill (es6-symbol replacement)', () => {
  describe('construction + uniqueness', () => {
    it('each call produces a distinct symbol', () => {
      expect(SymbolPolyfill('x')).not.toBe(SymbolPolyfill('x'));
    });

    it('is not a constructor — `new Symbol()` throws (parity w/ native)', () => {
      expect(() => new (SymbolPolyfill as any)('x')).toThrow(TypeError);
      expect(() => new (Symbol as any)('x')).toThrow(TypeError);
    });

    it('a produced symbol is not an instance of the Symbol wrapper', () => {
      expect(SymbolPolyfill('x') instanceof (SymbolPolyfill as any)).toBe(false);
    });

    it('exposes description', () => {
      expect((SymbolPolyfill('hi') as any).description).toBe('hi');
      // test262 Symbol/prototype/description: undefined when none was given, '' for ''
      expect((SymbolPolyfill() as any).description).toBeUndefined();
      expect((SymbolPolyfill('') as any).description).toBe('');
    });
  });

  describe('registry — Symbol.for / Symbol.keyFor (parity w/ native)', () => {
    it('Symbol.for interns by key', () => {
      expect((SymbolPolyfill as any).for('k')).toBe((SymbolPolyfill as any).for('k'));
      expect(Symbol.for('k')).toBe(Symbol.for('k')); // native parity
    });

    it('distinct keys give distinct symbols', () => {
      expect((SymbolPolyfill as any).for('a')).not.toBe((SymbolPolyfill as any).for('b'));
    });

    it('Symbol.keyFor reverses a registered symbol, undefined otherwise', () => {
      const s = (SymbolPolyfill as any).for('roundtrip');
      expect((SymbolPolyfill as any).keyFor(s)).toBe('roundtrip');
      expect((SymbolPolyfill as any).keyFor(SymbolPolyfill('unregistered'))).toBeUndefined();
    });
  });

  describe('well-known symbols', () => {
    it('defines the standard set as unique values', () => {
      const names = ['iterator', 'asyncIterator', 'toStringTag', 'toPrimitive', 'hasInstance', 'species'];
      const seen: any[] = [];
      for (let i = 0; i < names.length; i++) {
        const sym = (SymbolPolyfill as any)[names[i]];
        expect(sym).toBeDefined();
        expect(seen.indexOf(sym)).toBe(-1); // unique
        seen.push(sym);
      }
    });

    it('the same well-known is stable across reads', () => {
      expect((SymbolPolyfill as any).iterator).toBe((SymbolPolyfill as any).iterator);
    });
  });

  describe('as object keys — readable but hidden (the fidelity that matters)', () => {
    it('round-trips a value through a symbol key', () => {
      const sym = SymbolPolyfill('key');
      const obj: any = {};
      obj[sym] = 42;
      expect(obj[sym]).toBe(42);
    });

    it('the key is hidden from every enumerating built-in, and still readable', () => {
      withShim(() => {
        const sym = SymbolPolyfill('hidden');
        const obj: any = { visible: 1 };
        obj[sym] = 'secret';

        expect(Object.keys(obj)).toEqual(['visible']);
        expect(JSON.stringify(obj)).toBe('{"visible":1}');
        expect((Object as any).entries(obj)).toEqual([['visible', 1]]);
        expect((Object as any).values(obj)).toEqual([1]);
        expect(Object.getOwnPropertyNames(obj)).toEqual(['visible']);
        // still readable through the symbol
        expect(obj[sym]).toBe('secret');
      });
    });

    /*
     * Object.assign is the exception to the hiding, and it used to be filtered
     * along with the rest — which quietly dropped every symbol-keyed value on
     * a shimmed engine. A native assign copies symbol keys, so a copy that
     * omits them is missing data, not hiding it.
     */
    it('Object.assign carries the symbol key across, unlike the other built-ins', () => {
      withShim(() => {
        const sym = SymbolPolyfill('carried');
        const source: any = { visible: 1 };
        source[sym] = 'secret';

        const copy: any = Object.assign({}, source);
        expect(copy[sym]).toBe('secret');
        expect(copy.visible).toBe(1);
        // hidden in the copy too — it is a symbol key there as well
        expect(Object.keys(copy)).toEqual(['visible']);
      });
    });

    it('a primitive source does not abort the sources after it', () => {
      const sym = SymbolPolyfill('k');
      const source: any = {};
      source[sym] = 1;

      // test262-shaped: the 5 and the 'x' must not stop `source` being copied
      const out: any = (Object.assign as any)({}, 5, source, 'x');
      expect(out[sym]).toBe(1);
      expect(out[0]).toBe('x');
    });

    it('[incomplete] for..in DOES surface the key — it is syntax and cannot be wrapped', () => {
      // Deliberate trade: intercepting `obj[sym] = v` requires a per-symbol
      // accessor on Object.prototype, which grew that object without bound and
      // slowed property lookup program-wide. The write is now plainly
      // enumerable and every *callable* enumeration API filters it instead.
      //
      // The blast radius is small: spackle's own symbol-keyed installs all go
      // through defineProperty with enumerable:false, so nothing enumerable
      // lands on a prototype. Only an object the caller symbol-keyed directly
      // can show a '@@' key, and only via for..in.
      const sym = SymbolPolyfill('hidden');
      const obj: any = { visible: 1 };
      obj[sym] = 'secret';

      const forInKeys: string[] = [];
      for (const k in obj) forInKeys.push(k);
      // the exact suffix depends on how many symbols share this description,
      // so assert the shape rather than the literal name
      expect(forInKeys).toContain('visible');
      expect(forInKeys.filter((k) => k.indexOf('@@') === 0)).toHaveLength(1);
    });

    it('the well-known iterator key round-trips (the island access pattern)', () => {
      const obj: any = {};
      const fn = function () {};
      obj[(SymbolPolyfill as any).iterator] = fn;
      expect(obj[(SymbolPolyfill as any).iterator]).toBe(fn);
    });
  });

  describe('documented gaps (parity with es6-symbol — unfixable in ES5)', () => {
    it('typeof a polyfilled symbol is "object", not "symbol"', () => {
      expect(typeof SymbolPolyfill('x')).toBe('object');
    });
  });
});

describe('Object.prototype does not grow (R1)', () => {
  it('creating many symbols adds nothing to Object.prototype', () => {
    // This was the whole bug: one accessor per Symbol() call, permanently, which
    // lengthens Object.prototype's property table and slows lookup for EVERY
    // object in the program — not just code that uses symbols.
    const before = Object.getOwnPropertyNames(Object.prototype).length;
    for (let i = 0; i < 2000; i++) SymbolPolyfill('growth-check-' + i);
    expect(Object.getOwnPropertyNames(Object.prototype).length).toBe(before);
  });

  it('symbols stay unique and readable without the accessor', () => {
    const a = SymbolPolyfill('same');
    const b = SymbolPolyfill('same');
    const obj: any = {};
    obj[a] = 1;
    obj[b] = 2;
    expect(obj[a]).toBe(1);
    expect(obj[b]).toBe(2);
    expect(String(a)).not.toBe(String(b));
  });
});

/**
 * Guard against the class of bug that hit Object.assign.
 *
 * When Symbol is polyfilled its keys are `@@`-prefixed strings, so
 * hideSymbolKeys() replaces every built-in that enumerates. Each replacement
 * takes over a member another island may already have installed correctly --
 * which is exactly what went wrong: the assign replacement dropped the ToObject
 * step es.object.assign had, and nothing noticed, because the two were never
 * compared.
 *
 * Two invariants, both cheap:
 *   1. every replacement is marked, so spackle-verify can see spackle owns it
 *      and a device report can't call it native
 *   2. a replacement still satisfies the spec basics the member it replaced did
 */
describe('hideSymbolKeys replacements', () => {
  it('marks every member it takes over', () => {
    withShim(() => {
      const unmarked = REPLACED.filter(([owner, key]) => owner[key].__polyfilled !== true).map(
        ([, key]) => key,
      );
      expect(unmarked).toEqual([]);
    });
  });

  it('keeps the spec basics of what it replaced', () => {
    withShim(() => {
      // ToObject first: nullish throws, primitives box. The assign regression.
      expect(() => (Object.assign as any)(null)).toThrow(TypeError);
      expect(typeof (Object.assign as any)('abc', {})).toBe('object');
      expect(() => Object.keys(null as any)).toThrow(TypeError);
      expect(Object.keys('ab' as any)).toEqual(['0', '1']);

      // and each still does its own job
      expect(Object.assign({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
      expect(Object.entries({ a: 1 })).toEqual([['a', 1]]);
      expect(Object.values({ a: 1 })).toEqual([1]);
      expect(Object.getOwnPropertyNames({ a: 1 })).toContain('a');
      expect(JSON.stringify({ a: 1 })).toBe('{"a":1}');
    });
  });
});
