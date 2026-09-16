import { dateToPrimitive } from '../src/modules/es.date.to-primitive.js';


/**
 * test262-derived conformance suite for the Date.prototype[Symbol.toPrimitive]
 * polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/Date/prototype/Symbol.toPrimitive/
 *
 * ES2015 — only reachable through a polyfilled Symbol.toPrimitive lookup, so
 * it rides with the Symbol island in the mount.
 *
 *   - 'number' hint returns the timestamp (valueOf first)
 *   - 'string' and 'default' hints return the date string (toString first)
 *   - any other hint throws TypeError, as does a non-object this
 */
describe('Date.prototype[Symbol.toPrimitive] — test262 conformance', () => {
  const date = new Date(1234567890123);

  it('returns the timestamp for the number hint', () => {
    expect(dateToPrimitive.call(date, 'number')).toBe(1234567890123);
  });

  it('returns the date string for the string hint', () => {
    expect(dateToPrimitive.call(date, 'string')).toBe(date.toString());
  });

  it('treats default like string', () => {
    expect(dateToPrimitive.call(date, 'default')).toBe(date.toString());
  });

  it('throws on an invalid hint', () => {
    expect(() => dateToPrimitive.call(date, 'boolean')).toThrow(TypeError);
    expect(() => dateToPrimitive.call(date, undefined)).toThrow(TypeError);
  });

  it('throws on a non-object this', () => {
    expect(() => dateToPrimitive.call(1 as any, 'number')).toThrow(TypeError);
    expect(() => dateToPrimitive.call(null as any, 'number')).toThrow(TypeError);
  });

  it('is generic: works on any object with toString/valueOf', () => {
    const duck = {
      toString: () => 'quack',
      valueOf: () => 7,
    };
    expect(dateToPrimitive.call(duck, 'string')).toBe('quack');
    expect(dateToPrimitive.call(duck, 'number')).toBe(7);
  });

  it('matches native', () => {
    const native = (Date.prototype as any)[Symbol.toPrimitive];
    expect(dateToPrimitive.call(date, 'number')).toBe(native.call(date, 'number'));
    expect(dateToPrimitive.call(date, 'string')).toBe(native.call(date, 'string'));
    expect(dateToPrimitive.call(date, 'default')).toBe(native.call(date, 'default'));
  });
});
