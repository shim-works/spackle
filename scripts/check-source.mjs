#!/usr/bin/env node
/**
 * Source checks: facts about the files in src/, not about any engine. Run by
 * `npm run lint` (browsers have no fs).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const modulesDir = resolve(root, 'src/modules');
const files = readdirSync(modulesDir).filter((f) => f.endsWith('.ts'));
const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
};

/*
 * Install list: src/install-polyfills.ts is hand-ordered, so a forgotten module
 * would silently never install. This makes it a loud failure.
 */
{
  const modules = files.map((f) => f.replace(/\.ts$/, ''));
  const source = readFileSync(resolve(root, 'src/install-polyfills.ts'), 'utf8');
  const imported = [...source.matchAll(/(?:from |import )'\.\/modules\/(.+)\.js';$/gm)].map((m) => m[1]);
  const body = source.slice(source.indexOf('export const installPolyfills'));

  const missing = modules.filter((m) => !imported.includes(m));
  check(missing.length === 0, 'install list: not imported: ' + missing.join(', '));

  const phantom = imported.filter((m) => !modules.includes(m));
  check(phantom.length === 0, 'install list: imports missing files: ' + phantom.join(', '));

  const dupes = imported.filter((m, i) => imported.indexOf(m) !== i);
  check(dupes.length === 0, 'install list: imported twice: ' + dupes.join(', '));

  // Every install() it imports has to be called, gated or unconditional, never
  // wrapped -- see the "no try/catch, on purpose" note in install-polyfills.ts.
  const fns = [...source.matchAll(/\binstall as (install\w*)/g)].map((m) => m[1]);
  const uncalled = fns.filter((fn) => !new RegExp('^  (?:if \\(.*\\) )?' + fn + '\\(\\);$', 'm').test(source));
  check(uncalled.length === 0, 'install list: imported but never called: ' + uncalled.join(', '));

  // define()/defineGetter() swallow a locked-down owner, so nothing needs a
  // wrapper. applySymbolKeyFilters is the one exception.
  const wrapped = [...body.matchAll(/^  try \{ (\w+)\(\);/gm)].map((m) => m[1]);
  check(wrapped.join() === 'applySymbolKeyFilters', 'install list: wrapped in try: ' + wrapped.join(', '));

  // Symbol is the sole island that installs as it evaluates.
  check(imported[0] === 'es.symbol', 'install list: es.symbol must be the first import');
  const bare = [...source.matchAll(/^import '\.\/modules\/(.+)\.js';$/gm)].map((m) => m[1]);
  check(bare.length === 0, 'install list: bare side-effect imports: ' + bare.join(', '));

  // The key filters wrap the FINAL Object.keys / assign / JSON.stringify.
  const installs = [...body.matchAll(/^  (?:try \{|if |install)/gm)];
  check(
    body.trimEnd().endsWith('};') &&
      body.lastIndexOf('applySymbolKeyFilters();') > body.lastIndexOf(installs[installs.length - 2][0]),
    'install list: applySymbolKeyFilters must run last',
  );
}

/*
 * No island feature-detects against its own export: inside a module exporting
 * `Map`, a bare `typeof Map` tests the polyfill against itself. Read `window`.
 */
for (const file of files) {
  const source = readFileSync(resolve(modulesDir, file), 'utf8');
  const exported = new Set(
    [...source.matchAll(/^export (?:const|function|class) ([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]),
  );
  for (const name of exported) {
    const probe = new RegExp(
      String.raw`(?<![.\w$])typeof\s+${name.replace(/\$/g, '\\$')}\s*(?:!==|===)\s*['"]undefined['"]`,
    );
    check(!probe.test(source), `self-shadowing: ${file}: typeof ${name} resolves to its own export, not the global`);
  }
}

if (failures.length) {
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log(`source checks clean (${files.length} modules)`);
