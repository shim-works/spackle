#!/usr/bin/env node
/**
 * Run real test262 against spackle's own implementations.
 *
 * The hard part is that test262 tests GLOBALS. In any engine modern enough to
 * run it, spackle's isSupported() gates pass and nothing installs — so a naive
 * run measures V8, not this library. Each feature below therefore declares a
 * `strip` snippet that deletes the natives first, forcing the install.
 *
 * Two other details that produce silently wrong numbers if you skip them:
 *   - the bundle must be STRICT. Shipped output carries "use strict"; without
 *     it `Method.call(null)` boxes `this` to globalThis and every
 *     receiver-validation test bogusly passes.
 *   - bundle per feature, not the whole registry. One IIFE containing all
 *     modules aborts wholesale if any single module's install throws in the
 *     sandbox (e.g. one needing `document`).
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
import vm from 'node:vm';

const ROOT = resolve(import.meta.dirname, '..');
const T262 = process.env.TEST262 || resolve(ROOT, '../test262');
const MODULES = resolve(ROOT, 'src/modules');

/**
 * `modules` — what to bundle. `dir`/`only` — which test262 tree to run.
 * `strip` — delete the natives so spackle's gate actually fires.
 */
const FEATURES = {
  'iterator-helpers': {
    modules: ['_iterator-impl.ts'],
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
    modules: ['_uint8-array-impl.ts'],
    dir: 'test/built-ins/Uint8Array/prototype',
    only: ['toBase64', 'toHex', 'setFromBase64', 'setFromHex'],
    strip: `['toBase64','toHex','setFromBase64','setFromHex']
        .forEach(function (k) { delete Uint8Array.prototype[k]; });
      delete Uint8Array.fromBase64; delete Uint8Array.fromHex;`,
  },
  'uint8array-from': {
    modules: ['_uint8-array-impl.ts'],
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
    modules: ['_disposable-impl.ts'],
    dir: 'test/built-ins/DisposableStack',
    strip: `delete globalThis.DisposableStack; delete globalThis.AsyncDisposableStack;
      delete globalThis.SuppressedError;`,
  },
  'suppressed-error': {
    modules: ['_disposable-impl.ts'],
    dir: 'test/built-ins/SuppressedError',
    strip: `delete globalThis.SuppressedError; delete globalThis.DisposableStack;`,
  },
  'array-fromasync': {
    modules: ['es.array.from-async.ts'],
    dir: 'test/built-ins/Array/fromAsync',
    strip: `delete Array.fromAsync;`,
  },
  'math-f16round': {
    modules: ['_float16-impl.ts'],
    dir: 'test/built-ins/Math/f16round',
    strip: `delete Math.f16round; delete DataView.prototype.getFloat16;
      delete DataView.prototype.setFloat16;`,
  },
  'math-sumprecise': {
    modules: ['es.math.sum-precise.ts'],
    dir: 'test/built-ins/Math/sumPrecise',
    strip: `delete Math.sumPrecise;`,
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

const bundleFor = (name, cfg) => {
  const entry = join(workdir, name + '.entry.js');
  const out = join(workdir, name + '.js');
  const body = cfg.modules.map((m) => `import ${JSON.stringify(join(MODULES, m))};`).join('\n');
  writeFileSync(entry, body);
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
 * Each test gets a fresh vm context, and V8 does not reclaim those fast enough
 * to run every feature in one process -- a full sweep is ~1500 contexts and
 * dies with "Ineffective mark-compacts near heap limit". So a bare `yarn
 * test262` fans out to one child per feature; each child then runs the loop
 * below for exactly one.
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

let grandPass = 0, grandFail = 0;
for (const [name, cfg] of Object.entries(FEATURES)) {
  if (wanted.length && !wanted.includes(name)) continue;
  const bundle = bundleFor(name, cfg);
  const files = walk(cfg.dir, cfg.only);
  let pass = 0, fail = 0, skip = 0;
  const failures = [];

  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    const fm = frontmatter(src);
    if (fm.flags.includes('module') || fm.flags.includes('raw')) { skip++; continue; }
    // test262 runs most files in BOTH strict and sloppy mode. Running only
    // sloppy gives false failures on everything that asserts strict-mode
    // semantics (`this === undefined` inside a callback, for one), so run the
    // strict variant unless the file opts out.
    const strict = fm.flags.includes('noStrict') ? '' : '"use strict";\n';
    let includes = '';
    try { for (const inc of fm.includes) includes += harness(inc) + '\n'; }
    catch { skip++; continue; }
    if (fm.flags.includes('async')) includes += harness('doneprintHandle.js') + '\n';

    const ctx = vm.createContext({
      console, setTimeout, clearTimeout, setInterval, clearInterval,
      queueMicrotask, Promise, structuredClone,
    });
    ctx.globalThis = ctx;
    // test262's host hooks. Without these, every test that uses one reports as
    // "$262 is not defined" and looks like a polyfill limitation -- it isn't,
    // it's a missing runner feature. createRealm needs the feature's own bundle
    // loaded in the child realm, or cross-realm tests measure a bare context.
    ctx.__spackleBundle = bundle;
    ctx.__spackleStrip = cfg.strip;
    ctx.__makeRealm = () => {
      const child = vm.createContext({
        console, setTimeout, clearTimeout, setInterval, clearInterval,
        queueMicrotask, Promise, structuredClone,
      });
      child.globalThis = child;
      vm.runInContext('globalThis.window = globalThis;', child);
      vm.runInContext(cfg.strip, child);
      vm.runInContext(bundle, child);
      vm.runInContext(BASE, child);
      return child;
    };
    try {
      vm.runInContext('globalThis.window = globalThis;', ctx);
      vm.runInContext(cfg.strip, ctx);
      vm.runInContext(bundle, ctx);
      vm.runInContext(`
        globalThis.$262 = {
          global: globalThis,
          createRealm: function () {
            var realm = __makeRealm();
            realm.$262 = { global: realm, createRealm: $262.createRealm,
              detachArrayBuffer: $262.detachArrayBuffer, evalScript: $262.evalScript };
            return realm.$262;
          },
          // structuredClone with a transfer list genuinely detaches the source
          detachArrayBuffer: function (buffer) { structuredClone(buffer, { transfer: [buffer] }); },
          evalScript: function (source) { return (0, eval)(source); },
          gc: function () {},
        };
      `, ctx);
      vm.runInContext(strict + BASE + includes + src, ctx, { timeout: 5000 });
      pass++;
    } catch (error) {
      fail++;
      failures.push(
        file.replace(join(T262, 'test/built-ins') + '/', '') + ' :: ' + String(error.message).slice(0, 110)
      );
    }
  }

  grandPass += pass; grandFail += fail;
  const pct = pass + fail ? Math.round((pass / (pass + fail)) * 100) : 0;
  console.log(`${name}: ${pass}/${pass + fail} (${pct}%)${skip ? `  [skipped ${skip}]` : ''}`);
  if (VERBOSE) for (const f of failures) console.log('   ✗ ' + f);
}

const total = grandPass + grandFail;
if (wanted.length > 1 || Object.keys(FEATURES).length === 1) {
  console.log(`\ntotal: ${grandPass}/${total} (${total ? Math.round((grandPass / total) * 100) : 0}%)`);
}

// Hard exit. Async tests leave promise chains queued, and letting Node drain
// them after the results are in burns memory to no purpose -- Array/fromAsync's
// suite reliably OOM'd on teardown. Failures here are data, not an error, so
// the exit code stays 0 unless the run itself broke.
process.exit(0);
