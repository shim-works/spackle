/**
 * The in-browser half of the test262 run: Node drives, a real engine asserts.
 * WebKit as well as Chromium, since WebKit is the Safari 7.1 floor's family (still
 * a modern one: engine-era bugs are spackle-verify's job). Each test gets a fresh
 * iframe realm with a real DOM, since test262 requires a clean global.
 */
import { chromium, webkit } from 'playwright';

/** One browser, reused for the whole run (cold starts dominated the wall clock). */
export async function openEngine(engineName) {
  const launcher = engineName === 'webkit' ? webkit : chromium;
  return launcher.launch();
}

/**
 * A browser that can be replaced mid-run: a test can wedge the renderer, and
 * page.close() then blocks on the stuck process. Abandoning the browser is the
 * only reliable escape.
 */
export async function createEngine(engineName) {
  const launcher = engineName === 'webkit' ? webkit : chromium;

  /*
   * launchServer, not launch, so a wedged browser can be SIGKILLed:
   * browser.close() never resolves on one, and an abandoned renderer spins a core.
   */
  const open = async () => {
    const server = await launcher.launchServer();
    return { server, browser: await launcher.connect(server.wsEndpoint()) };
  };

  let current = await open();
  return {
    get browser() { return current.browser; },
    async replace() {
      current.server.kill();
      current = await open();
    },
    async close() {
      try { await Promise.race([current.browser.close(), new Promise((r) => setTimeout(r, 3000))]); } catch { /* wedged */ }
      current.server.kill();
    },
  };
}

/** One batch of tests in one engine. Returns [{file, ok, error}]. */
export async function runInBrowser({ engine, bundle, strip, tests, onProgress }) {
  const results = [];
  {
    /*
     * A fresh page per chunk: async tests can leave timers and promise chains
     * queued behind a removed iframe, and enough of those take the tab down.
     */
    const CHUNK = 25;

    /*
     * A crash or timeout is data, not a fatal: the failing test is isolated and
     * recorded as a failure.
     */
    const runChunk = async (batch, timeout) => {
      const page = await engine.browser.newPage();
      try {
        await page.setContent('<!doctype html><html><body></body></html>');
        await page.addScriptTag({ content: RUNNER });
        return await page.evaluate(
          ([bundleSrc, stripSrc, b]) => window.__t262.runBatch(bundleSrc, stripSrc, b),
          [bundle, strip, batch],
          { timeout },
        );
      } finally {
        // never awaited past a deadline: closing a page whose renderer is
        // spinning blocks on that same stuck process
        await Promise.race([
          Promise.resolve(page.close()).catch(() => {}),
          new Promise((r) => setTimeout(r, 2000)),
        ]);
      }
    };

    // On a chunk failure, run one test at a time: bisecting re-pays the timeout at
    // every level.
    const runResilient = async (batch) => {
      try {
        return await runChunk(batch, 30000);
      } catch {
        await engine.replace();
        const out = [];
        for (const test of batch) {
          try {
            for (const r of await runChunk([test], 5000)) out.push(r);
          } catch (error) {
            out.push({
              file: test.file,
              ok: false,
              error: 'hung or crashed the renderer: ' + String(error.message).split('\n')[0],
            });
            await engine.replace();
          }
        }
        return out;
      }
    };

    for (let i = 0; i < tests.length; i += CHUNK) {
      for (const r of await runResilient(tests.slice(i, i + CHUNK))) results.push(r);
      if (onProgress) onProgress(results.length, tests.length);
    }
  }
  return results;
}

