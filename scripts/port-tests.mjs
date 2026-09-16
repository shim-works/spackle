#!/usr/bin/env node
/**
 * Ports the prior implementation's test262-derived test files into spackle.
 *
 * the prior implementation's tests import the raw polyfill function and call it
 * directly (e.g. `arrayFind.call([1,2,3], ...)`), never touching globals —
 * so porting is mostly "replace the import block, keep the body verbatim."
 * A single Repo B test file can cover several helpers (e.g.
 * array-es5-methods.test.ts), each of which now lives in its own spackle
 * module file, so the ported import block fans out to one import statement
 * per referenced module.
 *
 * A test file is ported only if EVERY polyfill export it imports has
 * already been ported to spackle (i.e. exists in the export->moduleId map
 * built from src/modules/*.ts). Partial-coverage files are reported and
 * skipped, not partially ported.
 *
 * Idempotent by default: a test file already present in tests/ is left
 * alone, since it may have spackle-specific edits on top (e.g. documented
 * jsdom-environment skips -- see tests/set-immediate.test.ts,
 * tests/typed-array.test.ts). Pass --force to re-port everything from Repo B
 * fresh, discarding any such local edits.
 *
 * Usage: node scripts/port-tests.mjs [--force]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const FORCE = process.argv.includes('--force');

const MODULES_DIR = resolve(import.meta.dirname, '../src/modules');
const REPO_B_TESTS = resolve(import.meta.dirname, '../../polyfill/tests');
const OUT_DIR = resolve(import.meta.dirname, '../tests');

// Build exportName -> moduleId from what's actually been ported, so this
// script stays correct as more modules are added without hand-maintaining
// a second table.
const exportToModuleId = new Map();
for (const file of readdirSync(MODULES_DIR)) {
  if (!file.endsWith('.ts')) continue;
  const moduleId = file.replace(/\.ts$/, '');
  const source = readFileSync(resolve(MODULES_DIR, file), 'utf-8');
  const re = /^export (?:const|function) ([A-Za-z0-9]+)/gm;
  let m;
  while ((m = re.exec(source))) {
    if (m[1] === 'isSupported') continue;
    exportToModuleId.set(m[1], moduleId);
  }
}

const IMPORT_BLOCK_RE = /import\s*\{([^}]+)\}\s*from\s*['"]the-prior-implementation['"];?/;

const ported = [];
const skipped = [];
const alreadyPresent = [];

for (const file of readdirSync(REPO_B_TESTS)) {
  if (!file.endsWith('.test.ts')) continue;

  if (!FORCE && existsSync(resolve(OUT_DIR, file))) {
    alreadyPresent.push(file);
    continue;
  }

  const source = readFileSync(resolve(REPO_B_TESTS, file), 'utf-8');
  const match = source.match(IMPORT_BLOCK_RE);
  if (!match) {
    skipped.push([file, 'no the prior implementation import found']);
    continue;
  }

  // the prior implementation's own barrel re-exports under aliases (e.g.
  // `Map as MapPolyfill`) -- the lookup must use the ORIGINAL name (what
  // spackle's module actually exports), while the generated import must
  // keep the alias, since the rest of the test file's body still refers to
  // it by that local name.
  const importSpecs = match[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [original, alias] = s.split(' as ').map((p) => p.trim());
      return { original, alias: alias ?? original };
    });

  const missing = importSpecs.filter((s) => !exportToModuleId.has(s.original));
  if (missing.length > 0) {
    skipped.push([file, `not yet ported: ${missing.map((s) => s.original).join(', ')}`]);
    continue;
  }

  // group by module id so each module gets one import statement
  const byModule = new Map();
  for (const spec of importSpecs) {
    const moduleId = exportToModuleId.get(spec.original);
    if (!byModule.has(moduleId)) byModule.set(moduleId, []);
    byModule.get(moduleId).push(spec.original === spec.alias ? spec.original : `${spec.original} as ${spec.alias}`);
  }
  const newImportBlock = Array.from(byModule.entries())
    .map(([moduleId, importedNames]) => `import { ${importedNames.join(', ')} } from '../src/modules/${moduleId}.js';`)
    .join('\n');

  const portedSource = source.replace(IMPORT_BLOCK_RE, newImportBlock);
  writeFileSync(resolve(OUT_DIR, file), portedSource);
  ported.push(file);
}

console.log(`Ported ${ported.length} test files:`);
for (const f of ported) console.log(`  ${f}`);
console.log(`\nAlready present, left alone (${alreadyPresent.length}) -- pass --force to re-port:`);
for (const f of alreadyPresent) console.log(`  ${f}`);
console.log(`\nSkipped ${skipped.length} test files:`);
for (const [f, reason] of skipped) console.log(`  ${f} — ${reason}`);
