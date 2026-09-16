import { promiseFinally } from '../src/modules/es.promise.finally.js';

/**
 * test262-derived conformance suite for the Promise.prototype.finally polyfill.
 * Cases from tc39/test262 — test/built-ins/Promise/prototype/finally/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Promise/prototype/finally
 */
describe('Promise.prototype.finally — test262 conformance', () => {
  it('calls the callback on fulfilment and passes the value through', async () => {
    let called = false;
    const result = await promiseFinally.call(Promise.resolve(42), () => {
      called = true;
    });
    expect(called).toBe(true);
    expect(result).toBe(42);
  });

  it('calls the callback on rejection and re-throws the reason', async () => {
    let called = false;
    const err = new Error('fail');
    await expect(
      promiseFinally.call(Promise.reject(err), () => {
        called = true;
      })
    ).rejects.toBe(err);
    expect(called).toBe(true);
  });

  it('ignores the callback return value on fulfilment', async () => {
    const result = await promiseFinally.call(
      Promise.resolve('hello'),
      () => 'ignored'
    );
    expect(result).toBe('hello');
  });

  it('invokes the callback with no arguments', async () => {
    let args: any[] = [-1];
    await promiseFinally.call(Promise.resolve(1), (...a: any[]) => {
      args = a;
    });
    expect(args.length).toBe(0);
  });

  it('a throwing callback overrides a fulfilled value with the thrown error', async () => {
    const boom = new Error('boom');
    await expect(
      promiseFinally.call(Promise.resolve('val'), () => {
        throw boom;
      })
    ).rejects.toBe(boom);
  });

  it('a callback returning a rejected promise overrides the fulfilled value', async () => {
    await expect(
      promiseFinally.call(Promise.resolve('val'), () =>
        Promise.reject(new Error('late'))
      )
    ).rejects.toThrow('late');
  });

  it('awaits a thenable returned by the callback before settling', async () => {
    const order: string[] = [];
    const p = promiseFinally.call(Promise.resolve('v'), () => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          order.push('callback-settled');
          resolve();
        }, 10);
      });
    });
    await p.then(() => order.push('outer-settled'));
    expect(order).toEqual(['callback-settled', 'outer-settled']);
  });

  it('matches native finally for a resolved promise', async () => {
    const nativeResult = await Promise.resolve('val').finally(() => {});
    const polyfillResult = await promiseFinally.call(
      Promise.resolve('val'),
      () => {}
    );
    expect(polyfillResult).toBe(nativeResult);
  });
});
