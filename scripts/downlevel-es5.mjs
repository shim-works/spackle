#!/usr/bin/env node
/**
 * Lower built files to ES5 in place: `node scripts/downlevel-es5.mjs <file...>`.
 * Used on the IIFE and on the cjs/esm entry points: all three are plain scripts
 * with no import/export, and a bundler that skips node_modules ships them as-is.
 *
 * swc with the floor as targets, minus the two passes that turn operators into
 * per-call helpers (`typeof` -> _type_of, `instanceof` -> _instanceof). Polyfilled
 * symbols are documented as typeof 'object', and no spackle class defines
 * @@hasInstance. swc refuses `env` with `jsc.target`, so targets name the floor.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import swc from '@swc/core';

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('usage: node scripts/downlevel-es5.mjs <file...>');
  process.exit(1);
}

for (const file of files) {
  const result = swc.transformSync(readFileSync(file, 'utf8'), {
    filename: file,
    swcrc: false,
    jsc: { parser: { syntax: 'ecmascript' } },
    env: {
      targets: 'chrome 38, safari 7.1',
      exclude: ['transform-typeof-symbol', 'transform-instanceof'],
    },
    module: { type: 'es6' },
  });

  writeFileSync(file, result.code);
  console.log(`  ${file}  downlevelled to ES5 (no _type_of / _instanceof)`);
}
