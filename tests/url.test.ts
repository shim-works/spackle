import { applyURLPolyfill } from '../src/modules/web.url.js';

describe('URL — polyfill', () => {
  it('applyURLPolyfill is a function', () => {
    expect(typeof applyURLPolyfill).toBe('function');
  });

  // URL is available natively in Node, so test basic conformance
  it('URL parses absolute URLs correctly', () => {
    const u = new URL('https://example.com:8080/path?q=1#hash');
    expect(u.protocol).toBe('https:');
    expect(u.hostname).toBe('example.com');
    expect(u.port).toBe('8080');
    expect(u.pathname).toBe('/path');
    expect(u.search).toBe('?q=1');
    expect(u.hash).toBe('#hash');
    expect(u.origin).toBe('https://example.com:8080');
  });

  it('URL resolves relative URLs against base', () => {
    const u = new URL('/foo', 'https://example.com');
    expect(u.href).toBe('https://example.com/foo');
  });

  it('URL has searchParams', () => {
    const u = new URL('https://example.com?a=1&b=2');
    expect(u.searchParams.get('a')).toBe('1');
    expect(u.searchParams.get('b')).toBe('2');
  });

  it('URL.toString() returns href', () => {
    const u = new URL('https://example.com/path');
    expect(u.toString()).toBe('https://example.com/path');
  });

  it('URL throws on invalid input', () => {
    expect(() => new URL('not-a-url')).toThrow();
  });
});
