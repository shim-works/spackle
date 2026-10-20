#!/usr/bin/env node
/**
 * Confirm the built output really is ES5: esbuild emits arrow functions and
 * `let` in its own interop helpers, whatever the source looks like. Strings and
 * comments are stripped before matching, to avoid false positives.
 */
import { readFileSync } from 'node:fs';

/** Remove comments and string literals so only real syntax is matched. */
function strip(source) {
  let out = '';
  let i = 0;
  const n = source.length;

  while (i < n) {
    const c = source[i];
    const next = source[i + 1];

    if (c === '/' && next === '/') {
      while (i < n && source[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && next === '*') {
      i += 2;
      while (i < n && !(source[i] === '*' && source[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    if (c === '"' || c === "'") {
      const quote = c;
      i++;
      while (i < n && source[i] !== quote) {
        if (source[i] === '\\') i++;
        i++;
      }
      i++;
      out += '""';
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

const CHECKS = [
  [/(^|[^.\w$])(const|let)\s+[A-Za-z_$[{]/, 'const/let'],
  [/=>/, 'arrow function'],
  [/`/, 'template literal'],
  [/(^|[^.\w$])class\s+[A-Za-z_$]/, 'class declaration'],
  [/\.\.\./, 'spread/rest'],
  [/(^|[^.\w$])function\s*\*/, 'generator'],
  [/(^|[^.\w$])async\s/, 'async'],
  [/\?\./, 'optional chaining'],
  [/\?\?/, 'nullish coalescing'],
  [/(^|[^.\w$])for\s*\(\s*(var|let|const)?\s*[A-Za-z_$]+\s+of\s/, 'for...of'],
  [/\*\*/, 'exponentiation operator'],
];

// Only the IIFE builds: dist/index.js and .mjs go to bundlers, which downlevel
// with their own targets. Paths come from argv so build:bundle checks the file
// it just wrote.
const FILES = process.argv.slice(2);
if (FILES.length === 0) FILES.push('dist/index.global.js');
let failures = 0;

for (const file of FILES) {
  let raw;
  try {
    raw = readFileSync(file, 'utf8');
  } catch {
    console.log(`  ${file}  MISSING`);
    failures++;
    continue;
  }
  const code = strip(raw);
  let fileBad = 0;
  for (const [re, label] of CHECKS) {
    const match = code.match(re);
    if (match) {
      const line = code.slice(0, match.index).split('\n').length;
      console.log(`  ${file}:${line}  ${label}  ->  ${match[0].trim().slice(0, 40)}`);
      fileBad++;
    }
  }
  if (!fileBad) console.log(`  ${file}  clean (${Math.round(raw.length / 1024)} KB)`);
  failures += fileBad;
}

if (failures) {
  console.log(`\nES5 check FAILED — ${failures} problem(s)`);
  process.exit(1);
}
console.log('\nES5 syntax check clean');
