import { stringEndsWith } from '../src/modules/es.string.ends-with.js';
import { stringFromCodePoint } from '../src/modules/es.string.from-code-point.js';
import { stringIncludes } from '../src/modules/es.string.includes.js';
import { stringPadEnd } from '../src/modules/es.string.pad-end.js';
import { stringPadStart } from '../src/modules/es.string.pad-start.js';
import { stringReplaceAll } from '../src/modules/es.string.replace-all.js';
import { stringStartsWith } from '../src/modules/es.string.starts-with.js';
import { stringTrimStart } from '../src/modules/es.string.trim-start.js';

/**
 * Grouped parity suite for the String methods.
 *
 * test262: https://github.com/tc39/test262/tree/main/test/built-ins/String/prototype
 * (deep edge cases live in the per-method suites: string-includes / -starts-with /
 * -ends-with / -pad-start / -pad-end / -replace-all / -trim-start / -from-code-point)
 */


describe('String.prototype.includes — polyfill vs native', () => {
  it.each([
    ['hello world', 'world', undefined, true],
    ['hello world', 'xyz', undefined, false],
    ['hello world', 'hello', 5, false],
    ['hello world', '', undefined, true],
    ['', '', undefined, true],
    ['', 'a', undefined, false],
  ])('"%s".includes("%s", %p) === %p', (str, search, pos, expected) => {
    expect(stringIncludes.call(str, search, pos)).toBe(expected);
    expect(str.includes(search, pos)).toBe(expected);
  });
});

describe('String.prototype.startsWith — polyfill vs native', () => {
  it.each([
    ['hello world', 'hello', undefined, true],
    ['hello world', 'world', undefined, false],
    ['hello world', 'world', 6, true],
    ['hello', '', undefined, true],
  ])('"%s".startsWith("%s", %p) === %p', (str, search, pos, expected) => {
    expect(stringStartsWith.call(str, search, pos)).toBe(expected);
    expect(str.startsWith(search, pos)).toBe(expected);
  });
});

describe('String.prototype.endsWith — polyfill vs native', () => {
  it.each([
    ['hello world', 'world', undefined, true],
    ['hello world', 'hello', undefined, false],
    ['hello world', 'hello', 5, true],
    ['hello', '', undefined, true],
  ])('"%s".endsWith("%s", %p) === %p', (str, search, len, expected) => {
    expect(stringEndsWith.call(str, search, len)).toBe(expected);
    expect(str.endsWith(search, len)).toBe(expected);
  });
});

describe('String.prototype.padStart — polyfill vs native', () => {
  it.each([
    ['abc', 6, undefined, '   abc'],
    ['abc', 6, '0', '000abc'],
    ['abc', 2, '0', 'abc'],
    ['abc', 8, '12', '12121abc'],
  ])('"%s".padStart(%p, %p) === "%s"', (str, len, pad, expected) => {
    expect(stringPadStart.call(str, len, pad)).toBe(expected);
    expect(str.padStart(len, pad)).toBe(expected);
  });
});

describe('String.prototype.padEnd — polyfill vs native', () => {
  it.each([
    ['abc', 6, undefined, 'abc   '],
    ['abc', 6, '0', 'abc000'],
    ['abc', 2, '0', 'abc'],
    ['abc', 8, '12', 'abc12121'],
  ])('"%s".padEnd(%p, %p) === "%s"', (str, len, pad, expected) => {
    expect(stringPadEnd.call(str, len, pad)).toBe(expected);
    expect(str.padEnd(len, pad)).toBe(expected);
  });
});

describe('String.prototype.trimStart — polyfill vs native', () => {
  it.each([
    ['  hello  ', 'hello  '],
    ['\t\nhello', 'hello'],
    ['hello', 'hello'],
    ['', ''],
  ])('"%s".trimStart() === "%s"', (str, expected) => {
    expect(stringTrimStart.call(str)).toBe(expected);
    expect(str.trimStart()).toBe(expected);
  });
});

describe('String.prototype.replaceAll — polyfill vs native', () => {
  it('replaces all occurrences', () => {
    const str = 'aabbcc';
    expect(stringReplaceAll.call(str, 'b', 'X')).toBe(str.replaceAll('b', 'X'));
  });

  it('handles no matches', () => {
    const str = 'hello';
    expect(stringReplaceAll.call(str, 'z', 'X')).toBe(str.replaceAll('z', 'X'));
  });

  it('handles empty search string', () => {
    const str = 'abc';
    expect(stringReplaceAll.call(str, '', '-')).toBe(str.replaceAll('', '-'));
  });

  it('handles replacing with empty string', () => {
    const str = 'a.b.c';
    expect(stringReplaceAll.call(str, '.', '')).toBe(str.replaceAll('.', ''));
  });

  it('handles multi-char search', () => {
    const str = 'foobarfoobar';
    expect(stringReplaceAll.call(str, 'foo', 'baz')).toBe(str.replaceAll('foo', 'baz'));
  });
});

describe('String.fromCodePoint — polyfill vs native', () => {
  it('handles BMP code points', () => {
    expect(stringFromCodePoint.call(null, 65, 66, 67)).toBe(String.fromCodePoint(65, 66, 67));
  });

  it('handles supplementary code points (emoji)', () => {
    expect(stringFromCodePoint.call(null, 0x1F600)).toBe(String.fromCodePoint(0x1F600));
  });

  it('handles mixed BMP and supplementary', () => {
    expect(stringFromCodePoint.call(null, 72, 0x1F600, 33)).toBe(
      String.fromCodePoint(72, 0x1F600, 33)
    );
  });

  it('throws for invalid code point', () => {
    expect(() => stringFromCodePoint.call(null, -1)).toThrow(RangeError);
    expect(() => String.fromCodePoint(-1)).toThrow(RangeError);
  });
});
