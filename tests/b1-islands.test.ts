import { objectIsSealed } from '../src/modules/es.object.is-sealed.js';
import { objectDefineGetter } from '../src/modules/es.object.define-getter.js';
import { objectDefineSetter } from '../src/modules/es.object.define-setter.js';
import { objectLookupGetter } from '../src/modules/es.object.lookup-getter.js';
import { objectLookupSetter } from '../src/modules/es.object.lookup-setter.js';
import { regexpTest } from '../src/modules/es.regexp.test.js';
import { regexpDotAllGetter } from '../src/modules/es.regexp.dot-all.js';
import { functionHasInstance } from '../src/modules/es.function.has-instance.js';
import { errorToString } from '../src/modules/es.error.to-string.js';
import { errorIsError } from '../src/modules/es.error.is-error.js';
import { atobPolyfill } from '../src/modules/web.atob.js';

/**
 * The B1 batch of hand-authored islands.
 *
 * jsdom's environment already satisfies most of these probes, so the modules
 * mostly no-op on import. These exercise the exported implementations directly
 * — the same approach the ported conformance suites use — so the logic is
 * covered regardless of whether the install gate fired here.
 */
describe('Object.isSealed', () => {
  it('treats primitives as sealed rather than throwing (the ES5 → ES2015 change)', () => {
    expect(objectIsSealed(1)).toBe(true);
    expect(objectIsSealed('x')).toBe(true);
    expect(objectIsSealed(null)).toBe(true);
    expect(objectIsSealed(undefined)).toBe(true);
  });

  it('still answers correctly for real objects', () => {
    expect(objectIsSealed({})).toBe(false);
    expect(objectIsSealed(Object.seal({}))).toBe(true);
  });
});

describe('Object.prototype.__defineGetter__ / __defineSetter__', () => {
  it('defines an enumerable, configurable accessor', () => {
    const target: any = {};
    objectDefineGetter.call(target, 'x', () => 42);
    expect(target.x).toBe(42);

    const descriptor = Object.getOwnPropertyDescriptor(target, 'x')!;
    expect(descriptor.enumerable).toBe(true);
    expect(descriptor.configurable).toBe(true);
  });

  it('routes writes through the setter', () => {
    const target: any = {};
    let received: any;
    objectDefineSetter.call(target, 'x', (value: any) => {
      received = value;
    });
    target.x = 7;
    expect(received).toBe(7);
  });

  it('rejects a non-callable accessor', () => {
    expect(() => objectDefineGetter.call({}, 'x', 1)).toThrow(TypeError);
    expect(() => objectDefineSetter.call({}, 'x', 1)).toThrow(TypeError);
  });
});

describe('Object.prototype.__lookupGetter__ / __lookupSetter__', () => {
  it('finds an own accessor', () => {
    const getter = () => 1;
    const target = Object.defineProperty({}, 'x', { get: getter, configurable: true });
    expect(objectLookupGetter.call(target, 'x')).toBe(getter);
  });

  it('walks the prototype chain', () => {
    const getter = () => 1;
    const base = Object.defineProperty({}, 'x', { get: getter, configurable: true });
    const derived = Object.create(base);
    expect(objectLookupGetter.call(derived, 'x')).toBe(getter);
  });

  it('returns undefined for a data property, not the value', () => {
    expect(objectLookupGetter.call({ x: 1 }, 'x')).toBe(undefined);
  });

  it('returns undefined for a missing key', () => {
    expect(objectLookupGetter.call({}, 'nope')).toBe(undefined);
    expect(objectLookupSetter.call({}, 'nope')).toBe(undefined);
  });

  it('finds a setter without confusing it for the getter', () => {
    const setter = () => {};
    const target = Object.defineProperty({}, 'x', { set: setter, configurable: true });
    expect(objectLookupSetter.call(target, 'x')).toBe(setter);
    expect(objectLookupGetter.call(target, 'x')).toBe(undefined);
  });
});

