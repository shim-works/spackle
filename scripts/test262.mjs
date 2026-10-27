#!/usr/bin/env node
/**
 * Run real test262 against spackle's own implementations.
 *
 * test262 tests globals, and in a modern engine spackle's gates pass and nothing
 * installs, so each feature declares a `strip` snippet that deletes the natives
 * first. The bundle must be strict, as shipped output is: without it
 * `Method.call(null)` boxes `this` and receiver checks falsely pass.
 *
 * Setup (sparse checkout keeps it to ~18MB):
 *   git clone --depth 1 --filter=blob:none --sparse \
 *     https://github.com/tc39/test262.git ../test262
 *   cd ../test262 && git sparse-checkout set harness test
 *
 * Usage:
 *   node scripts/test262.mjs                 # every feature
 *   node scripts/test262.mjs iterator-helpers
 *   node scripts/test262.mjs --verbose       # list individual failures
 *   TEST262=/path/to/test262 node scripts/test262.mjs
 */
import { readFileSync, readdirSync, statSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { createEngine, runInBrowser } from './test262-browser.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const T262 = process.env.TEST262 || resolve(ROOT, '../test262');

/**
 * `modules` — what to bundle. `dir`/`only` — which test262 tree to run.
 * `strip` — delete the natives so spackle's gate actually fires.
 */
const FEATURES = {
  'iterator-helpers': {
    modules: ['install-iterator.ts'],
    dir: 'test/built-ins/Iterator/prototype',
    // only the ids spackle registers -- the same tree holds esnext helpers
    // (chunks/windows/sliding/zip) that are deliberately out of scope
    only: ['map', 'filter', 'take', 'drop', 'flatMap', 'reduce', 'toArray',
           'forEach', 'some', 'every', 'find', 'constructor', 'Symbol.dispose'],
    strip: `var IP = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));
      ['map','filter','take','drop','flatMap','reduce','toArray','forEach','some','every','find']
        .forEach(function (k) { delete IP[k]; });
      delete globalThis.Iterator;`,
  },
  'uint8array-base64': {
    modules: ['install-uint8-array.ts'],
    dir: 'test/built-ins/Uint8Array/prototype',
    only: ['toBase64', 'toHex', 'setFromBase64', 'setFromHex'],
    strip: `['toBase64','toHex','setFromBase64','setFromHex']
        .forEach(function (k) { delete Uint8Array.prototype[k]; });
      delete Uint8Array.fromBase64; delete Uint8Array.fromHex;`,
  },
  'uint8array-from': {
    modules: ['install-uint8-array.ts'],
    dir: 'test/built-ins/Uint8Array',
    only: ['fromBase64', 'fromHex'],
    strip: `delete Uint8Array.fromBase64; delete Uint8Array.fromHex;`,
  },
  'map-getorinsert': {
    modules: ['es.map.get-or-insert.ts', 'es.map.get-or-insert-computed.ts'],
    dir: 'test/built-ins/Map/prototype',
    only: ['getOrInsert', 'getOrInsertComputed'],
    strip: `delete Map.prototype.getOrInsert; delete Map.prototype.getOrInsertComputed;`,
  },
  'weakmap-getorinsert': {
    modules: ['es.weak-map.get-or-insert.ts', 'es.weak-map.get-or-insert-computed.ts'],
    dir: 'test/built-ins/WeakMap/prototype',
    only: ['getOrInsert', 'getOrInsertComputed'],
    strip: `delete WeakMap.prototype.getOrInsert; delete WeakMap.prototype.getOrInsertComputed;`,
  },
  'disposable-stack': {
    modules: ['install-disposable.ts'],
    dir: 'test/built-ins/DisposableStack',
    strip: `delete globalThis.DisposableStack; delete globalThis.AsyncDisposableStack;
      delete globalThis.SuppressedError;`,
  },
  'suppressed-error': {
    modules: ['install-disposable.ts'],
    dir: 'test/built-ins/SuppressedError',
    strip: `delete globalThis.SuppressedError; delete globalThis.DisposableStack;`,
  },
  'array-fromasync': {
    modules: ['es.array.from-async.ts'],
    dir: 'test/built-ins/Array/fromAsync',
    strip: `delete Array.fromAsync;`,
  },
  'math-f16round': {
    modules: ['install-float16.ts'],
    dir: 'test/built-ins/Math/f16round',
    strip: `delete Math.f16round; delete DataView.prototype.getFloat16;
      delete DataView.prototype.setFloat16;`,
  },
  'math-sumprecise': {
    modules: ['es.math.sum-precise.ts'],
    dir: 'test/built-ins/Math/sumPrecise',
    strip: `delete Math.sumPrecise;`,
  },
  reflect: {
    modules: ['install-reflect.ts'],
    dir: 'test/built-ins/Reflect',
    strip: `delete globalThis.Reflect;`,
  },
  'map-groupby': {
    modules: ['es.map.group-by.ts'],
    dir: 'test/built-ins/Map/groupBy',
    strip: `delete Map.groupBy;`,
  },
  'object-groupby': {
    modules: ['es.object.group-by.ts'],
    dir: 'test/built-ins/Object/groupBy',
    strip: `delete Object.groupBy;`,
  },
};

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const wanted = args.filter((a) => !a.startsWith('--'));

if (!statSafe(join(T262, 'harness', 'assert.js'))) {
  console.error(`test262 not found at ${T262}\nSee the setup block at the top of this file.`);
  process.exit(2);
}

function statSafe(p) {
  try { return statSync(p); } catch { return null; }
}

const harness = (f) => readFileSync(join(T262, 'harness', f), 'utf8');
const BASE = harness('assert.js') + '\n' + harness('sta.js') + '\n';

const workdir = mkdtempSync(join(tmpdir(), 'spackle-t262-'));
process.on('exit', () => rmSync(workdir, { recursive: true, force: true }));

const INDEX = resolve(ROOT, 'src/index.ts');

/*
 * The bundle is spackle's real entry point (src/index.ts runs installPolyfills()),
 * not a module list: most modules are value-only, with their gate in
 * install-polyfills.ts, so importing them alone installs nothing.
 */
const bundleFor = () => {
  const entry = join(workdir, 'index.entry.js');
  const out = join(workdir, 'index.js');
  writeFileSync(entry, `import ${JSON.stringify(INDEX)};`);
  execFileSync('npx', ['esbuild', entry, '--bundle', '--format=iife',
    '--platform=browser', '--target=es2020',
    '--banner:js=' + '"use strict";', '--outfile=' + out], { stdio: 'pipe' });
  return readFileSync(out, 'utf8');
};

const walk = (dir, only) => {
  const out = [];
  const rec = (d) => {
    let entries;
    try { entries = readdirSync(d); } catch { return; }
    for (const e of entries) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) { rec(p); continue; }
      if (!e.endsWith('.js') || e.endsWith('_FIXTURE.js')) continue;
      out.push(p);
    }
  };
  const root = join(T262, dir);
  if (only) for (const sub of only) rec(join(root, sub));
  else rec(root);
  return out;
};

