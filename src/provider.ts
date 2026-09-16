import definePolyfillProvider from '@babel/helper-define-polyfill-provider';
import { moduleRegistry, isRegisteredModule, spackleModuleSpecifier } from './module-registry.js';
import { BuiltIns, StaticProperties, InstanceProperties, CommonIterators, PromiseDependencies, PromiseDependenciesWithIterators, DecoratorMetadataDependencies } from './built-in-definitions.js';
import { canSkipPolyfill } from './usage-filters.js';
// core-js-compat's compat DATA only (browser support matrix) — not core-js's
// polyfill code. Same distinction polyfill-gap-finder relies on: this is just
// "which version of which browser supports this spec feature natively."
// Plain import (via tsconfig's resolveJsonModule): tsup.config.ts marks
// core-js-compat as noExternal specifically so esbuild fully inlines this
// data as a plain object literal into BOTH the CJS and ESM output, rather
// than leaving a runtime require/import that behaves inconsistently between
// formats (CJS's require() handles .json natively; Node's strict ESM loader
// requires a "type: json" import attribute that esbuild doesn't reliably
// preserve in its own output).
import compatData from 'core-js-compat/data.json';

export const ENTRY_SOURCES = new Set(['@shim-works/spackle', '@shim-works/spackle/stable']);

// Same disambiguation heuristic as babel-plugin-polyfill-corejs3: an
// instance method resolved against one of these namespaces (e.g. `.entries`
// could be Array's, an iterator's, or DOM-collections') gets narrowed to the
// dep whose module id actually mentions the receiver's own name, when we
// have one to check against (a typed `foo.flat()` call knows `foo`'s
// static-ish name; a bare untyped `.flat()` doesn't, and stays unnarrowed).
const uniqueObjects = ['array', 'string', 'iterator', 'async-iterator', 'dom-collections'].map(
  (v) => new RegExp(`[a-z]*\\.${v}\\..*`),
);

export default definePolyfillProvider(({ shouldInjectPolyfill, debug, createMetaResolver, babel, getUtils, method }: any) => {
  const resolve = createMetaResolver({
    global: BuiltIns,
    static: StaticProperties,
    instance: InstanceProperties,
  });

  const isWebpack = babel.caller((caller: any) => caller?.name === 'babel-loader');

  const maybeInjectGlobal = (names: string[], utils: any) => {
    for (const name of names) {
      // Same filterPolyfills gate as entry-global: only modules spackle has
      // actually ported are ever injected. Anything else -- a real core-js
      // module id that resolve() correctly found, just not yet ported here
      // -- is silently skipped, same "gap" concept as everywhere else in
      // this project. No esnext fallback (unlike corejs3): spackle's
      // registry has no esnext ids at all, so there's nothing to fall back to.
      if (isRegisteredModule(name) && shouldInjectPolyfill(name)) {
        debug(name);
        utils.injectGlobalImport(spackleModuleSpecifier(name), name);
      }
    }
  };

  return {
    name: 'spackle',
    polyfills: compatData,
    filterPolyfills(name: string) {
      // Only ever offer modules spackle has actually ported — everything
      // else falls through untouched, same "gap" concept polyfill-gap-finder
      // reports on.
      return isRegisteredModule(name);
    },
    entryGlobal(meta: { kind: string; source: string }, utils: any, path: any) {
      if (meta.kind !== 'import') return;
      if (!ENTRY_SOURCES.has(meta.source)) return;

      for (const name of Object.keys(moduleRegistry)) {
        if (isRegisteredModule(name) && shouldInjectPolyfill(name)) {
          debug(name);
          utils.injectGlobalImport(spackleModuleSpecifier(name), name);
        }
      }
      path.remove();
    },
    usageGlobal(meta: any, utils: any, path: any) {
      const resolved = resolve(meta);
      if (!resolved) return;
      if (canSkipPolyfill(resolved.desc, path)) return;

      let deps: string[] = resolved.desc.global;
      if (resolved.kind !== 'global' && 'object' in meta && meta.object && meta.placement === 'prototype') {
        const low = meta.object.toLowerCase();
        deps = deps.filter((m) => (uniqueObjects.some((v) => v.test(m)) ? m.includes(low) : true));
      }
      maybeInjectGlobal(deps, utils);
      return true;
    },
    // method: 'usage-global' only -- syntax-triggered dependencies that
    // don't show up as a plain global/static/instance reference at all:
    // for-of/spread (iterator protocol), async functions/dynamic import
    // (Promise), decorators (Reflect metadata). Guarded so this doesn't
    // also fire during entry-global transforms, which should only look at
    // the explicit "spackle/stable" import, not scan the whole file.
    visitor: method === 'usage-global' && {
      CallExpression(path: any) {
        if (path.get('callee').isImport()) {
          maybeInjectGlobal(isWebpack ? PromiseDependenciesWithIterators : PromiseDependencies, getUtils(path));
        }
      },
      Function(path: any) {
        if (path.node.async) {
          maybeInjectGlobal(PromiseDependencies, getUtils(path));
        }
      },
      'ForOfStatement|ArrayPattern'(path: any) {
        maybeInjectGlobal(CommonIterators, getUtils(path));
      },
      SpreadElement(path: any) {
        if (!path.parentPath.isObjectExpression()) {
          maybeInjectGlobal(CommonIterators, getUtils(path));
        }
      },
      YieldExpression(path: any) {
        if (path.node.delegate) {
          maybeInjectGlobal(CommonIterators, getUtils(path));
        }
      },
      Class(path: any) {
        const hasDecorators =
          path.node.decorators?.length || path.node.body.body.some((el: any) => el.decorators?.length);
        if (hasDecorators) {
          maybeInjectGlobal(DecoratorMetadataDependencies, getUtils(path));
        }
      },
    },
  };
});
