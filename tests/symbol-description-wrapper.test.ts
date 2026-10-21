import { describe, expect, it, vi } from 'vitest';

/**
 * Chrome 38-69 / Safari 9.1-11.1 ship a native Symbol without `description`, so
 * es.symbol wraps the constructor (core-js's es.symbol.description) and adds the
 * prototype halves of @@toPrimitive / @@toStringTag. A modern engine never takes
 * that path, so hide `description` and re-run the island's self-install.
 * Own file: the browser bundle skips vi.resetModules() suites.
 */
describe('es.symbol on a native Symbol without description', () => {
  it('wraps the constructor and keeps real symbols', async () => {
    const NativeSymbol: any = window.Symbol;
    const proto: any = NativeSymbol.prototype;
    const savedDescription = Object.getOwnPropertyDescriptor(proto, 'description')!;
    const savedConstructor = Object.getOwnPropertyDescriptor(proto, 'constructor')!;
    delete proto.description;
    try {
      vi.resetModules();
      await import('../src/modules/es.symbol.js');
      const S: any = window.Symbol;

      expect(S).not.toBe(NativeSymbol);
      expect(S.length).toBe(0);
      expect(typeof S('a')).toBe('symbol');
      expect(S('a').description).toBe('a');
      expect(S('').description).toBe('');
      expect(S().description).toBe(undefined);
      expect(S['for']('').description).toBe('');
      expect(S.iterator).toBe(NativeSymbol.iterator);
      expect(Object(S('x')).constructor).toBe(S);
      expect(() => new S()).toThrow(TypeError);
      let calls = '';
      S({ toString() { calls += 'toString'; return {}; }, valueOf() { calls += 'valueOf'; } });
      expect(calls).toBe('toStringvalueOf');
    } finally {
      Object.defineProperty(window, 'Symbol', { value: NativeSymbol, writable: true, enumerable: false, configurable: true });
      Object.defineProperty(proto, 'description', savedDescription);
      Object.defineProperty(proto, 'constructor', savedConstructor);
    }
  });
});