const frontmatter = (src) => {
  const m = src.match(/\/\*---([\s\S]*?)---\*\//);
  if (!m) return { includes: [], flags: [] };
  const list = (k) => {
    const mm = m[1].match(new RegExp(k + ':\\s*\\[(.*?)\\]'));
    return mm ? mm[1].split(',').map((s) => s.trim()).filter(Boolean) : [];
  };
  return { includes: list('includes'), flags: list('flags') };
};

/**
 * Each test gets a fresh realm, and a page does not reclaim those fast enough
 * to run a whole feature in one -- so pages are recycled per chunk, and the
 * browser itself is replaced if a test wedges the renderer. A bare
 * `yarn test262` still fans out to one child per feature to keep the driver's
 * own heap flat.
 */
if (!wanted.length) {
  const names = Object.keys(FEATURES);
  let ok = true;
  for (const name of names) {
    try {
      execFileSync(process.execPath, ['--max-old-space-size=3000', import.meta.filename, name,
        ...(VERBOSE ? ['--verbose'] : [])], { stdio: 'inherit', env: process.env });
    } catch {
      ok = false;
    }
  }
  process.exit(ok ? 0 : 1);
}

// built once: the same install run backs every feature
const SPACKLE_BUNDLE = bundleFor();

let grandPass = 0, grandFail = 0;

// Runs in Chromium and WebKit (the Safari 7.1 floor's family); ENGINES=chromium
// narrows it.
const ENGINES = (process.env.ENGINES || 'chromium,webkit').split(',');
const BROWSERS = {};
for (const e of ENGINES) BROWSERS[e] = await createEngine(e);

for (const [name, cfg] of Object.entries(FEATURES)) {
  if (wanted.length && !wanted.includes(name)) continue;
  const bundle = SPACKLE_BUNDLE;
  const files = walk(cfg.dir, cfg.only);

  // Prepare each file once; both engines run the identical payload.
  const tests = [];
  let skip = 0;
  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    const fm = frontmatter(src);
    if (fm.flags.includes('module') || fm.flags.includes('raw')) { skip++; continue; }
    // test262 runs most files in BOTH strict and sloppy mode. Running only
    // sloppy gives false failures on everything that asserts strict-mode
    // semantics (`this === undefined` inside a callback, for one), so run the
    // strict variant unless the file opts out.
    const strict = fm.flags.includes('noStrict') ? '' : '"use strict";\n';
    const isAsync = fm.flags.includes('async');
    let includes = '';
    try {
      for (const inc of fm.includes) includes += harness(inc) + '\n';
    } catch { skip++; continue; }
    tests.push({
      file: file.replace(join(T262, 'test/built-ins') + '/', ''),
      code: strict + BASE + includes + src,
      isAsync,
    });
  }

  for (const engineName of ENGINES) {
    const results = await runInBrowser({ engine: BROWSERS[engineName], bundle, strip: cfg.strip, tests });
    const failures = results.filter((r) => !r.ok);
    const pass = results.length - failures.length;
    grandPass += pass; grandFail += failures.length;
    const pct = results.length ? Math.round((pass / results.length) * 100) : 0;
    console.log(`${name} [${engineName}]: ${pass}/${results.length} (${pct}%)${skip ? `  [skipped ${skip}]` : ''}`);
    if (VERBOSE) for (const f of failures) console.log('   \u2717 ' + f.file + ' :: ' + String(f.error).slice(0, 110));
  }
}

for (const e of ENGINES) await BROWSERS[e].close();

const total = grandPass + grandFail;
if (wanted.length > 1 || Object.keys(FEATURES).length === 1) {
  console.log(`\ntotal: ${grandPass}/${total} (${total ? Math.round((grandPass / total) * 100) : 0}%)`);
}

// Hard exit. Async tests leave promise chains queued, and letting Node drain
// them after the results are in burns memory to no purpose -- Array/fromAsync's
// suite reliably OOM'd on teardown. Failures here are data, not an error, so
// the exit code stays 0 unless the run itself broke.
process.exit(0);
