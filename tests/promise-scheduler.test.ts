import { install as installPromise } from '../src/modules/es.promise.js';

/**
 * The scheduler behind the swapped-in Promise, rather than the Promise itself.
 *
 * es.promise runs its jobs through window.queueMicrotask: one queue, one
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

  it('a throwing handler rejects its own child and strands nothing queued behind it', () =>
    withPolyfill(async (P) => {
      const ran: string[] = [];
      let caught: any = null;
      P.resolve().then(() => {
        ran.push('a');
        throw new Error('boom');
      }).then(null, (error: any) => { caught = error; });
      P.resolve().then(() => ran.push('b'));
      P.resolve().then(() => ran.push('c'));
      await nextTurn();
      expect(ran).toEqual(['a', 'b', 'c']);
      expect(caught && caught.message).toBe('boom');
    }));

  it('interleaves its jobs with queueMicrotask callbacks in one FIFO queue', () =>
    withPolyfill(async (P) => {
      const order: string[] = [];
      P.resolve().then(() => order.push('p1'));
      (window as any).queueMicrotask(() => order.push('m'));
      P.resolve().then(() => order.push('p2'));
      await nextTurn();
      expect(order).toEqual(['p1', 'm', 'p2']);
    }));

  it('adopts a thenable one job later, never synchronously', () =>
    withPolyfill(async (P) => {
      let called = 0;
      const thenable = { then: (resolve: any) => { called++; resolve(7); } };
      const p = new P((resolve: any) => resolve(thenable));
      expect(called).toBe(0);
      let value: any;
      p.then((v: any) => { value = v; });
      await nextTurn();
      expect(called).toBe(1);
      expect(value).toBe(7);
    }));

  it('all and race over its own promises (the no-child fast path) settle as the spec path does', () =>
    withPolyfill(async (P) => {
      let all: any, race: any, rejected: any, mixed: any;
      P.all([P.resolve(1), 2, new P((r: any) => setTimeout(() => r(3), 5))]).then((v: any) => { all = v; });
      P.race([new P(() => {}), P.resolve('r')]).then((v: any) => { race = v; });
      P.all([P.resolve(1), P.reject('x')]).then(null, (e: any) => { rejected = e; });
      // a patched then on one element takes the spec path for that element only
      const odd = P.resolve('o');
      odd.then = function (this: any, f: any, r: any) { return P.prototype.then.call(this, f, r); };
      P.all([odd, P.resolve('p')]).then((v: any) => { mixed = v; });
      await nextTurn();
      expect(all).toEqual([1, 2, 3]);
      expect(race).toBe('r');
      expect(rejected).toBe('x');
      expect(mixed).toEqual(['o', 'p']);
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