/** Injected into the page as a string via addScriptTag (no module graph there). */
const RUNNER = `
window.__t262 = (function () {
  function freshRealm() {
    var frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-same-origin allow-scripts');
    document.body.appendChild(frame);
    return frame;
  }

  /*
   * test262's host hooks. Without these every test that uses one reports as
   * "$262 is not defined" and reads like a polyfill limitation -- it is not,
   * it is a missing runner feature. createRealm has to load the feature's own
   * bundle into the child realm, or cross-realm tests measure a bare page.
   */
  function install262(w, bundleSrc, stripSrc, onPrint) {
    w.eval(stripSrc);
    w.eval(bundleSrc);
    w.print = onPrint;
    /*
     * $DONE is assigned, not declared through doneprintHandle.js.
     *
     * That file declares \`function $DONE\` and the test body is a STRICT eval,
     * whose function declarations stay in the eval's own scope -- so
     * asyncHelpers.js's \`hasOwnProperty(globalThis, '$DONE')\` guard failed and
     * every async file died with "asyncTest called without async flag".
     * Assigning it puts a real own property on the realm's global.
     */
    w.$DONE = function (error) {
      onPrint(
        error
          ? 'Test262:AsyncTestFailure:' + ((error && error.name) || 'Test262Error') +
              ': ' + ((error && error.message) || String(error))
          : 'Test262:AsyncTestComplete'
      );
    };
    w.$262 = {
      global: w,
      createRealm: function () {
        var child = freshRealm().contentWindow;
        install262(child, bundleSrc, stripSrc, onPrint);
        return child.$262;
      },
      // structuredClone with a transfer list genuinely detaches the source
      detachArrayBuffer: function (buffer) { w.structuredClone(buffer, { transfer: [buffer] }); },
      evalScript: function (source) { return w.eval(source); },
      gc: function () {},
    };
  }

  function runOne(bundleSrc, stripSrc, test) {
    var frame = freshRealm();
    var w = frame.contentWindow;
    var printed = null;
    try {
      install262(w, bundleSrc, stripSrc, function (msg) { printed = String(msg); });

      // One eval, everything concatenated: a strict-mode eval keeps its
      // function declarations in its own scope, so the harness, the includes
      // and the test body have to share exactly one of them.
      w.eval(test.code);

      if (!test.isAsync) return { file: test.file, ok: true };

      /*
       * An async test resolves through $DONE, which calls print(). The old
       * harness counted a pass whenever nothing threw SYNCHRONOUSLY, so every
       * async file passed regardless of outcome -- and \`print\` was not even
       * defined in the context, so $DONE threw into a microtask nobody
       * watched. 525 tests in the reachable areas were affected.
       */
      return new Promise(function (resolve) {
        var waited = 0;
        // the realm holds a whole spackle bundle; leaving it attached until the
        // chunk ends crashed the tab outright on the 86 async fromAsync files
        function done(result) {
          if (frame.parentNode) frame.parentNode.removeChild(frame);
          resolve(result);
        }
        (function poll() {
          if (printed !== null) {
            done(
              printed.indexOf('Test262:AsyncTestComplete') === 0
                ? { file: test.file, ok: true }
                : { file: test.file, ok: false, error: printed }
            );
            return;
          }
          if ((waited += 10) > 1500) {
            done({ file: test.file, ok: false, error: 'async test never called $DONE (timeout)' });
            return;
          }
          setTimeout(poll, 10);
        })();
      });
    } catch (error) {
      return { file: test.file, ok: false, error: String((error && error.message) || error) };
    } finally {
      // the realm is torn down either way; an async poll holds its own ref
      if (!test.isAsync) frame.parentNode.removeChild(frame);
    }
  }

  return {
    runBatch: function (bundleSrc, stripSrc, batch) {
      var out = [];
      var i = 0;
      function next() {
        if (i >= batch.length) return Promise.resolve(out);
        var result = runOne(bundleSrc, stripSrc, batch[i++]);
        return Promise.resolve(result).then(function (r) { out.push(r); return next(); });
      }
      return next();
    },
    reset: function () {
      var frames = document.querySelectorAll('iframe');
      for (var i = 0; i < frames.length; i++) frames[i].parentNode.removeChild(frames[i]);
    },
  };
})();
`;
