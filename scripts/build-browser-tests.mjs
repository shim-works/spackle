#!/usr/bin/env node
/**
 * Bundle the whole test suite into one ES5 file you can open in any browser.
 *
 * Why this exists: every test otherwise runs in jsdom or Node. jsdom is a DOM
 * *shim* — it cannot exhibit the engine quirks the polyfills are written for, so
 * a green `yarn test` says nothing about whether spackle works on the
 * Chrome 38 / Safari 7.1 floor it targets. This output is something you can load
 * on a real old device, a VM, or a BrowserStack session and get a real answer.
 *
 * Two constraints shape the pipeline:
 *   - esbuild alone cannot produce ES5 here. It lowers `async` only as far as
 *     generators, and generators need ES6. Ten suites are async, so the bundle
 *     goes through Babel + regenerator afterwards.
 *   - the suite calls describe/it/expect as globals (vitest `globals: true`) and
 *     a few files `import ... from 'vitest'`, so both paths are pointed at
 *     tests/browser/harness.ts.
 *
 * Usage: node scripts/build-browser-tests.mjs
 *   -> src/debug/spackle-test.js + src/debug/spackle-test.html
 *
 * Lives under src/, committed — not dist/. `yarn build` (tsup, clean: true)
 * wipes dist/ on every real build, which used to take this output out with
 * it. This is meant to be a durable utility you can just open, the way
 * @babel/runtime's helpers are committed source rather than a throwaway
 * build byproduct.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import * as babel from '@babel/core';

const ROOT = resolve(import.meta.dirname, '..');
const TESTS = join(ROOT, 'tests');
const OUT_DIR = join(ROOT, 'src', 'debug');
const OUT = join(OUT_DIR, 'spackle-test.js');
const OUT_HTML = join(OUT_DIR, 'spackle-test.html');

/**
 * Files that cannot run in a browser bundle, each for a concrete reason.
 * Everything else is included.
 */
const EXCLUDED = {
  'provider.test.ts': 'imports @babel/core — a build tool, not browser code',
  'dom-collections-for-each.test.ts': 'node-only imports',
  // vi.resetModules() re-evaluates an ES module graph, which does not exist
  // once bundled; vi.spyOn is only used alongside it in these files
  'install.test.ts': 'vi.resetModules() has no meaning in a bundle',
  'set-immediate.test.ts': 'vi.useFakeTimers / module reset',
  'url-polyfill.test.ts': 'vi.spyOn on document.implementation',
};

const testFiles = readdirSync(TESTS)
  .filter((f) => f.endsWith('.test.ts') && !EXCLUDED[f])
  .sort();

const skipped = Object.keys(EXCLUDED);
console.log(`including ${testFiles.length} test files, skipping ${skipped.length}:`);
for (const f of skipped) console.log(`  - ${f}  (${EXCLUDED[f]})`);

const tmp = join(ROOT, 'node_modules', '.spackle-browser-tests');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

// A stand-in module for `import ... from 'vitest'`, re-exporting the harness.
writeFileSync(
  join(tmp, 'vitest-shim.ts'),
  `export { describe, it, expect } from ${JSON.stringify(join(TESTS, 'browser/harness.ts'))};\n`
    + `export const test = undefined as any;\n`,
);

// The global assignment MUST live in its own module. ES module imports are
// hoisted above every statement, so writing `g.describe = describe` in the
// entry body would run AFTER the test files had already been evaluated -- and
// they call describe() at module scope. Importing this first is what sequences
// it, exactly like `import "@shim-works/spackle"` at the top of an app.
writeFileSync(
  join(tmp, 'globals.ts'),
  `import { describe, it, expect } from ${JSON.stringify(join(TESTS, 'browser/harness.ts'))};\n`
    + `const g: any = typeof window !== 'undefined' ? window : globalThis;\n`
    + `g.describe = describe; g.it = it; g.expect = expect;\n`,
);

const entry = join(tmp, 'entry.ts');
writeFileSync(
  entry,
  [
    `import 'regenerator-runtime/runtime.js';`,
    `import ${JSON.stringify(join(tmp, 'globals.ts'))};`,
    `import { run, render } from ${JSON.stringify(join(TESTS, 'browser/harness.ts'))};`,
    ``,
    `const g: any = typeof window !== 'undefined' ? window : globalThis;`,
    ``,
    ...testFiles.map((f) => `import ${JSON.stringify(join(TESTS, f))};`),
    ``,
    `g.spackleTest = function () {`,
    `  return run().then(function (results: any) {`,
    `    render(results);`,
    `    if (typeof console !== 'undefined' && console.log) {`,
    `      console.log('spackle: ' + results.passed + ' passed, ' + results.failed + ' failed');`,
    `      for (var i = 0; i < results.failures.length; i++) console.log(results.failures[i]);`,
    `    }`,
    `    g.__debugResult = results;`,
    `    return results;`,
    `  });`,
    `};`,
    // Auto-run on load in addition to staying manually callable: makes this
    // drivable headlessly (poll window.__debugResult for a defined value)
    // without requiring a human to open a console and call spackleTest().
    `g.spackleTest();`,
  ].join('\n'),
);

// Step 1 — bundle. ES2017 keeps async intact for Babel to lower properly.
const bundled = join(tmp, 'bundled.js');
execFileSync(
  'npx',
  [
    'esbuild', entry,
    '--bundle',
    '--format=iife',
    '--platform=browser',
    '--target=es2017',
    `--alias:vitest=${join(tmp, 'vitest-shim.ts')}`,
    '--outfile=' + bundled,
  ],
  { stdio: 'inherit' },
);

// Step 2 — down to real ES5.
const result = babel.transformFileSync(bundled, {
  babelrc: false,
  configFile: false,
  compact: false,
  presets: [[
    '@babel/preset-env',
    {
      targets: { chrome: '38', safari: '7.1' },
      // the polyfills under test provide the built-ins; only syntax is lowered
      useBuiltIns: false,
      exclude: ['transform-typeof-symbol'],
    },
  ]],
});

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, result.code);

// No placeholder markup: window.spackleTest() auto-runs on load and
// harness.ts's render() appends its own <pre> with results once done.
const html = [
  '<!doctype html>',
  '<html>',
  '<head><meta charset="utf-8"><title>spackle browser tests</title></head>',
  '<body>',
  '<script src="spackle-test.js"></script>',
  '</body>',
  '</html>',
  '',
].join('\n');
writeFileSync(OUT_HTML, html);

const bytes = readFileSync(OUT).length;
console.log(`\nwrote src/debug/spackle-test.js (${Math.round(bytes / 1024)} KB)`);
console.log('wrote src/debug/spackle-test.html');

// Sanity check that it really is ES5. Only constructs that cannot appear inside
// a comment or string without also appearing as syntax are worth testing --
// `async function` and backticks show up in regenerator's comments and in test
// names, so they false-positive. The authoritative check is running it.
const code = result.code;
const smells = [
  ['arrow function', /=>/],
  ['let binding', /\blet\s+[A-Za-z_$]/],
  ['const binding', /\bconst\s+[A-Za-z_$]/],
];
const found = smells.filter(([, re]) => re.test(code)).map(([label]) => label);
console.log(found.length ? `  WARNING non-ES5 syntax present: ${found.join(', ')}` : '  ES5 syntax check clean');
