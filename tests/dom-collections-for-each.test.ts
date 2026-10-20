import { domCollectionForEach } from '../src/modules/web.dom-collections.for-each.js';

/**
 * Conformance suite for the NodeList/DOMTokenList forEach polyfill.
 *
 * WPT reference — dom/nodes/NodeList-static-length-getter-tampered.html and the
 * iterable NodeList tests. Mirrors Array.prototype.forEach semantics.
 *
 * The exported fn is tested via .call against a real NodeList so the global
 * prototype is left untouched.
 */
describe('NodeList.forEach — polyfill', () => {
  it('iterates a NodeList with (value, index, list)', () => {
    document.body.innerHTML = '<ul><li>a</li><li>b</li><li>c</li></ul>';
    const items = document.querySelectorAll('li');
    const seen: Array<[string, number]> = [];
    domCollectionForEach.call(items, (node: any, i: number) => {
      seen.push([node.textContent, i]);
    });
    expect(seen).toEqual([
      ['a', 0],
      ['b', 1],
      ['c', 2],
    ]);
  });

  it('passes the collection as the third argument', () => {
    document.body.innerHTML = '<span></span>';
    const list = document.querySelectorAll('span');
    let received: any = null;
    domCollectionForEach.call(list, (_n: any, _i: number, l: any) => {
      received = l;
    });
    expect(received).toBe(list);
  });

  it('honors thisArg', () => {
    document.body.innerHTML = '<b>x</b>';
    const list = document.querySelectorAll('b');
    const ctx = { hits: 0 };
    domCollectionForEach.call(
      list,
      function (this: typeof ctx) {
        this.hits++;
      },
      ctx,
    );
    expect(ctx.hits).toBe(1);
  });

  it('does nothing for an empty collection', () => {
    const list = document.querySelectorAll('.none-such');
    let calls = 0;
    domCollectionForEach.call(list, () => {
      calls++;
    });
    expect(calls).toBe(0);
  });

  it('throws TypeError when the callback is not a function', () => {
    const list = document.querySelectorAll('body');
    expect(() => (domCollectionForEach as any).call(list, 42)).toThrow(TypeError);
  });
});
