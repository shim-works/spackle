import { DOMExceptionPolyfill } from '../src/modules/install-dom-exception.js';


describe('DOMException — polyfill vs native', () => {
  it('constructs with message and name', () => {
    const polyfill = new DOMExceptionPolyfill('test message', 'AbortError');
    const native = new DOMException('test message', 'AbortError');
    expect(polyfill.message).toBe(native.message);
    expect(polyfill.name).toBe(native.name);
  });

  it('has correct error codes', () => {
    const cases: [string, number][] = [
      ['AbortError', 20],
      ['NotFoundError', 8],
      ['NetworkError', 19],
      ['TimeoutError', 23],
      ['SyntaxError', 12],
      ['InvalidStateError', 11],
      ['SecurityError', 18],
      ['QuotaExceededError', 22],
    ];

    for (const [name, code] of cases) {
      const polyfill = new DOMExceptionPolyfill('msg', name);
      const native = new DOMException('msg', name);
      expect(polyfill.code).toBe(code);
      expect(polyfill.code).toBe(native.code);
    }
  });

  it('defaults name to "Error"', () => {
    const polyfill = new DOMExceptionPolyfill('oops');
    expect(polyfill.name).toBe('Error');
  });

  it('defaults message to empty string', () => {
    const polyfill = new DOMExceptionPolyfill();
    expect(polyfill.message).toBe('');
  });

  it('code is 0 for unknown names', () => {
    const polyfill = new DOMExceptionPolyfill('msg', 'CustomError');
    expect(polyfill.code).toBe(0);
  });
});

// webidl/ecmascript-binding/es-exceptions, as spackle-verify ports them
describe('DOMException polyfill — WebIDL shape', () => {
  const D: any = DOMExceptionPolyfill;

  it('keeps name, message and code in slots behind prototype getters', () => {
    const e = new D();
    expect([e.name, e.message, e.hasOwnProperty('name'), e.hasOwnProperty('message'), e.hasOwnProperty('code')]).toEqual(['Error', '', false, false, false]);
    for (const key of ['name', 'message', 'code']) {
      const d = Object.getOwnPropertyDescriptor(D.prototype, key)!;
      expect([typeof d.get, d.set, d.enumerable, d.configurable]).toEqual(['function', undefined, true, true]);
      expect(() => d.get!.call({})).toThrow(TypeError);
    }
  });

  it('converts arguments with ToString, defaulting only undefined', () => {
    expect([new D(null).message, new D(undefined).message, new D('foo').name, new D('bar', undefined).name, new D('m', '').name]).toEqual(['null', '', 'Error', 'Error', '']);
  });

  it('maps every legacy code, InUseAttributeError included, and nothing inherited', () => {
    expect(new D('m', 'InUseAttributeError').code).toBe(10);
    expect(new D('m', 'toString').code).toBe(0);
  });

  it('reads code from its slot, not from a shadowed name', () => {
    const e = new D('message', 'InvalidCharacterError');
    Object.defineProperty(e, 'name', { value: 'WrongDocumentError' });
    expect(e.code).toBe(5);
  });

  it('formats through Error.prototype.toString and refuses a call without new', () => {
    expect(new D('message', 'name').toString()).toBe('name: message');
    expect(() => D()).toThrow(TypeError);
  });
});
