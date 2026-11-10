import { defineConfig } from 'tsup';

export default defineConfig([
  /*
   * cjs + esm for bundlers, one file per format. `sideEffects: true`: spackle
   * installs at runtime and gates each member itself, so there's nothing to split.
   * `npm run build` lowers both to ES5 too: a bundler that skips node_modules
   * would otherwise ship `const` and arrows to Chrome 38.
   */
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
  },

  /*
   * dist/index.global.js: an IIFE for <script> tags, since the floor engines have
   * no modules. `npm run build` lowers it to ES5 afterwards
   * (scripts/downlevel-es5.mjs) and checks the result (scripts/verify-es5.mjs).
   */
  {
    entry: { index: 'src/index.ts' },
    format: ['iife'],
    globalName: 'spackle',
    target: 'es2020',
    dts: false,
    clean: false,
  },
]);
