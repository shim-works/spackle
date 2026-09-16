import { URLSearchParams as USPPolyfill } from '../src/modules/web.url-search-params.js';


describe('URLSearchParams — polyfill vs native', () => {
  it('parses query string', () => {
    const native = new URLSearchParams('?a=1&b=2&c=3');
    const polyfill = new USPPolyfill('?a=1&b=2&c=3');
    expect(polyfill.get('a')).toBe(native.get('a'));
    expect(polyfill.get('b')).toBe(native.get('b'));
    expect(polyfill.get('c')).toBe(native.get('c'));
  });

  it('parses without leading ?', () => {
    const native = new URLSearchParams('foo=bar&baz=qux');
    const polyfill = new USPPolyfill('foo=bar&baz=qux');
    expect(polyfill.get('foo')).toBe(native.get('foo'));
    expect(polyfill.get('baz')).toBe(native.get('baz'));
  });

  it('has() checks existence', () => {
    const polyfill = new USPPolyfill('a=1');
    const native = new URLSearchParams('a=1');
    expect(polyfill.has('a')).toBe(native.has('a'));
    expect(polyfill.has('z')).toBe(native.has('z'));
  });

  it('get() returns null for missing key', () => {
    const polyfill = new USPPolyfill('a=1');
    const native = new URLSearchParams('a=1');
    expect(polyfill.get('missing')).toBe(native.get('missing'));
  });

  it('set() overwrites value', () => {
    const polyfill = new USPPolyfill('a=1');
    const native = new URLSearchParams('a=1');
    polyfill.set('a', '99');
    native.set('a', '99');
    expect(polyfill.get('a')).toBe(native.get('a'));
  });

  it('append() adds value', () => {
    const polyfill = new USPPolyfill('a=1');
    const native = new URLSearchParams('a=1');
    polyfill.append('a', '2');
    native.append('a', '2');
    expect(polyfill.getAll('a')).toEqual(native.getAll('a'));
  });

  it('delete() removes key', () => {
    const polyfill = new USPPolyfill('a=1&b=2');
    const native = new URLSearchParams('a=1&b=2');
    polyfill.delete('a');
    native.delete('a');
    expect(polyfill.has('a')).toBe(native.has('a'));
    expect(polyfill.get('b')).toBe(native.get('b'));
  });

  it('toString() produces query string', () => {
    const polyfill = new USPPolyfill('a=1&b=hello world');
    const native = new URLSearchParams('a=1&b=hello world');
    expect(polyfill.toString()).toBe(native.toString());
  });

  it('handles encoded characters', () => {
    const polyfill = new USPPolyfill('q=hello+world&x=%26');
    const native = new URLSearchParams('q=hello+world&x=%26');
    expect(polyfill.get('q')).toBe(native.get('q'));
    expect(polyfill.get('x')).toBe(native.get('x'));
  });

  it('constructs from object', () => {
    const polyfill = new USPPolyfill({ a: '1', b: '2' });
    expect(polyfill.get('a')).toBe('1');
    expect(polyfill.get('b')).toBe('2');
  });

  it('forEach iterates all pairs', () => {
    const polyfill = new USPPolyfill('a=1&b=2');
    const native = new URLSearchParams('a=1&b=2');
    const pPairs: [string, string][] = [];
    const nPairs: [string, string][] = [];
    polyfill.forEach((val: string, key: string) => pPairs.push([key, val]));
    native.forEach((val, key) => nPairs.push([key, val]));
    expect(pPairs).toEqual(nPairs);
  });
});
