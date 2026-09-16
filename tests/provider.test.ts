import { describe, expect, it } from 'vitest';
import { transformAsync } from '@babel/core';
import spacklePlugin from '../src/provider.js';
import { moduleRegistry } from '../src/module-registry.js';

const run = async (targets: string[]) => {
  const result = await transformAsync('import "@shim-works/spackle/stable";\n', {
    babelrc: false,
    configFile: false,
    filename: 'app-entry.js',
    presets: [],
    plugins: [[spacklePlugin, { method: 'entry-global', targets }]],
  });
  return result?.code ?? '';
};

describe('spackle provider (entry-global)', () => {
  it('expands "@shim-works/spackle/stable" into all three ported modules for chrome 38 / safari 7', async () => {
    const code = await run(['chrome 38', 'safari 7']);
    expect(code).toContain('@shim-works/spackle/modules/es.array.flat');
    expect(code).toContain('@shim-works/spackle/modules/es.object.from-entries');
    expect(code).toContain('@shim-works/spackle/modules/es.string.pad-start');
  });

  it('drops modules the target already supports natively', async () => {
    // flat/fromEntries/padStart all shipped well before Chrome 130.
    const code = await run(['chrome 130']);
    expect(code).not.toContain('@shim-works/spackle/modules/es.array.flat');
    expect(code).not.toContain('@shim-works/spackle/modules/es.object.from-entries');
    expect(code).not.toContain('@shim-works/spackle/modules/es.string.pad-start');
  });

  it('injects nearly every registered module for chrome 38 / safari 7 (almost none are natively supported there)', async () => {
    const code = await run(['chrome 38', 'safari 7']);
    const registeredIds = Object.keys(moduleRegistry);
    expect(registeredIds.length).toBeGreaterThan(70);

    // web.timers is a real, deliberate exception: core-js-compat's own data
    // (core-js-compat/data.json) shows it's been natively supported since
    // chrome 1 / safari 1 (it's the setTimeout-callback-arg-passing fix, an
    // IE-era gap, not what the prior implementation's set-immediate.ts actually
    // addresses) -- so it's correctly never injected for this target. Every
    // other registered module IS needed here and must appear.
    const knownNeverNeeded = new Set(['web.timers']);
    for (const id of registeredIds) {
      if (knownNeverNeeded.has(id)) continue;
      expect(code).toContain(`@shim-works/spackle/modules/${id}`);
    }
  });

  it('leaves the import untouched if the source is not a recognized spackle entry', async () => {
    const result = await transformAsync('import "some-other-package";\n', {
      babelrc: false,
      configFile: false,
      filename: 'app-entry.js',
      presets: [],
      plugins: [[spacklePlugin, { method: 'entry-global', targets: ['chrome 38', 'safari 7'] }]],
    });
    expect(result?.code).toContain('some-other-package');
  });
});

const runUsage = async (code: string, targets: string[] = ['chrome 38', 'safari 7']) => {
  const result = await transformAsync(code, {
    babelrc: false,
    configFile: false,
    filename: 'app.js',
    presets: [],
    plugins: [[spacklePlugin, { method: 'usage-global', targets }]],
  });
  return result?.code ?? '';
};

describe('spackle provider (usage-global)', () => {
  it('detects a bare instance method call with no explicit import', async () => {
    const code = await runUsage('[1, [2, 3]].flat();');
    expect(code).toContain('@shim-works/spackle/modules/es.array.flat');
  });

  it('detects a static method call', async () => {
    const code = await runUsage('Object.fromEntries([["a", 1]]);');
    expect(code).toContain('@shim-works/spackle/modules/es.object.from-entries');
  });

  it('does not inject for a target that already supports the feature natively', async () => {
    const code = await runUsage('[1, [2, 3]].flat();', ['chrome 130']);
    expect(code).not.toContain('@shim-works/spackle/modules/es.array.flat');
  });

  it('detects for-of / spread as needing iterator support', async () => {
    const forOf = await runUsage('for (const x of [1,2,3]) { x; }');
    expect(forOf).toContain('@shim-works/spackle/modules/es.array.iterator');
    const spread = await runUsage('const a = [...[1,2,3]];');
    expect(spread).toContain('@shim-works/spackle/modules/es.array.iterator');
  });

  it('detects an async function as needing Promise', async () => {
    const code = await runUsage('async function f() { return 1; }');
    expect(code).toContain('@shim-works/spackle/modules/es.promise');
  });

  it('silently skips a resolved dependency that has not been ported (no crash, no injection)', async () => {
    // Reflect.metadata resolves to esnext.reflect.metadata via the vendored
    // built-in-definitions table -- a real core-js-compat id, but spackle
    // has no esnext ids at all. Confirms an unported-but-resolved dependency
    // is skipped cleanly, same "gap" behavior as entry-global.
    const code = await runUsage('Reflect.metadata("key", "value");');
    expect(code).not.toContain('@shim-works/spackle/modules/esnext.reflect.metadata');
  });

  it('injects nothing for code that needs no polyfills', async () => {
    const code = await runUsage('const x = 1 + 2;');
    expect(code).not.toContain('@shim-works/spackle/modules/');
  });
});
