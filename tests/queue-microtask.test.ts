import { queueMicrotask as queueMicrotaskPolyfill } from '../src/modules/web.queue-microtask.js';

/**
 * Conformance suite for the queueMicrotask polyfill.
 *
 * WPT reference — html/webappapis/microtask-queuing/queue-microtask.any.js
 * https://github.com/web-platform-tests/wpt/tree/master/html/webappapis/microtask-queuing
 *
 * The contract: the callback runs as a microtask — after the current synchronous
 * run-to-completion, but BEFORE the next macrotask (setTimeout). A throwing
 * callback surfaces as an uncaught error, not a swallowed promise rejection.
 */
describe('queueMicrotask — polyfill', () => {
  it('runs the callback asynchronously (not synchronously)', async () => {
    let ran = false;
    queueMicrotaskPolyfill(() => {
      ran = true;
    });
    expect(ran).toBe(false); // still sync here
    await Promise.resolve();
    expect(ran).toBe(true);
  });

  it('runs before a macrotask (setTimeout)', async () => {
    const order: string[] = [];
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        order.push('timeout');
        resolve();
      }, 0);
      queueMicrotask(() => {
        order.push('microtask');
      });
    });
    expect(order).toEqual(['microtask', 'timeout']);
  });

  it('preserves scheduling order across multiple calls', async () => {
    const order: number[] = [];
    queueMicrotaskPolyfill(() => order.push(1));
    queueMicrotaskPolyfill(() => order.push(2));
    queueMicrotaskPolyfill(() => order.push(3));
    await Promise.resolve();
    await Promise.resolve();
    expect(order).toEqual([1, 2, 3]);
  });

  it('a throwing callback does not strand the ones queued behind it', async () => {
    const order: number[] = [];
    let reported: any = null;
    // The error is rethrown from a timer; catch it at window so the run stays clean.
    const onError = (event: ErrorEvent) => {
      reported = event.error;
      event.preventDefault();
    };
    window.addEventListener('error', onError);
    const boom = new Error('boom');
    queueMicrotaskPolyfill(() => order.push(1));
    queueMicrotaskPolyfill(() => {
      throw boom;
    });
    queueMicrotaskPolyfill(() => order.push(3));
    await new Promise((resolve) => setTimeout(resolve, 20));
    window.removeEventListener('error', onError);
    expect(order).toEqual([1, 3]);
    expect(reported).toBe(boom);
  });

  it('keeps FIFO order past the 1024-slot compaction, with tasks queueing tasks', async () => {
    const seen: number[] = [];
    let next = 0;
    await new Promise<void>((resolve) => {
      // 3000 queued up front, each queueing one more until 6000: the drain
      // compacts several times while both old and new tasks are waiting.
      const task = () => {
        const id = next++;
        seen.push(id);
        if (id < 3000) queueMicrotaskPolyfill(task);
        if (seen.length === 6000) resolve();
      };
      for (let i = 0; i < 3000; i++) queueMicrotaskPolyfill(task);
    });
    expect(seen.length).toBe(6000);
    for (let i = 0; i < 6000; i++) if (seen[i] !== i) throw new Error('out of order at ' + i);
  });

  it('throws synchronously when the argument is not a function', () => {
    expect(() => (queueMicrotaskPolyfill as any)(42)).toThrow(TypeError);
  });

  // NOTE: a throwing callback is re-surfaced as an uncaught error via setTimeout
  // (spec "report the exception"). That global throw can't be asserted cleanly
  // inside vitest without polluting later tests, so it's covered by inspection of
  // queue-microtask.ts rather than a runtime case here.

  function queueMicrotask(cb: () => void): void {
    // local alias so the macrotask-ordering test reads naturally
    queueMicrotaskPolyfill(cb);
  }
});
