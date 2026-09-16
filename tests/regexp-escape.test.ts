import { regExpEscape } from '../src/modules/es.regexp.escape.js';

/**
 * test262-derived conformance suite for the RegExp.escape polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/RegExp/escape/
 * https://github.com/tc39/test262/tree/main/test/built-ins/RegExp/escape
 */
describe('RegExp.escape (ES2025) — test262 conformance', () => {
  it('backslash-escapes every regex syntax character and the slash', () => {
    expect(regExpEscape('.*+?^${}()|[]\\/')).toBe(
      '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\\\/',
    );
  });

  it('hex-escapes a leading ASCII letter or digit (avoids \\1 backrefs etc.)', () => {
    expect(regExpEscape('a1')).toBe('\\x61' + '1');
    expect(regExpEscape('1a')).toBe('\\x31' + 'a');
    expect(regExpEscape('Zz')).toBe('\\x5a' + 'z');
  });

  it('escapes punctuators and whitespace that could splice into patterns', () => {
    expect(regExpEscape('-')).toBe('\\x2d');
    expect(regExpEscape(' ')).toBe('\\x20');
    expect(regExpEscape('\t')).toBe('\\x09');
    expect(regExpEscape('\n')).toBe('\\x0a');
    expect(regExpEscape('!')).toBe('\\x21');
    expect(regExpEscape(',')).toBe('\\x2c');
  });

  it('escapes lone surrogates as \\uNNNN but passes intact pairs verbatim', () => {
    expect(regExpEscape('\uD800')).toBe('\\ud800');
    expect(regExpEscape('\uDC00')).toBe('\\udc00');
    expect(regExpEscape('😀')).toBe('😀'); // full code point, not a lone half
  });

  it('leaves ordinary characters alone (non-leading)', () => {
    expect(regExpEscape('abc')).toBe('\\x61bc');
    expect(regExpEscape('_foo')).toBe('_foo');
  });

  it('throws TypeError on non-string input (no coercion, per spec)', () => {
    expect(() => regExpEscape(42 as any)).toThrow(TypeError);
    expect(() => regExpEscape(null as any)).toThrow(TypeError);
  });

  it('escaped output round-trips as a literal match', () => {
    const raw = 'price: $5.00 (50% off?) [limited]';
    const re = new RegExp('^' + regExpEscape(raw) + '$');
    expect(re.test(raw)).toBe(true);
  });

  it('matches native', () => {
    const native = (RegExp as any).escape;
    if (typeof native !== 'function') return;
    const cases = ['abc', '1a', '.*+?', 'a-b c', '\uD800', '_foo', '$5.00', '😀'];
    for (let i = 0; i < cases.length; i++) {
      expect(regExpEscape(cases[i])).toBe(native(cases[i]));
    }
  });
});