describe('RegExp.prototype.test', () => {
  it('delegates to a user-supplied exec', () => {
    const regexp: any = /a/;
    let calls = 0;
    regexp.exec = function () {
      calls++;
      return null;
    };
    expect(regexpTest.call(regexp, 'a')).toBe(false);
    expect(calls).toBe(1);
  });

  it('reports true when exec returns a match object', () => {
    const regexp: any = /a/;
    regexp.exec = () => ({ 0: 'a' });
    expect(regexpTest.call(regexp, 'a')).toBe(true);
  });

  it('throws when exec returns a non-object, non-null', () => {
    const regexp: any = /a/;
    regexp.exec = () => 'nope';
    expect(() => regexpTest.call(regexp, 'a')).toThrow(TypeError);
  });
});

describe('RegExp.prototype.dotAll', () => {
  it('reads the s flag off .flags', () => {
    expect(regexpDotAllGetter.call({ flags: 'gs' })).toBe(true);
    expect(regexpDotAllGetter.call({ flags: 'gi' })).toBe(false);
  });

  it('throws on a non-object receiver', () => {
    expect(() => regexpDotAllGetter.call(null)).toThrow(TypeError);
  });
});

describe('Function.prototype[Symbol.hasInstance]', () => {
  function Base(this: any) {}
  function Other(this: any) {}

  it('matches an instance through the prototype chain', () => {
    const instance = new (Base as any)();
    expect(functionHasInstance.call(Base, instance)).toBe(true);
    expect(functionHasInstance.call(Other, instance)).toBe(false);
  });

  it('is false for primitives and null', () => {
    expect(functionHasInstance.call(Base, 1)).toBe(false);
    expect(functionHasInstance.call(Base, null)).toBe(false);
  });

  it('is false when the receiver is not callable', () => {
    expect(functionHasInstance.call({} as any, {})).toBe(false);
  });

  it('throws when the function has a non-object prototype', () => {
    const bad: any = function () {};
    bad.prototype = 1;
    expect(() => functionHasInstance.call(bad, {})).toThrow(TypeError);
  });
});

describe('Error.prototype.toString', () => {
  it('covers all four name/message combinations', () => {
    expect(errorToString.call({ name: 'x', message: 'y' })).toBe('x: y');
    expect(errorToString.call({})).toBe('Error');
    expect(errorToString.call({ name: 'x' })).toBe('x');
    expect(errorToString.call({ message: 'y' })).toBe('Error: y');
  });

  it('returns just the message when name is the empty string', () => {
    expect(errorToString.call({ name: '', message: 'y' })).toBe('y');
  });

  it('throws on a non-object receiver', () => {
    expect(() => errorToString.call(null)).toThrow(TypeError);
  });
});

describe('Error.isError', () => {
  it('recognises real errors, including subclasses', () => {
    expect(errorIsError(new Error('x'))).toBe(true);
    expect(errorIsError(new TypeError('x'))).toBe(true);
  });

  it('rejects non-errors, including error-shaped plain objects', () => {
    expect(errorIsError({ name: 'Error', message: 'x' })).toBe(false);
    expect(errorIsError(null)).toBe(false);
    expect(errorIsError('Error')).toBe(false);
  });
});

describe('atob', () => {
  it('decodes, with and without padding', () => {
    expect(atobPolyfill('aGk=')).toBe('hi');
    expect(atobPolyfill('aGk')).toBe('hi');
    expect(atobPolyfill('YQ==')).toBe('a');
    expect(atobPolyfill('')).toBe('');
  });

  it('strips ASCII whitespace before decoding', () => {
    expect(atobPolyfill(' a G\tk\n= ')).toBe('hi');
  });

  it('rejects a dangling character that cannot form a byte', () => {
    expect(() => atobPolyfill('a')).toThrow();
  });

  it('rejects characters outside the base64 alphabet', () => {
    expect(() => atobPolyfill('a*k=')).toThrow();
  });

  it('round-trips against btoa', () => {
    expect(atobPolyfill(btoa('hello world'))).toBe('hello world');
  });
});
