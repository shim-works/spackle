import { install as installPromise, isSupported as promiseSupported } from '../src/modules/es.promise.js';

/**
 * The widened Promise probe, and the gap that justifies widening it.
 *
 * es.promise used to keep any native with then/catch/resolve/reject. It now
 * also requires PromiseRejectionEvent and working @@species subclassing —
 * which Chrome 41 fails on both counts, and which is why core-js replaces the
 * native there too (its FORCED_PROMISE_CONSTRUCTOR fires on exactly these).
 *
 * Widening a probe means replacing natives that used to be left alone, so the
 * replacement has to be MORE conformant, not just faster. spackle's Promise
 * dispatches `unhandledrejection` and `rejectionhandled` itself — the very
 * thing the probe rejects the native for lacking. These tests hold
 * both halves of that bargain in place.
 */
describe('Promise probe — conformance-gated replacement', () => {
  const withNative = (body: () => void) => {
    const native = (window as any).Promise;
    try {
      body();
    } finally {
      (window as any).Promise = native;
    }
  };

  it('leaves a conformant modern native alone', () => {
    // The risk of this change is OVER-replacing. Chromium, WebKit and jsdom all
    // have PromiseRejectionEvent and honour @@species, so nothing should install.
    expect(typeof (window as any).PromiseRejectionEvent).toBe('function');
    expect(promiseSupported()).toBe(true);
  });

  it('rejects a native with no PromiseRejectionEvent, as on Chrome 41', () =>
    withNative(() => {
      const w: any = window;
      const savedEvent = w.PromiseRejectionEvent;
      try {
        delete w.PromiseRejectionEvent;
        expect(promiseSupported()).toBe(false);
      } finally {
        w.PromiseRejectionEvent = savedEvent;
      }
    }));

  it('rejects a native that ignores @@species when constructing from then()', () =>
    withNative(() => {
      // A Promise whose then() always returns a plain native promise, never the
      // species constructor — the pre-ES2015-semantics shape.
      const NoSpecies: any = function (executor: any) {
        const inner = new (window as any).Promise(executor);
        this.then = function () {
          return { notAPromise: true };
        };
        this.catch = inner.catch.bind(inner);
      };
      NoSpecies.resolve = function () {
        return new NoSpecies(function (r: any) {
          r(1);
        });
      };
      NoSpecies.reject = function () {
        return new NoSpecies(function (_r: any, j: any) {
          j(1);
        });
      };
      NoSpecies.prototype.then = function () {
        return { notAPromise: true };
      };
      NoSpecies.prototype.catch = function () {
        return this;
      };

      (window as any).Promise = NoSpecies;
      expect(promiseSupported()).toBe(false);
    }));

  it('stays supported once our own polyfill is installed, so it is not re-installed', () =>
    withNative(() => {
      installPromise();
      expect(((window as any).Promise as any).__polyfilled).toBe(true);
      expect(promiseSupported()).toBe(true);
    }));

  // A macrotask in terms of the NATIVE promise: the rejection check runs on a timer.
  const nextTurn = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));

  it('dispatches an unhandledrejection event carrying the promise and the reason', async () => {
    const native = (window as any).Promise;
    installPromise();
    const P: any = (window as any).Promise;
    const seen: any[] = [];
    const listener = (event: any) => {
      seen.push(event);
      event.preventDefault(); // also suppresses the console fallback
    };
    window.addEventListener('unhandledrejection', listener);
    try {
      const rejected = P.reject(new Error('nobody caught me'));
      const handled = P.reject(new Error('caught'));
      handled.catch(() => {});
      (window as any).Promise = native;
      await nextTurn();
      expect(seen.length).toBe(1);
      expect(seen[0].type).toBe('unhandledrejection');
      expect(seen[0].reason.message).toBe('nobody caught me');
      expect(seen[0].cancelable).toBe(true);
      expect(seen[0].promise).toBe(rejected);
    } finally {
      (window as any).Promise = native;
      window.removeEventListener('unhandledrejection', listener);
    }
  });

  it('fires rejectionhandled when a reported rejection is handled later', async () => {
    const native = (window as any).Promise;
    installPromise();
    const P: any = (window as any).Promise;
    (window as any).Promise = native;
    const cancel = (event: any) => event.preventDefault();
    const handledEvents: any[] = [];
    const onHandled = (event: any) => handledEvents.push(event);
    window.addEventListener('unhandledrejection', cancel);
    window.addEventListener('rejectionhandled', onHandled);
    try {
      const late = P.reject('late');
      await nextTurn();
      late.catch(() => {});
      await nextTurn();
      expect(handledEvents.length).toBe(1);
      expect(handledEvents[0].promise).toBe(late);
      expect(handledEvents[0].reason).toBe('late');
    } finally {
      window.removeEventListener('unhandledrejection', cancel);
      window.removeEventListener('rejectionhandled', onHandled);
    }
  });

  it('delivers to window.onunhandledrejection exactly once, never twice', async () => {
    const native = (window as any).Promise;
    installPromise();
    const P: any = (window as any).Promise;
    (window as any).Promise = native;
    const w: any = window;
    const saved = w.onunhandledrejection;

    /*
     * The double-delivery case. Where `onunhandledrejection` is a real
     * event-handler IDL attribute — every modern browser — dispatchEvent
     * invokes it on its own, so an unconditional explicit call hands the app
     * the same rejection twice.
     */
    const seen: any[] = [];
    w.onunhandledrejection = (event: any) => {
      seen.push(event.reason);
    };
    const cancel = (event: any) => event.preventDefault();
    window.addEventListener('unhandledrejection', cancel);
    try {
      P.reject('a string reason');
      await nextTurn();
      expect(seen).toEqual(['a string reason']);
    } finally {
      window.removeEventListener('unhandledrejection', cancel);
      w.onunhandledrejection = saved;
    }
  });
});
