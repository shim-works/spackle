import { promiseWithResolvers } from '../src/modules/es.promise.with-resolvers.js';

/**
 * test262-derived conformance suite for the Promise.withResolvers polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Promise/withResolvers/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Promise/withResolvers
 *
 * ES2024 (Chrome 119 / Safari 17.4) — absent on the floor and on most browsers
 * until recently, so the polyfill patches it onto the native Promise.
 *
 *   - returns { promise, resolve, reject }
 *   - the promise is a real Promise built from `this` constructor
 *   - calling resolve settles the promise; calling reject rejects it
 *
 * Called via .call(Promise, ...) exactly as load.ts patches it onto Promise.
 */
describe('Promise.withResolvers — test262 conformance', () => {
  const withResolvers = () => promiseWithResolvers.call(Promise);

  it('returns an object with promise, resolve and reject', () => {
    const { promise, resolve, reject } = withResolvers();
    expect(promise).toBeInstanceOf(Promise);
    expect(typeof resolve).toBe('function');
    expect(typeof reject).toBe('function');
  });

  it('resolve settles the promise', async () => {
    const { promise, resolve } = withResolvers();
    resolve(42);
    await expect(promise).resolves.toBe(42);
  });

  it('reject rejects the promise', async () => {
    const { promise, reject } = withResolvers();
    reject(new Error('nope'));
    await expect(promise).rejects.toThrow('nope');
  });

  it('builds the promise from the receiver constructor', () => {
    const { promise } = withResolvers();
    expect(promise.constructor).toBe(Promise);
  });
});
