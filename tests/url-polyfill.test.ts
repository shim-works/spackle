import { vi } from 'vitest';
import { applyURLPolyfill } from '../src/modules/web.url.js';

/**
 * jsdom's native URL passes the probe, so the module no-ops on import. Call the
 * installer explicitly to exercise the polyfill itself. This file's copy of
 * window.URL is replaced as a result — vitest isolates per file, so that stays
 * contained here.
 */
const createDocSpy = vi.spyOn(document.implementation, 'createHTMLDocument');
applyURLPolyfill();
const PolyfilledURL: any = (window as any).URL;

describe('URL polyfill — searchParams binding', () => {
  it('is installed and tagged', () => {
    expect(PolyfilledURL.__polyfilled).toBe(true);
  });

  it('returns the same searchParams object on every access', () => {
    const url = new PolyfilledURL('http://a/?x=1');
    expect(url.searchParams).toBe(url.searchParams);
  });

  it('writes param mutations through to .search and .href', () => {
    const url = new PolyfilledURL('http://a/?x=1');
    url.searchParams.set('x', '2');
    expect(url.search).toBe('?x=2');
    expect(url.href).toBe('http://a/?x=2');

    url.searchParams.append('y', '3');
    expect(url.search).toBe('?x=2&y=3');
  });

  it('drops the query entirely when the last param goes', () => {
    const url = new PolyfilledURL('http://a/?x=1');
    url.searchParams.delete('x');
    expect(url.search).toBe('');
    expect(url.href).toBe('http://a/');
  });

  it('keeps the same searchParams object when .search is reassigned', () => {
    const url = new PolyfilledURL('http://a/?x=1');
    const params = url.searchParams;
    url.search = '?y=2';
    expect(url.searchParams).toBe(params);
    expect(params.get('y')).toBe('2');
    expect(params.get('x')).toBe(null);
  });

  it('accepts a search assignment without a leading ?', () => {
    const url = new PolyfilledURL('http://a/');
    url.search = 'y=2';
    expect(url.search).toBe('?y=2');
  });
});

describe('URL polyfill — retention shape', () => {
  it('does not put wrapper methods on the params instance (the old cycle)', () => {
    const url = new PolyfilledURL('http://a/?x=1');
    const params = url.searchParams;
    // The previous implementation assigned own append/delete/set wrappers that
    // closed over the URL, making url → params → closure → url a cycle. These
    // must resolve on the prototype instead.
    expect(Object.prototype.hasOwnProperty.call(params, 'append')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(params, 'delete')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(params, 'set')).toBe(false);
  });

  it('does not allocate params until they are asked for', () => {
    const url = new PolyfilledURL('http://a/?x=1');
    expect(url._params).toBe(null);
    void url.searchParams;
    expect(url._params).not.toBe(null);
  });

  it('reuses one resolver document across constructions', () => {
    const before = createDocSpy.mock.calls.length;
    new PolyfilledURL('/one', 'http://a');
    new PolyfilledURL('/two', 'http://a');
    new PolyfilledURL('/three', 'http://a');
    // one document total, however many URLs get built
    expect(createDocSpy.mock.calls.length - before).toBeLessThanOrEqual(1);
  });
});

describe('URL polyfill — parsing', () => {
  it('parses the parts of an absolute URL', () => {
    const url = new PolyfilledURL('https://example.com:8080/path?q=1#hash');
    expect(url.protocol).toBe('https:');
    expect(url.hostname).toBe('example.com');
    expect(url.port).toBe('8080');
    expect(url.pathname).toBe('/path');
    expect(url.search).toBe('?q=1');
    expect(url.hash).toBe('#hash');
    expect(url.origin).toBe('https://example.com:8080');
  });

  it('resolves a relative URL against a base', () => {
    expect(new PolyfilledURL('/foo', 'https://example.com').href).toBe(
      'https://example.com/foo'
    );
  });

  it('toString and toJSON both return href, from the prototype', () => {
    const url = new PolyfilledURL('http://a/p');
    expect(url.toString()).toBe(url.href);
    expect(url.toJSON()).toBe(url.href);
    expect(Object.prototype.hasOwnProperty.call(url, 'toString')).toBe(false);
  });

  it('throws on input with no protocol', () => {
    expect(() => new PolyfilledURL('not-a-url')).toThrow();
  });
});
