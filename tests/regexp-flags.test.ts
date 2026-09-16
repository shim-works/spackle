import { regExpFlags } from '../src/modules/es.regexp.flags.js';


/**
 * test262-derived conformance suite for the RegExp.prototype.flags polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/RegExp/prototype/flags/
 * https://github.com/tc39/test262/tree/main/test/built-ins/RegExp/prototype/flags
 *
 * ES2015 (Chrome 49 / Safari 9) — absent on the floor (Chrome 38 / Safari 7), so
 * the getter installs.
 *
 *   - concatenates set flags in the fixed spec order d g i m s u v y
 *   - reads each flag as a boolean own/inherited property, not from `source`
 *   - throws TypeError when called on a non-object receiver
 */
describe('RegExp.prototype.flags — test262 conformance', () => {
  const flags = (re: any) => regExpFlags.call(re);

  describe('basic', () => {
    it('empty string when no flags set', () => {
      expect(flags(/x/)).toBe('');
    });

    it('single flag', () => {
      expect(flags(/x/g)).toBe('g');
    });

    it('combines flags in spec order regardless of source order', () => {
      // written as i, m, g — must come back g, i, m
      expect(flags(/x/img)).toBe('gim');
    });

    it('sticky sorts last of the classic set', () => {
      expect(flags(/x/gy)).toBe('gy');
    });
  });

  describe('spec order from a synthetic receiver', () => {
    it('emits d g i m s u v y in order when all are set', () => {
      const all = {
        hasIndices: true,
        global: true,
        ignoreCase: true,
        multiline: true,
        dotAll: true,
        unicode: true,
        unicodeSets: true,
        sticky: true,
      };
      expect(flags(all)).toBe('dgimsuvy');
    });

    it('only appends letters for truthy flags', () => {
      expect(flags({ global: true, sticky: true })).toBe('gy');
    });
  });

  describe('receiver validation', () => {
    it('throws TypeError on null / undefined', () => {
      expect(() => flags(null)).toThrow(TypeError);
      expect(() => flags(undefined)).toThrow(TypeError);
    });

    it('throws TypeError on a primitive receiver', () => {
      expect(() => flags('gi')).toThrow(TypeError);
    });
  });

  describe('parity vs native', () => {
    it('matches native across flag combos', () => {
      const nativeFlags = Object.getOwnPropertyDescriptor(
        RegExp.prototype,
        'flags',
      )!.get!;
      const re = /x/gimsuy;
      const nativeResult = nativeFlags.call(re);
      const specResult = regExpFlags.call(re);
      expect(specResult).toBe(nativeResult);
      expect(specResult).toBe(re.flags);
    });
  });
});
