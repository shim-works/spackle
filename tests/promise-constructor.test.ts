import { install as installPromise, isSupported as promiseSupported } from '../src/modules/es.promise.js';

/**
 * test262-derived conformance suite for the Promise CONSTRUCTOR island.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Promise/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Promise
 *
 * The extras (allSettled, any, finally, try, withResolvers) each have their
 * own suite. This covers the wholesale swap itself: es.promise replaces the
 * global outright on an engine with no usable Promise, which is the most
 * invasive thing spackle does to a built-in.
 *
 * The probe is deliberately broader than `typeof Promise === 'function'` —
 * some engines on the floor ship a Promise missing `catch` or the static
 * resolve/reject, and an existence check would accept it.
 *
 * Restores the native afterwards: leaving promise-polyfill installed would
 * change resolution timing for every test file that runs after this one.
 */
describe('Promise constructor — test262 conformance', () => {
  const withPolyfill = async (body: (P: PromiseConstructor) => Promise<void> | void) => {
    const native = (window as any).Promise;
    try {
      installPromise();
      const Polyfilled = (window as any).Promise as PromiseConstructor;
      expect((Polyfilled as any).__polyfilled).toBe(true);
      await body(Polyfilled);
    } finally {
      (window as any).Promise = native;
    }
  };

  it('detects a complete native Promise as supported', () => {
    expect(promiseSupported()).toBe(true);
  });

  it('rejects a Promise missing catch, which an existence check would accept', () => {
    const native = (window as any).Promise;
    try {
      const Partial: any = function () {};
      Partial.prototype = { then: function () {} }; // no catch
      Partial.resolve = function () {};
      Partial.reject = function () {};
      (window as any).Promise = Partial;
      expect(promiseSupported()).toBe(false);
    } finally {
      (window as any).Promise = native;
    }
  });

  it('installs a constructor that resolves', async () => {
    await withPolyfill(async (P) => {
      await new P<void>((resolve) => resolve()).then(() => {
        expect(true).toBe(true);
      });
    });
  });

  it('delivers the resolved value to then', async () => {
    await withPolyfill(async (P) => {
      const value = await new P((resolve) => resolve(42));
      expect(value).toBe(42);
    });
  });

  it('routes a rejection to catch', async () => {
    await withPolyfill(async (P) => {
      const reason = new Error('nope');
      const caught = await new P((_, reject) => reject(reason)).catch((e) => e);
      expect(caught).toBe(reason);
    });
  });

  it('routes a throw inside the executor to catch', async () => {
    await withPolyfill(async (P) => {
      const caught = await new P(() => {
        throw new Error('from executor');
      }).catch((e: Error) => e.message);
      expect(caught).toBe('from executor');
    });
  });

  it('settles once — later resolve/reject calls are ignored', async () => {
    await withPolyfill(async (P) => {
      const value = await new P((resolve, reject) => {
        resolve('first');
        resolve('second');
        reject(new Error('too late'));
      });
      expect(value).toBe('first');
    });
  });

  it('adopts a thenable passed to resolve', async () => {
    await withPolyfill(async (P) => {
      const value = await new P((resolve) => resolve({ then: (r: any) => r('unwrapped') } as any));
      expect(value).toBe('unwrapped');
    });
  });

  it('provides the statics the probe requires', async () => {
    await withPolyfill(async (P) => {
      expect(await P.resolve('r')).toBe('r');
      expect(await P.reject(new Error('j')).catch((e: Error) => e.message)).toBe('j');
      expect(await P.all([P.resolve(1), 2])).toEqual([1, 2]);
      expect(await P.race([P.resolve('fast')])).toBe('fast');
    });
  });

  it('runs then callbacks asynchronously, never inline', async () => {
    await withPolyfill(async (P) => {
      const order: string[] = [];
      const done = new P<void>((resolve) => {
        P.resolve().then(() => {
          order.push('then');
          resolve();
        });
        order.push('sync');
      });
      await done;
      expect(order).toEqual(['sync', 'then']);
    });
  });

  it('reports supported after installing', () => {
    const native = (window as any).Promise;
    try {
      installPromise();
      expect(promiseSupported()).toBe(true);
    } finally {
      (window as any).Promise = native;
    }
  });
});
