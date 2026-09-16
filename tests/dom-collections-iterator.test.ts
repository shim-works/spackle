import { domCollectionEntries, domCollectionKeys, domCollectionValues } from '../src/modules/web.dom-collections.iterator.js';


const mkList = (): NodeListOf<HTMLSpanElement> => {
  const root = document.createElement('div');
  root.innerHTML = '<span>a</span><span>b</span><span>c</span>';
  return root.querySelectorAll('span');
};

const drain = (iter: { next: () => { value: any; done: boolean } }): any[] => {
  const out: any[] = [];
  let step = iter.next();
  while (!step.done) {
    out.push(step.value);
    step = iter.next();
  }
  return out;
};

describe('NodeList iterators — polyfill vs native', () => {
  it('values() yields the nodes in order', () => {
    const list = mkList();
    const nativeResult = drain(list.values());
    const specResult = drain(domCollectionValues.call(list));
    expect(specResult).toEqual(nativeResult);
    expect(specResult.length).toBe(3);
  });

  it('keys() yields indices, entries() yields [index, node] pairs', () => {
    const list = mkList();
    expect(drain(domCollectionKeys.call(list))).toEqual(drain(list.keys()));
    expect(drain(domCollectionEntries.call(list))).toEqual(drain(list.entries()));
  });

  it('done iterator keeps returning done with undefined value', () => {
    const empty = document.createElement('div').querySelectorAll('span');
    const spec = domCollectionValues.call(empty);
    const native = empty.values();
    expect(spec.next()).toEqual(native.next());
    expect(spec.next()).toEqual(native.next());
  });

  it('iterator is itself iterable (for...of protocol)', () => {
    const list = mkList();
    const iter = domCollectionValues.call(list);
    expect(typeof iter[Symbol.iterator]).toBe('function');
    expect(iter[Symbol.iterator]()).toBe(iter);
  });
});

describe('DOMTokenList iterators — polyfill vs native', () => {
  it('values() yields class names in order', () => {
    const el = document.createElement('div');
    el.className = 'one two three';
    const nativeResult = drain((el.classList as any).values());
    const specResult = drain(domCollectionValues.call(el.classList));
    expect(specResult).toEqual(nativeResult);
  });

  it('entries() matches native shape', () => {
    const el = document.createElement('div');
    el.className = 'x y';
    expect(drain(domCollectionEntries.call(el.classList)))
      .toEqual(drain((el.classList as any).entries()));
  });
});
