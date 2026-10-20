import '../src/modules/es.symbol.js';
import { symbolIsShimmed } from './engine-capabilities.js';

/**
 * The late-arriving well-knowns.
 *
 * es.symbol's probe is all-or-nothing: a browser with a genuine native Symbol
 * that merely predates one of these passes it. Chrome 41 is exactly that --
 * real symbols, but no @@dispose, @@asyncDispose, @@asyncIterator or
 * @@matchAll. installSymbolExtensionsOnNative() backfills whatever is missing onto
 * whichever Symbol is live, which is why these four were folded in from their
 * own islands rather than left to install alphabetically, after their readers.
 *
 * Importing the module is what installs it, so these assertions are the check
 * that the backfill actually fires. A silently-not-installing feature is
 * indistinguishable from one that was never needed -- which is how the
 * es.symbol gap survived as long as it did.
 */
describe('well-known symbol islands', () => {
  const cases: [string, string][] = [
    ['dispose', 'dispose'],
    ['asyncDispose', 'asyncDispose'],
    ['asyncIterator', 'asyncIterator'],
    ['matchAll', 'matchAll'],
  ];

  for (let i = 0; i < cases.length; i++) {
    const label = cases[i][0];
    const key = cases[i][1];

    describe('Symbol.' + label, () => {
      it('exists once the island has been imported', () => {
        expect((Symbol as any)[key] == null).toBe(false);
      });

      // Only a genuine native Symbol reports typeof 'symbol'. The shim hands
      // back an object with a '@@name' toString -- es.symbol.ts documents that
      // as unfixable: ES5 cannot add a primitive type. Asserting 'symbol'
      // unconditionally would fail the Safari 7.1 floor for a non-defect.
      it.skipIf(symbolIsShimmed())('is a real symbol on a native engine', () => {
        expect(typeof (Symbol as any)[key]).toBe('symbol');
      });

      // Holds on both engines: shimmed or native, it must work as a key.
      it('works as a property key', () => {
        const carrier: any = {};
        carrier[(Symbol as any)[key]] = 'value';
        expect(carrier[(Symbol as any)[key]]).toBe('value');
      });

      // The point of the backfill: after import the well-known is there,
      // whether the engine brought it or installSymbolExtensionsOnNative did.
      it('is present after install', () => {
        expect((Symbol as any)[key]).toBeDefined();
      });

      it('is a distinct symbol, not shared with another well-known', () => {
        for (let j = 0; j < cases.length; j++) {
          if (j === i) continue;
          expect((Symbol as any)[key]).not.toBe((Symbol as any)[cases[j][1]]);
        }
      });

      // Native well-knowns are non-writable and non-configurable; an attached
      // one must match or code can clobber the protocol key mid-flight.
      it('matches native well-known property shape', () => {
        const descriptor = Object.getOwnPropertyDescriptor(Symbol, key)!;
        expect(descriptor.writable).toBe(false);
        expect(descriptor.enumerable).toBe(false);
        expect(descriptor.configurable).toBe(false);
      });
    });
  }
});
