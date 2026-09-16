import { urlCanParse } from '../src/modules/web.url.can-parse.js';
import { urlParse } from '../src/modules/web.url.parse.js';
import { urlSearchParamsSizeGetter } from '../src/modules/web.url-search-params.size.js';
import { urlSearchParamsHas } from '../src/modules/web.url-search-params.has.js';
import { urlSearchParamsDelete } from '../src/modules/web.url-search-params.delete.js';

/**
 * The B5 batch. Whether these install depends on how complete the host's
 * URL/URLSearchParams already are, so the implementations are exercised
 * directly — the same approach the other island suites use.
 */
describe('URL.canParse', () => {
  it('reports true for parseable input', () => {
    expect(urlCanParse('https://example.com/x')).toBe(true);
    expect(urlCanParse('/x', 'https://example.com')).toBe(true);
  });

  it('reports false instead of throwing', () => {
    expect(urlCanParse('not-a-url')).toBe(false);
    expect(urlCanParse('http://[')).toBe(false);
  });
});

describe('URL.parse', () => {
  it('returns a URL for parseable input', () => {
    const url = urlParse('https://example.com/x');
    expect(url).not.toBe(null);
    expect(url.pathname).toBe('/x');
  });

  it('resolves against a base', () => {
    expect(urlParse('/x', 'https://example.com').href).toBe('https://example.com/x');
  });

  it('returns null instead of throwing', () => {
    expect(urlParse('not-a-url')).toBe(null);
  });
});

describe('URLSearchParams size', () => {
  it('counts pairs, not distinct names', () => {
    expect(urlSearchParamsSizeGetter.call(new URLSearchParams('a=1&a=2&b=3'))).toBe(3);
  });

  it('is 0 for an empty set', () => {
    expect(urlSearchParamsSizeGetter.call(new URLSearchParams(''))).toBe(0);
  });
});

describe('URLSearchParams has(name, value)', () => {
  it('matches on name and value together', () => {
    const params = new URLSearchParams('a=1&a=2');
    expect(urlSearchParamsHas.call(params, 'a', '1')).toBe(true);
    expect(urlSearchParamsHas.call(params, 'a', '3')).toBe(false);
    expect(urlSearchParamsHas.call(params, 'b', '1')).toBe(false);
  });

  it('falls back to name-only when no value is given', () => {
    const params = new URLSearchParams('a=1');
    expect(urlSearchParamsHas.call(params, 'a')).toBe(true);
    expect(urlSearchParamsHas.call(params, 'z')).toBe(false);
  });

  it('coerces the value to a string, like the spec', () => {
    const params = new URLSearchParams('a=1');
    expect(urlSearchParamsHas.call(params, 'a', 1)).toBe(true);
  });
});

describe('URLSearchParams delete(name, value)', () => {
  it('removes only the pair matching both, keeping the rest in order', () => {
    const params = new URLSearchParams('a=1&b=2&a=3');
    urlSearchParamsDelete.call(params, 'a', '1');
    expect(params.toString()).toBe('b=2&a=3');
  });

  it('leaves everything alone when the value does not match', () => {
    const params = new URLSearchParams('a=1&b=2');
    urlSearchParamsDelete.call(params, 'a', 'nope');
    expect(params.toString()).toBe('a=1&b=2');
  });

  it('removes every matching pair when there are duplicates', () => {
    const params = new URLSearchParams('a=1&a=1&b=2');
    urlSearchParamsDelete.call(params, 'a', '1');
    expect(params.toString()).toBe('b=2');
  });

  it('falls back to removing all of a name when no value is given', () => {
    const params = new URLSearchParams('a=1&a=2&b=3');
    urlSearchParamsDelete.call(params, 'a');
    expect(params.toString()).toBe('b=3');
  });
});
