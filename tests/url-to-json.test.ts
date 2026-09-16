import { urlToJSON } from '../src/modules/web.url.to-json.js';


/**
 * Conformance suite for the URL.prototype.toJSON patch island.
 *
 * WHATWG URL (https://url.spec.whatwg.org/#dom-url-tojson) — Chrome 51-70
 * ship a native URL that passes the behavioral probe but lacks toJSON (it
 * landed in 71), so the mount patches just the method there.
 *
 *   - returns the full href serialization
 *   - JSON.stringify(url) produces the URL string
 */
describe('URL.prototype.toJSON', () => {
  it('returns the href serialization', () => {
    const url = new URL('https://example.com/programs/1?autoplay=true#t=30');
    expect(urlToJSON.call(url)).toBe('https://example.com/programs/1?autoplay=true#t=30');
  });

  it('reflects the live href after mutation', () => {
    const url = new URL('https://example.com/a');
    url.pathname = '/b c';
    expect(urlToJSON.call(url)).toBe(url.href);
  });

  it('makes JSON.stringify produce the URL string when installed', () => {
    // a plain object stands in for URL.prototype here — the native href getter
    // rejects non-URL receivers, so we can't Object.create(url)
    const patched = { href: 'https://example.com/path', toJSON: urlToJSON };
    expect(JSON.stringify(patched)).toBe('"https://example.com/path"');
  });

  describe('parity vs native', () => {
    it('matches native toJSON', () => {
      const url = new URL('https://example.com/x?y=1#z');
      expect(urlToJSON.call(url)).toBe((url as any).toJSON());
    });
  });
});
