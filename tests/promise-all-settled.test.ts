import { promiseAllSettled } from '../src/modules/es.promise.all-settled.js';

/**
 * test262-derived conformance suite for the Promise.allSettled polyfill.
 * Cases from tc39/test262 — test/built-ins/Promise/allSettled/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Promise/allSettled
 */
describe('Promise.allSettled — test262 conformance', () => {
  it('resolves with all-fulfilled results in input order', async () => {
    const out = await promiseAllSettled([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ]);
    expect(out).toEqual([
      { status: 'fulfilled', value: 1 },
      { status: 'fulfilled', value: 2 },
      { status: 'fulfilled', value: 3 },
    ]);
  });

  it('preserves order and status for a mixed fulfil/reject input', async () => {
    const out = await promiseAllSettled([
      Promise.resolve('a'),
      Promise.reject('b'),
      Promise.resolve('c'),
    ]);
    expect(out).toEqual([
      { status: 'fulfilled', value: 'a' },
      { status: 'rejected', reason: 'b' },
      { status: 'fulfilled', value: 'c' },
    ]);
  });

  it('never rejects, even when every input rejects', async () => {
    const out = await promiseAllSettled([
      Promise.reject('x'),
      Promise.reject('y'),
    ]);
    expect(out).toEqual([
      { status: 'rejected', reason: 'x' },
      { status: 'rejected', reason: 'y' },
    ]);
  });

  it('wraps non-promise values as fulfilled', async () => {
    const out = await promiseAllSettled([1, 'two', true]);
    expect(out).toEqual([
      { status: 'fulfilled', value: 1 },
      { status: 'fulfilled', value: 'two' },
      { status: 'fulfilled', value: true },
    ]);
  });

  it('resolves with an empty array for empty input', async () => {
    const out = await promiseAllSettled([]);
    expect(out).toEqual([]);
  });

  it('matches native Promise.allSettled for a mixed input', async () => {
    const input = () => [Promise.resolve(1), Promise.reject(2)];
    const nativeOut = await Promise.allSettled(input());
    const polyOut = await promiseAllSettled(input());
    expect(polyOut).toEqual(nativeOut);
  });
});
