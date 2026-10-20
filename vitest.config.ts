import { defineConfig } from 'vitest/config';

/**
 * Real browsers only: Playwright Chromium and WebKit (jsdom can't show the engine
 * behaviour these polyfills target). Neither reaches the Safari 7.1 floor: for
 * that, `npm run build:browser-tests` and open the ES5 bundle on an old engine.
 * Source-tree checks need fs, so they run in `npm run lint`.
 */
export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.ts'],
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      screenshotFailures: false,
      instances: [{ browser: 'chromium' }, { browser: 'webkit' }],
    },
  },
});
