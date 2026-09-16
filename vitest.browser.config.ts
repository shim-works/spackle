import { defineConfig } from 'vitest/config';

/**
 * The same suite, in a real engine instead of jsdom.
 *
 * `yarn test` (jsdom) stays the fast default; this is the fidelity run. jsdom is
 * a DOM *shim* — it cannot exhibit the engine behaviour these polyfills are
 * written against, and it has already hidden at least one real bug (`@@dispose`
 * wiring trapped inside an install gate, invisible in jsdom because jsdom has no
 * native DisposableStack to trip the gate).
 *
 * This reaches modern Chromium and WebKit, not the Chrome 38 / Safari 7.1
 * floor — nothing automatable goes back that far. For the actual target, use
 * `yarn build:browser-tests` and open the ES5 bundle on a real old engine.
 * WebKit is still the more informative of the two automatable engines here,
 * since it's the engine family the Safari 7.1 floor actually comes from.
 */
export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.ts'],
    exclude: [
      '**/node_modules/**',
      // imports @babel/core — a build tool. Node-only by nature.
      'tests/provider.test.ts',
      // leans on vi.resetModules() to force a module to re-evaluate after
      // deleting a native. Vite serves modules from its own graph and does not
      // re-run them on re-import, so the polyfill never reinstalls and the
      // assertions read undefined. Node-only mechanism, not a product concern —
      // scripts/build-browser-tests.mjs skips it for the same reason.
      'tests/install.test.ts',
    ],
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      screenshotFailures: false,
      instances: [{ browser: 'chromium' }, { browser: 'webkit' }],
    },
  },
});
