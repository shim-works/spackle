import { install as installPromise } from '../src/modules/es.promise.js';

/**
 * The scheduler behind the swapped-in Promise, rather than the Promise itself.
 *
 * es.promise hands promise-polyfill its own `_immediateFn`: a queue with one
 * wake-up per turn, drained to empty. That is not a detail — before it, every
 * `.then` was a separate `setTimeout`, and because a chain schedules each timer
 * from inside the previous timer's callback, the HTML nested-timer clamp made
 * every link past depth 5 cost 4ms. A 500-link chain took 2263ms against
 * core-js's 1ms, and 200 sequential 3-link chains took 4018ms.
 *
 * These cover the three things that fix can break: batching (does a chain
 * really finish in one turn), order (FIFO across the drain), and isolation (one
 * throwing callback must not take the queue down with it).
 */
describe('Promise scheduler — batching, order, isolation', () => {
  const withPolyfill = (body: (P: any) => Promise<void>) => {
    const native = (window as any).Promise;
    const restore = () => {
      (window as any).Promise = native;
    };
    installPromise();
    const P: any = (window as any).Promise;
    return body(P).then(restore, (error) => {
      restore();
      throw error;
    });
  };

  // A macrotask in terms of the NATIVE promise, so it is a real "next turn"
  // boundary regardless of what the polyfill is doing.
  const nextTurn = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));

  it('drains a 50-link chain inside a single turn', () =>
    withPolyfill(async (P) => {
      let settled = false;
      let chain = P.resolve(0);
      for (let i = 0; i < 50; i++) {
        chain = chain.then((v: number) => v + 1);
      }
      chain.then((v: number) => {
        settled = v === 50;
      });

      // One turn. Before batching this needed ~50 of them, each clamped to 4ms.
      await nextTurn();
      expect(settled).toBe(true);
    }));

  it('runs scheduled callbacks in FIFO order across the drain', () =>
    withPolyfill(async (P) => {
      const order: number[] = [];
      P.resolve().then(() => order.push(1));
      P.resolve().then(() => order.push(2));
      P.resolve().then(() => order.push(3));

      await nextTurn();
      expect(order).toEqual([1, 2, 3]);
    }));

  it('a throwing callback does not strand the callbacks queued behind it', () =>
    withPolyfill(async (P) => {
      /*
       * The rethrow is deliberate — it is how the failure reaches
       * window.onerror — so it has to be swallowed here or it fails the file.
       * Where it surfaces depends on the host: a real browser fires an `error`
       * event on window, while under jsdom it arrives as a Node uncaught
       * exception. This suite runs in both, so both are covered.
       */
      const isBoom = (error: any) => error instanceof Error && error.message === 'boom';
      const undo: Array<() => void> = [];

      const onErrorEvent = (event: any) => {
        if (isBoom(event && event.error)) event.preventDefault();
      };
      window.addEventListener('error', onErrorEvent);
      undo.push(() => window.removeEventListener('error', onErrorEvent));

      const proc: any = (globalThis as any).process;
      if (proc && typeof proc.on === 'function') {
        const onUncaught = (error: any) => {
          if (!isBoom(error)) throw error;
        };
        proc.on('uncaughtException', onUncaught);
        undo.push(() => proc.off('uncaughtException', onUncaught));
      }
      const swallowDone = () => undo.forEach((fn) => fn());

      const ran: string[] = [];
      try {
        P._immediateFn(() => {
          ran.push('a');
          throw new Error('boom');
        });
        P._immediateFn(() => ran.push('b'));
        P._immediateFn(() => ran.push('c'));

        // One turn is enough: the throw goes out on a timer, so the drain
        // carries on to b and c without needing a second wake-up.
        await nextTurn();
      } finally {
        swallowDone();
      }

      // Before the fix the catch cleared the queue: ['a'].
      expect(ran).toEqual(['a', 'b', 'c']);
    }));
  it('keeps FIFO order across the 1024-slot compaction in one drain', () =>
    withPolyfill(async (P) => {
      const seen: number[] = [];
      for (let i = 0; i < 5000; i++) P.resolve(i).then((v: number) => { seen.push(v); });
      // A long chain on top keeps the same drain alive past several compactions.
      let end = -1;
      let chain = P.resolve(0);
      for (let i = 0; i < 3000; i++) chain = chain.then((v: number) => v + 1);
      chain.then((v: number) => { end = v; });
      await nextTurn();
      expect(end).toBe(3000);
      expect(seen.length).toBe(5000);
      for (let i = 0; i < 5000; i++) if (seen[i] !== i) throw new Error('out of order at ' + i);
    }));
});
