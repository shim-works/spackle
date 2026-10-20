import { defineConfig } from 'tsup';

/**
 * `npm run build:bundle` -> ./spackle.js
 *
 * The drop-in file: one self-executing ES5 IIFE, no imports, no init call. Same
 * entry as the package build. Not minified, so stack frames stay readable on
 * devices without a debugger; keep the ES5 target if you minify downstream.
 * Lowered to ES5 by scripts/downlevel-es5.mjs and checked by scripts/verify-es5.mjs.
 */
export default defineConfig({
  entry: { spackle: 'src/index.ts' },
  format: ['iife'],
  globalName: 'spackle',
  target: 'es2020',
  outDir: '.',
  // tsup names IIFE output `<entry>.global.js`; this is a standalone file, not
  // a format variant sitting beside siblings, so it is just spackle.js.
  outExtension: () => ({ js: '.js' }),
  minify: false,
  dts: false,
  clean: false,
});
