import { DOMExceptionPolyfill } from '../src/modules/_dom-exception-impl.js';


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
