import { promiseAny } from '../src/modules/es.promise.any.js';

/**
 * test262-derived conformance suite for the Promise.any polyfill.
 * Cases from tc39/test262 — test/built-ins/Promise/any/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Promise/any
 */
describe('Promise.any — test262 conformance', () => {
  it('resolves with the first fulfilment', async () => {
    const out = await promiseAny([
      Promise.reject('nope'),
      Promise.resolve('win'),
      Promise.resolve('late'),
    ]);
    expect(out).toBe('win');
  });

  it('treats a non-promise value as an immediate fulfilment', async () => {
    const out = await promiseAny([Promise.reject('x'), 'plain']);
    expect(out).toBe('plain');
  });

  it('rejects with an AggregateError when all inputs reject', async () => {
    let caught: any;
    try {
      await promiseAny([Promise.reject('a'), Promise.reject('b')]);
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(Error);
    expect(caught.name).toBe('AggregateError');
    expect(caught.errors).toEqual(['a', 'b']);
  });

  it('rejects with an AggregateError (no errors) for empty input', async () => {
    let caught: any;
    try {
      await promiseAny([]);
    } catch (e) {
      caught = e;
    }
    expect(caught.name).toBe('AggregateError');
    expect(caught.errors).toEqual([]);
  });

  it('preserves rejection-reason order in AggregateError.errors', async () => {
    let caught: any;
    try {
      await promiseAny([
        Promise.reject('first'),
        Promise.reject('second'),
        Promise.reject('third'),
      ]);
    } catch (e) {
      caught = e;
    }
    expect(caught.errors).toEqual(['first', 'second', 'third']);
  });

  it('matches native Promise.any for a fulfilling input', async () => {
    const input = () => [Promise.reject(0), Promise.resolve('ok')];
    const nativeOut = await Promise.any(input());
    const polyOut = await promiseAny(input());
    expect(polyOut).toBe(nativeOut);
  });
});
