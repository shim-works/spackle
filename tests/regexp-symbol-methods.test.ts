import { describe, expect, it } from 'vitest';
import { regExpSearch } from '../src/modules/es.string.search';
import { regExpMatch } from '../src/modules/es.string.match';
import { regExpReplace } from '../src/modules/es.string.replace';
import { regExpSplit } from '../src/modules/es.string.split';

// An exec that defers to the real one and counts calls: forces the spec path.
const spied = (source: string, flags?: string): any => {
  const re: any = new RegExp(source, flags);
  const real = RegExp.prototype.exec;
  re.calls = 0;
  re.exec = function (this: any, s: string) {
    re.calls++;
    return real.call(this, s);
  };
  return re;
};

describe('RegExp.prototype[@@search/@@match/@@replace/@@split], spec path', () => {
  it('goes through an overridden exec', () => {
    const s = spied('b');
    expect(regExpSearch.call(s, 'abc')).toBe(1);
    expect(s.calls).toBe(1);
    const m = spied('b', 'g');
    expect(regExpMatch.call(m, 'abab')).toEqual(['b', 'b']);
    expect(m.calls).toBe(3);
    const r = spied('b', 'g');
    expect(regExpReplace.call(r, 'abab', 'X')).toBe('aXaX');
    expect(r.calls).toBeGreaterThan(0);
  });

  it('search restores lastIndex', () => {
    const s = spied('a', 'g');
    s.lastIndex = 3;
    regExpSearch.call(s, 'aaa');
    expect(s.lastIndex).toBe(3);
  });

  it('replace expands templates and passes groups to a function', () => {
    const re: any = /a/;
    re.exec = function () {
      const r: any = ['a', 'a'];
      r.index = 0;
      r.groups = { g: 'G' };
      return r;
    };
    expect(regExpReplace.call(re, 'abc', "<$1|$<g>|$0|$&|$`|$'|$$>")).toBe('<a|G|$0|a||bc|$>bc');
    let args: any[] = [];
    regExpReplace.call(re, 'abc', function () { args = [].slice.call(arguments); return ''; });
    expect(args).toEqual(['a', 'a', 0, 'abc', { g: 'G' }]);
  });

  it('match: an empty match advances, global returns null when nothing matches', () => {
    expect(regExpMatch.call(spied('x?', 'g'), 'ab')).toEqual(['', '', '']);
    expect(regExpMatch.call(spied('z', 'g'), 'ab')).toBe(null);
  });

  it('split builds its splitter through @@species and honours the limit', () => {
    const re: any = /,/;
    let built = 0;
    const ctor: any = {};
    ctor[Symbol.species] = function (src: any, flags: string) {
      built++;
      return new RegExp(src, flags);
    };
    re.constructor = ctor;
    re.exec = RegExp.prototype.exec.bind(re); // overridden: spec path
    expect(regExpSplit.call(re, 'a,b,c', 2)).toEqual(['a', 'b']);
    expect(built).toBe(1);
    expect(regExpSplit.call(spied('(-)'), 'a-b')).toEqual(['a', '-', 'b']);
    expect(regExpSplit.call(spied('x'), '')).toEqual(['']);
  });

  it('a non-object receiver is a TypeError', () => {
    expect(() => regExpReplace.call(1 as any, 'a', 'b')).toThrow(TypeError);
  });
});
