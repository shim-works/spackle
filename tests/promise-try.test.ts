import { promiseTry } from '../src/modules/es.promise.try.js';

/**
 * test262-derived conformance suite for the Promise.try polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Promise/try/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Promise/try
 *
 * ES2025 (Chrome 128 / Safari 18.2) — absent on the floor and on most browsers
 * until very recently, so the polyfill patches it onto the native Promise.
 *
 *   - runs the callback synchronously and wraps its return in a resolved promise
 *   - a synchronous throw becomes a rejected promise (not a thrown error)
 *   - a returned thenable is adopted
 *   - extra arguments are forwarded to the callback
 *
 * Called via .call(Promise, ...) exactly as load.ts patches it onto Promise.
 */
describe('Promise.try — test262 conformance', () => {
  const promiseTryCall = (callback: any, ...args: any[]) =>
    promiseTry.apply(Promise, [callback].concat(args) as any);

  it('returns a thenable', () => {
    const result = promiseTryCall(() => 1);
    expect(typeof result.then).toBe('function');
  });

  it('resolves with the callback return value', async () => {
    await expect(promiseTryCall(() => 42)).resolves.toBe(42);
  });

  it('rejects when the callback throws synchronously', async () => {
    await expect(
      promiseTryCall(() => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');
  });

  it('adopts a returned thenable', async () => {
    await expect(promiseTryCall(() => Promise.resolve('inner'))).resolves.toBe(
      'inner',
    );
  });

  it('forwards extra arguments to the callback', async () => {
    await expect(
      promiseTryCall((a: number, b: number) => a + b, 2, 3),
    ).resolves.toBe(5);
  });

  it('runs the callback synchronously (before the next microtask)', () => {
    let ran = false;
    promiseTryCall(() => {
      ran = true;
    });
    expect(ran).toBe(true);
  });
});
