import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/stable.ts', 'src/modules/*.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  // Force core-js-compat/data.json to be fully bundled (inlined as a plain
  // object literal) rather than left as an external runtime import/require
  // in either output format. Without this, esbuild inlines it for CJS
  // (require() of .json just works there) but leaves a genuine ESM `import`
  // for the .mjs build that Node's strict ESM loader then rejects without a
  // "type: json" import attribute -- which esbuild also doesn't reliably
  // preserve in its output. Inlining sidesteps needing any of that.
  noExternal: ['core-js-compat'],
});
