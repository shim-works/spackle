import { setImmediate as setImmediatePolyfill, clearImmediate as clearImmediatePolyfill } from '../src/modules/_set-immediate-impl.js';


/**
 * Conformance suite for the setImmediate/clearImmediate polyfill.
 *
 * W3C setImmediate draft (https://w3c.github.io/setImmediate/) — never shipped
 * in any browser, so the polyfill installs everywhere; core-js parity for
 * node-style deps that call it.
 *
 *   - runs the callback asynchronously (macrotask), passing extra args through
 *   - returns distinct numeric handles
 *   - clearImmediate cancels a pending callback
 *   - non-function callbacks warn and no-op (string eval form not implemented)
 */
// spackle-specific note (not present in the prior implementation's original file,
// which runs these in real Playwright browsers): the polyfill schedules via
// self-postMessage and gates delivery on `event.source === window`. In
// vitest's jsdom environment that guard never passes (event.source is not
// referentially === the test file's `window` -- a realm quirk), so these
// three used to be skipped as unobservable.
//
// They run now because setImmediate always schedules a setTimeout alongside
// the postMessage, so an undelivered task still fires. That fallback exists
// for retention, not for the tests: without it an undelivered task retains
// its callback and args in pendingTasks for the life of the page. The real
// `event.source === window` check is unchanged.
describe('setImmediate / clearImmediate', () => {
  const nextMacrotask = () => new Promise((resolve) => setTimeout(resolve, 20));

  it('runs the callback asynchronously', async () => {
    let ran = false;
    setImmediatePolyfill(() => {
      ran = true;
    });
    expect(ran).toBe(false);
    await nextMacrotask();
    expect(ran).toBe(true);
  });

  it('passes extra arguments through to the callback', async () => {
    let received: any[] = [];
    (setImmediatePolyfill as any)(
      function (this: any) {
        received = Array.prototype.slice.call(arguments);
      },
      'a',
      2,
      { three: 3 }
    );
    await nextMacrotask();
    expect(received).toEqual(['a', 2, { three: 3 }]);
  });

  it('returns distinct numeric handles', () => {
    const first = setImmediatePolyfill(() => { });
    const second = setImmediatePolyfill(() => { });
    expect(typeof first).toBe('number');
    expect(typeof second).toBe('number');
    expect(second).not.toBe(first);
  });

  it('preserves scheduling order', async () => {
    const order: number[] = [];
    setImmediatePolyfill(() => order.push(1));
    setImmediatePolyfill(() => order.push(2));
    setImmediatePolyfill(() => order.push(3));
    await nextMacrotask();
    expect(order).toEqual([1, 2, 3]);
  });

  it('clearImmediate cancels a pending callback', async () => {
    let ran = false;
    const handle = setImmediatePolyfill(() => {
      ran = true;
    });
    clearImmediatePolyfill(handle);
    await nextMacrotask();
    expect(ran).toBe(false);
  });

  it('warns and no-ops on a non-function callback', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
    try {
      const handle = (setImmediatePolyfill as any)('window.__evil = true');
      expect(handle).toBe(0);
      await nextMacrotask();
      expect((window as any).__evil).toBeUndefined();
      expect(
        warnSpy.mock.calls.some(
          (call) => typeof call[0] === 'string' && call[0].indexOf('setImmediate') !== -1
        )
      ).toBe(true);
    } finally {
      warnSpy.mockRestore();
    }
  });
});
