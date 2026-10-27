import { URLSearchParams as USPPolyfill, install as installUSP } from '../src/modules/web.url-search-params.js';


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

describe('URLSearchParams — decoding, matches native', () => {
  const same = (query: string) => {
    const mine = new USPPolyfill(query);
    const theirs = new (window as any).URLSearchParams(query);
    expect(mine.toString()).toBe(theirs.toString());
    const a: string[] = [];
    const b: string[] = [];
    mine.forEach((v: string, k: string) => a.push(k + '=' + v));
    theirs.forEach((v: string, k: string) => b.push(k + '=' + v));
    expect(a).toEqual(b);
  };

  it('plain text, + as space, and %-escapes', () => {
    same('a=1&b=two');
    same('q=hello+world&x=a+b+c');
    same('name=%20space%20&emoji=%F0%9F%98%80');
    same('mix=a+%2B+b');
  });

  it('bare keys, empty values and a malformed escape', () => {
    same('flag&empty=&=novalue');
    same('bad=%E0%A4%A&ok=1');
    same('pct=%&pct2=%zz');
  });
});

describe('URLSearchParams polyfill — iteration', () => {
  const P: any = USPPolyfill;

  it('spreads the params and every iterator kind', () => {
    expect([...new P('a=1&b=2')]).toEqual([['a', '1'], ['b', '2']]);
    expect([...new P('a=1&b=2').entries()]).toEqual([['a', '1'], ['b', '2']]);
    expect(Array.from(new P('a=1&b=2').keys())).toEqual(['a', 'b']);
    expect(Array.from(new P('a=1&b=2').values())).toEqual(['1', '2']);
  });

  it('makes @@iterator the entries function, and tags its iterators', () => {
    expect(P.prototype[Symbol.iterator]).toBe(P.prototype.entries);
    expect(Object.prototype.toString.call(new P('').entries())).toBe('[object URLSearchParams Iterator]');
  });

  it('walks the live list: a delete during the loop shifts the index, as native does', () => {
    const p = new P('param0=0&param1=1&param2=2');
    const seen: string[] = [];
    for (const [key] of p) {
      seen.push(key);
      p.delete(key);
    }
    expect([seen, p.toString()]).toEqual([['param0', 'param2'], 'param1=1']);
  });

  it('refuses next on a foreign receiver', () => {
    const next = Object.getPrototypeOf(new P('').entries()).next;
    expect(() => next.call({})).toThrow(TypeError);
  });
});

// Native fetch / Request only know the engine's own URLSearchParams: a polyfilled
// body goes out as text/plain, and form endpoints answer with an empty body.
describe('URLSearchParams — polyfilled body through native fetch / Request', () => {
  const w: any = window;
  const FORM = 'application/x-www-form-urlencoded;charset=UTF-8';
  const keys = ['URLSearchParams', 'fetch', 'Request'];
  let saved: any[] = [];
  let savedCtor: any;
  let calls: any[][] = [];

  beforeEach(() => {
    saved = keys.map((k) => Object.getOwnPropertyDescriptor(w, k));
    savedCtor = Object.getOwnPropertyDescriptor(w.Request.prototype, 'constructor');
    calls = [];
    w.fetch = function (_input: any, _init?: any) {
      calls.push(Array.prototype.slice.call(arguments));
      return Promise.resolve(new Response('{}'));
    };
    installUSP();
  });

  afterEach(() => {
    keys.forEach((k, i) => Object.defineProperty(w, k, saved[i]));
    Object.defineProperty(w.Request.prototype, 'constructor', savedCtor);
  });

  it('native Request alone labels a polyfilled body text/plain (the bug)', () => {
    const req = new (saved[2].value)('https://x/', { method: 'POST', body: new USPPolyfill('a=1') });
    expect(req.headers.get('content-type')).toBe('text/plain;charset=UTF-8');
  });

  it('fetch sends a polyfilled body as a form string', () => {
    w.fetch('https://x/', { method: 'POST', body: new USPPolyfill('a=1&b=2') });
    const init = calls[0][1];
    expect([calls[0][0], init.method, init.body, new Headers(init.headers).get('content-type')])
      .toEqual(['https://x/', 'POST', 'a=1&b=2', FORM]);
  });

  it('Request labels a polyfilled body as a form', async () => {
    const req = new w.Request('https://x/', { method: 'POST', body: new USPPolyfill('a=1') });
    expect([req.headers.get('content-type'), await req.text(), req instanceof w.Request])
      .toEqual([FORM, 'a=1', true]);
  });

  it("keeps the app's own content-type", () => {
    const headers = { 'content-type': 'application/json' };
    w.fetch('https://x/', { method: 'POST', body: new USPPolyfill('a=1'), headers: headers });
    expect(new Headers(calls[0][1].headers).get('content-type')).toBe('application/json');
    const req = new w.Request('https://x/', { method: 'POST', body: new USPPolyfill('a=1'), headers: headers });
    expect(req.headers.get('content-type')).toBe('application/json');
  });

  it('leaves other bodies and calls alone', () => {
    const init = { method: 'POST', body: 'a=1' };
    w.fetch('https://x/', init);
    w.fetch('https://x/');
    expect([calls[0][1], calls[1].length]).toEqual([init, 1]);
    expect(new w.Request('https://x/', init).headers.get('content-type')).toBe('text/plain;charset=UTF-8');
  });

  it('Request still needs new', () => {
    expect(() => w.Request('https://x/')).toThrow(TypeError);
  });
});
