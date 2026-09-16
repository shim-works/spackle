import { moduleRegistry, spackleModuleSpecifier, type SpackleModuleId } from './module-registry.js';

/**
 * Runtime, no-Babel install: checks every ported module's own isSupported()
 * at call time and patches whatever the browser executing this is actually
 * missing — same isXSupported paradigm the prior implementation's own
 * mountLanguagePolyfills/mountBrowserPolyfills/installPolyfills use, just
 * covering spackle's own ported set instead.
 *
 * Deliberately async, via a dynamic import() inside the function body: ES
 * modules run their full top-level code the instant they're first
 * imported, with no way to "import the pieces without the side effect" —
 * so a genuinely deferred, call-time-triggered install (nothing happens
 * until you call this) requires import() here rather than a static import
 * at the top of this file.
 *
 * Each module is imported (and installed) independently, not as one static
 * import of stable.ts: a static-import graph evaluates atomically, so a
 * single module throwing at evaluation time would abort every module after
 * it in the list. Importing + catching per module means one bad module
 * can't take the rest down with it.
 *
 * Imported via the public "@shim-works/spackle/modules/<id>" specifier (self-referencing
 * this package by its own name, same specifier Babel injection already
 * uses), not a relative path: a relative dynamic import with a runtime-built
 * path doesn't survive tsup's build, since each module is built as its own
 * separate entry rather than part of this file's static dependency graph --
 * esbuild's dynamic-glob-import bundling can't see across that boundary.
 * The public specifier is resolved for real at runtime via this package's
 * own package.json "exports" map instead, which works correctly.
 */
export const installPolyfills = async (): Promise<void> => {
  for (const id of Object.keys(moduleRegistry) as SpackleModuleId[]) {
    try {
      await import(spackleModuleSpecifier(id));
    } catch (err) {
      console.warn(`[spackle] failed to install ${id}:`, err);
    }
  }
};
