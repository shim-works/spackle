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

  it('parses without building documents', () => {
    const before = createDocSpy.mock.calls.length;
    new PolyfilledURL('/one', 'http://a');
    new PolyfilledURL('/two', 'http://a');
    new PolyfilledURL('/three', 'http://a');
    // the parser is a state machine now: no resolver document at all
    expect(createDocSpy.mock.calls.length - before).toBe(0);
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

describe('URL polyfill — file: and hash routing', () => {
  it('parses file: URLs, drive letters and dot segments', () => {
    const u = new PolyfilledURL('file:///android_asset/www/index.html?x=1#/home');
    expect([u.protocol, u.host, u.pathname, u.search, u.hash, u.origin]).toEqual(
      ['file:', '', '/android_asset/www/index.html', '?x=1', '#/home', 'null']);
    expect(new PolyfilledURL('file:///C:/a/../../b').href).toBe('file:///C:/b');
    expect(new PolyfilledURL('file://localhost/etc/hosts').href).toBe('file:///etc/hosts');
    expect(new PolyfilledURL('img/a.png', 'file:///android_asset/www/index.html').href)
      .toBe('file:///android_asset/www/img/a.png');
  });

  it('keeps a hash route, query and all, and resolves against it', () => {
    const u = new PolyfilledURL('https://app.example/#/users/7?tab=posts');
    expect(u.hash).toBe('#/users/7?tab=posts');
    expect(u.search).toBe('');
    expect(new PolyfilledURL('#/settings', u.href).href).toBe('https://app.example/#/settings');
    u.hash = '/about';
    expect(u.href).toBe('https://app.example/#/about');
    u.hash = '';
    expect(u.href).toBe('https://app.example/');
  });

  it('handles ws:, wss:, credentials and empty ? / #', () => {
    expect(new PolyfilledURL('wss://u:p@sock.example:443/live?#').href).toBe('wss://u:p@sock.example/live?#');
    expect(new PolyfilledURL('ws://sock.example:8080').port).toBe('8080');
  });
});
