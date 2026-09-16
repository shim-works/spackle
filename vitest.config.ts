import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Ported test files (from the prior implementation) rely on describe/it/expect
    // being global, same as that repo's own vitest.config.ts.
    globals: true,
    include: ['tests/**/*.test.ts'],
    // spackle is browser-only -- its window-null/delete/reassign pattern and
    // web.* module tests (document.querySelectorAll etc) need `window` and
    // basic DOM primitives to exist at all, or they throw ReferenceError on
    // import in plain Node. jsdom is sufficient here since these tests
    // exercise the polyfill logic itself (given a NodeList/DOMTokenList-
    // shaped input), not real-browser behavioral nuances -- unlike
    // the prior implementation's own suite, which specifically avoids jsdom because
    // it verifies genuine cross-engine quirks against real Playwright
    // browsers. That fidelity bar doesn't apply to testing ported logic.
    environment: 'jsdom',
  },
});
