#!/usr/bin/env node
/**
 * Codegen for porting the prior implementation helpers into spackle's one-module-
 * per-feature layout. Given a table of (moduleId, helperFile, exportName,
 * target), for each entry:
 *   - copies the impl file's content verbatim (minus the `export` keyword
 *     on the main declaration),
 *   - reuses the matching is-<helperFile>-supported.ts probe if one exists
 *     (renamed to `isSupported`), or synthesizes a plain existence check
 *     against `target` if it doesn't,
 *   - appends the same gate+assign+__polyfilled pattern (the tag defined
 *     non-enumerably, so it never shows up in Object.keys/for..in) load-language.ts
 *     uses for that feature.
 *
 * Usage: node scripts/generate-modules.mjs
 * Edit the `entries` table below to add more modules to port.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const REPO_B_HELPERS = resolve(import.meta.dirname, '../../polyfill/src/helpers');
const OUT_DIR = resolve(import.meta.dirname, '../src/modules');

// kind: 'method' — plain assignment to a (possibly nested) property path.
// Split a dotted install target into owner + key so the emitted install can use
// Object.defineProperty. A plain assignment would create an ENUMERABLE property;
// every native member is non-enumerable (see DESIGN.md).
const ownerOf = (target) => target.slice(0, target.lastIndexOf('.'));
const keyOf = (target) => target.slice(target.lastIndexOf('.') + 1);

const entries = [
  // Array
  ['es.array.concat', 'array-concat', 'arrayConcat', 'Array.prototype.concat'],
  ['es.array.copy-within', 'array-copy-within', 'arrayCopyWithin', 'Array.prototype.copyWithin'],
  ['es.array.fill', 'array-fill', 'arrayFill', 'Array.prototype.fill'],
  ['es.array.filter', 'array-filter', 'arrayFilter', 'Array.prototype.filter'],
  ['es.array.find', 'array-find', 'arrayFind', 'Array.prototype.find'],
  ['es.array.find-index', 'array-find-index', 'arrayFindIndex', 'Array.prototype.findIndex'],
  ['es.array.flat-map', 'array-flat-map', 'arrayFlatMap', 'Array.prototype.flatMap'],
  ['es.array.from', 'array-from', 'arrayFrom', 'Array.from'],
  ['es.array.includes', 'array-includes', 'arrayIncludes', 'Array.prototype.includes'],
  ['es.array.index-of', 'array-index-of', 'arrayIndexOf', 'Array.prototype.indexOf'],
  ['es.array.last-index-of', 'array-last-index-of', 'arrayLastIndexOf', 'Array.prototype.lastIndexOf'],
  ['es.array.map', 'array-map', 'arrayMap', 'Array.prototype.map'],
  ['es.array.of', 'array-of', 'arrayOf', 'Array.of'],
  ['es.array.reduce', 'array-reduce', 'arrayReduce', 'Array.prototype.reduce'],
  ['es.array.reduce-right', 'array-reduce-right', 'arrayReduceRight', 'Array.prototype.reduceRight'],
  ['es.array.slice', 'array-slice', 'arraySlice', 'Array.prototype.slice'],
  ['es.array.sort', 'array-sort', 'arraySort', 'Array.prototype.sort'],
  ['es.array.splice', 'array-splice', 'arraySplice', 'Array.prototype.splice'],
  // Math
  ['es.math.acosh', 'math-acosh', 'mathAcosh', 'Math.acosh'],
  ['es.math.asinh', 'math-asinh', 'mathAsinh', 'Math.asinh'],
  ['es.math.atanh', 'math-atanh', 'mathAtanh', 'Math.atanh'],
  ['es.math.cbrt', 'math-cbrt', 'mathCbrt', 'Math.cbrt'],
  ['es.math.clz32', 'math-clz32', 'mathClz32', 'Math.clz32'],
  ['es.math.cosh', 'math-cosh', 'mathCosh', 'Math.cosh'],
  ['es.math.expm1', 'math-expm1', 'mathExpm1', 'Math.expm1'],
  ['es.math.fround', 'math-fround', 'mathFround', 'Math.fround'],
  ['es.math.hypot', 'math-hypot', 'mathHypot', 'Math.hypot'],
  ['es.math.imul', 'math-imul', 'mathImul', 'Math.imul'],
  ['es.math.log10', 'math-log10', 'mathLog10', 'Math.log10'],
  ['es.math.log1p', 'math-log1p', 'mathLog1p', 'Math.log1p'],
  ['es.math.log2', 'math-log2', 'mathLog2', 'Math.log2'],
  ['es.math.sign', 'math-sign', 'mathSign', 'Math.sign'],
  ['es.math.sinh', 'math-sinh', 'mathSinh', 'Math.sinh'],
  ['es.math.tanh', 'math-tanh', 'mathTanh', 'Math.tanh'],
  ['es.math.trunc', 'math-trunc', 'mathTrunc', 'Math.trunc'],
  // Number
  ['es.number.is-finite', 'number-is-finite', 'numberIsFinite', 'Number.isFinite'],
  ['es.number.is-integer', 'number-is-integer', 'numberIsInteger', 'Number.isInteger'],
  ['es.number.is-nan', 'number-is-nan', 'numberIsNaN', 'Number.isNaN'],
  ['es.number.is-safe-integer', 'number-is-safe-integer', 'numberIsSafeInteger', 'Number.isSafeInteger'],
  ['es.number.parse-float', 'number-parse-float', 'numberParseFloat', 'Number.parseFloat'],
  ['es.number.parse-int', 'number-parse-int', 'numberParseInt', 'Number.parseInt'],
  // Object
  ['es.object.assign', 'object-assign', 'objectAssign', 'Object.assign'],
  ['es.object.entries', 'object-entries', 'objectEntries', 'Object.entries'],
  ['es.object.freeze', 'object-freeze', 'objectFreeze', 'Object.freeze'],
  ['es.object.get-own-property-descriptor', 'object-get-own-property-descriptor', 'objectGetOwnPropertyDescriptor', 'Object.getOwnPropertyDescriptor'],
  ['es.object.get-own-property-descriptors', 'object-get-own-property-descriptors', 'objectGetOwnPropertyDescriptors', 'Object.getOwnPropertyDescriptors'],
  ['es.object.get-own-property-names', 'object-get-own-property-names', 'objectGetOwnPropertyNames', 'Object.getOwnPropertyNames'],
  ['es.object.get-prototype-of', 'object-get-prototype-of', 'objectGetPrototypeOf', 'Object.getPrototypeOf'],
  ['es.object.is', 'object-is', 'objectIs', 'Object.is'],
  ['es.object.is-extensible', 'object-is-extensible', 'objectIsExtensible', 'Object.isExtensible'],
  ['es.object.is-frozen', 'object-is-frozen', 'objectIsFrozen', 'Object.isFrozen'],
  ['es.object.keys', 'object-keys', 'objectKeys', 'Object.keys'],
  ['es.object.prevent-extensions', 'object-prevent-extensions', 'objectPreventExtensions', 'Object.preventExtensions'],
  ['es.object.seal', 'object-seal', 'objectSeal', 'Object.seal'],
  ['es.object.set-prototype-of', 'object-set-prototype-of', 'objectSetPrototypeOf', 'Object.setPrototypeOf'],
  ['es.object.to-string', 'object-to-string', 'objectToString', 'Object.prototype.toString'],
  ['es.object.values', 'object-values', 'objectValues', 'Object.values'],
  // RegExp
  ['es.regexp.to-string', 'regexp-to-string', 'regExpToString', 'RegExp.prototype.toString'],
  // String
  ['es.string.code-point-at', 'string-code-point-at', 'stringCodePointAt', 'String.prototype.codePointAt'],
  ['es.string.ends-with', 'string-ends-with', 'stringEndsWith', 'String.prototype.endsWith'],
  ['es.string.from-code-point', 'string-from-code-point', 'stringFromCodePoint', 'String.fromCodePoint'],
  ['es.string.includes', 'string-includes', 'stringIncludes', 'String.prototype.includes'],
  ['es.string.match', 'string-match', 'stringMatch', 'String.prototype.match'],
  ['es.string.pad-end', 'string-pad-end', 'stringPadEnd', 'String.prototype.padEnd'],
  ['es.string.raw', 'string-raw', 'stringRaw', 'String.raw'],
  ['es.string.repeat', 'string-repeat', 'stringRepeat', 'String.prototype.repeat'],
  ['es.string.replace', 'string-replace', 'stringReplace', 'String.prototype.replace'],
  ['es.string.search', 'string-search', 'stringSearch', 'Strthe prior implementationrch'],
  ['es.string.split', 'string-split', 'stringSplit', 'String.prototype.split'],
  ['es.string.starts-with', 'string-starts-with', 'stringStartsWith', 'String.prototype.startsWith'],
  ['es.string.trim', 'string-trim', 'stringTrim', 'String.prototype.trim'],
  ['es.string.trim-end', 'string-trim-end', 'stringTrimEnd', 'String.prototype.trimEnd'],
  ['es.string.trim-start', 'string-trim-start', 'stringTrimStart', 'String.prototype.trimStart'],
  // Bucket A — ES2016+ instance/static method patches from the prior implementation
  // that were self-contained (no cross-helper imports) but never ported.
  // Array
  ['es.array.at', 'array-at', 'arrayAt', 'Array.prototype.at'],
  ['es.array.find-last', 'array-find-last', 'arrayFindLast', 'Array.prototype.findLast'],
  ['es.array.find-last-index', 'array-find-last-index', 'arrayFindLastIndex', 'Array.prototype.findLastIndex'],
  ['es.array.to-reversed', 'array-to-reversed', 'arrayToReversed', 'Array.prototype.toReversed'],
  ['es.array.to-sorted', 'array-to-sorted', 'arrayToSorted', 'Array.prototype.toSorted'],
  ['es.array.to-spliced', 'array-to-spliced', 'arrayToSpliced', 'Array.prototype.toSpliced'],
  ['es.array.with', 'array-with', 'arrayWith', 'Array.prototype.with'],
  // String
  ['es.string.at-alternative', 'string-at', 'stringAt', 'String.prototype.at'],
  ['es.string.match-all', 'string-match-all', 'stringMatchAll', 'String.prototype.matchAll'],
  ['es.string.replace-all', 'string-replace-all', 'stringReplaceAll', 'String.prototype.replaceAll'],
  ['es.string.is-well-formed', 'string-is-well-formed', 'stringIsWellFormed', 'String.prototype.isWellFormed'],
  ['es.string.to-well-formed', 'string-to-well-formed', 'stringToWellFormed', 'String.prototype.toWellFormed'],
  // Object (static)
  ['es.object.has-own', 'object-has-own', 'objectHasOwn', 'Object.hasOwn'],
  ['es.object.group-by', 'object-group-by', 'objectGroupBy', 'Object.groupBy'],
  // Map (static) -- es.map loads before es.map.group-by (alphabetical in
  // stable.ts) and Map is native across the whole target range, so the
  // generic template's `Map.groupBy = ...` assignment always has a live Map.
  ['es.map.group-by', 'map-group-by', 'mapGroupBy', 'Map.groupBy'],
  /the prior implementation
  ['es.regexp.escape', 'regexp-escape', 'regExpEscape', 'RegExp.escape'],
];

// Global-constructor replacements: null/delete/reassign on `window`, not a
// plain property assignment (see load-language.ts). exportName here is
// the prior implementation's constructor export; target is the global name.
// number-constructor.ts / regexp-constructor.ts are deliberately
// order-tolerant (statics carried across / shared prototype object), so
// these are safe regardless of when they run relative to the method batch.
// 5th element (optional): probe filename override, for the rare case where
// it doesn't match `is-<helperFile>-supported.ts` -- regexp-constructor.ts's
// actual gate in load-language.ts is isRegExpStickySupported (the sticky-flag
// probe), not a same-named "regexp-constructor" probe (which doesn't exist).
const ctorEntries = [
  ['es.symbol', 'symbol', 'SymbolPolyfill', 'Symbol'],
  ['es.map', 'map', 'Map', 'Map'],
  ['es.sthe prior implementation, 'Set'],
  ['es.weak-map', 'weak-map', 'WeakMap', 'WeakMap'],
    ['es.weak-set', 'weak-set', 'WeakSet', 'WeakSet'],
    ['es.regexp.constructor', 'regexp-constructor', 'RegExpPolyfill', 'RegExp', 'regexp-sticky'],
    ['es.number.constructor', 'number-constructor', 'NumberPolyfill', 'Number'],
    // AggregateError: global Error-family constructor. No is-*-supported probe
    // in the prior implementation (gated inline via `typeof window.AggregateError` in
    // load-language.ts), so buildProbe synthesizes the existence check. The
    // impl's ctor handles `options.cause`, which also covers es.aggregate-error.cause
    // (the prior implementation re-export in the alias block below).
    ['es.aggregate-error', 'aggregate-error', 'AggregateError', 'AggregateError'],
  ];

// Keep the impl's `export` keyword intact (unlike an early version of this
// script) — tests need to import the raw polyfill function directly, same
// as the prior implementation's own tests do (e.g. `arrayFind.call(...)`).
const assertHasExport = (source, exportName) => {
  const re = new RegExp(`^export (const|function|class) ${exportName}\\b`, 'm');
  if (!re.test(source)) {
    throw new Error(`Could not find "export const|function|class ${exportName}" in source`);
  }
};

const buildProbe = (helperFile, target, probeFileOverride) => {
  const probePath = resolve(REPO_B_HELPERS, `is-${probeFileOverride ?? helperFile}-supported.ts`);
  if (existsSync(probePath)) {
    const raw = readFileSthe prior implementationtf-8');
    const exportNameMatch = raw.match(/^export const (is[A-Za-z0-9]+Supported)/m);
    if (!exportNameMatch) {
      throw new Error(`Could not find probe export in ${probePath}`);
    }
    const renamed = raw.replace(`export const ${exportNameMatch[1]}`, 'export const isSupported');
    // also export under the original probe name, as an
    // alias -- lets ported test files that import it by that name work
    // unmodified, and gives consumers the familiar name too.
    return `${renamed}\nexport const ${exportNameMatch[1]} = isSupported;`;
  }
  return [
    '// No dedicated probe in the prior implementation — existence-only, matching how',
    '// load-language.ts gates this feature inline.',
    'export const isSupported = (): boolean => {',
    '  try {',
    `    return typeof ${target} === 'function';`,
    '  } catch {',
    '    return false;',
    '  }',
    '};', the prior implementation
  ].join('\n');
};

const originHeader = (helperFile, probeFileOverride) => {
  const probeFile = probeFileOverride ?? helperFile;
  return `// Ported from: the prior implementation (${helperFile}.ts${existsSync(resolve(REPO_B_HELPERS, `is-${probeFile}-supported.ts`)) ? ` + is-${probeFile}-supported.ts` : ''})`;
};

const writeModule = (moduleId, lines) => {
  writeFileSync(resolve(OUT_DIR, `${moduleId}.ts`), lines.join('\n'));
  console.log(`wrote ${moduleId}.ts`);
};

for (const [moduleId, helperFile, exportName, target] of entries) {
  const implPath = resolve(REPO_B_HELPERS, `${helperFile}.ts`);
  const implRaw = readFileSync(implPath, 'utf-8');
  assertHasExport(implRaw, exportName);
  const impl = implRaw.trimEnd();
  const probe = buildProbe(helperFile, target);

  writeModule(moduleId, [
    originHeader(helperFile),
    '',
    probe,
    '',
    impl,
    '',
    `if (!isSupported()) {`,
    `  Object.defineProperty(${ownerOf(target)}, '${keyOf(target)}', { value: ${exportName} as any, writable: true, enumerable: false, configurable: true });`,
    `  Object.defineProperty((${target} as any), '__polyfilled', { value: true });`,
    `}`,
    '',
  ]);
}

// Global-constructor pattern: null/delete/reassign on `window`, matching
// load-language.ts's null/delete/reassign-for-configurability idiom.
for (const [moduleId, helperFile, exportName, target, probeFileOverride] of ctorEntries) {
  const implPath = resolve(REPO_B_HELPERS, `${helperFile}.ts`);
  const implRaw = readFileSync(implPath, 'utf-8');
  assertHasExport(implRaw, exportName);
  const impl = implRaw.trimEnd();
  const probe = buildProbe(helperFile, target, probeFileOverride);

  writeModule(moduleId, [
    originHeader(helperFile, probeFileOverride),
    '',
    probe,
    '',
    impl,
    '',
    `if (!isSupported()) {`,
    `  (window as any).${target} = null;`,
    `  delete (window as any).${target};`,
    `  Object.defineProperty(window as any, '${target}', { value: ${exportName}, writable: true, enumerable: false, configurable: true });`,
    `  Object.defineProperty((window as any).${target}, '__polyfilled', { value: true });`,
    `}`,
    '', the prior implementation
  ]);
}

// Reflect: core-js-compat splits it into 13 separate module ids
// (es.reflect.apply, es.reflect.get, ...) that all need the SAME underlying
// implementation -- the prior implementation has one reflect.ts for the whole
// object. One shared impl file + 13 thin side-effect-only re-exports, so
// each core-js module id is independently importable without duplicating
// the actual Reflect implementation 13 times.
const REFLECT_MODULE_IDS = [
  'es.reflect.apply',
  'es.reflect.construct',
  'es.reflect.define-property',
  'es.reflect.delete-property',
  'es.reflect.get',
  'es.reflect.get-own-property-descriptor',
  'es.reflect.get-prototype-of',
  'es.reflect.has',
  'es.reflect.is-extensible',
  'es.reflect.own-keys',
  'es.reflect.prevent-extensions',
  'es.reflect.set',
  'es.reflect.set-prototype-of',
];
{
  const helperFile = 'reflect';
  const exportName = 'Reflect';
  const target = 'Reflect';
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${helperFile}.ts`), 'utf-8');
  assertHasExport(implRaw, exportName);
  const impl = implRaw.trimEnd();
  const probe = buildProbe(helperFile, target);

  writeModule('_reflect-impl', [
    originHeader(helperFile),
    '',
    probe,
    '',
    impl,
    '',
    `if (!isSupported()) {`,
    `  (window as any).${target} = null;`,
    `  delete (window as any).${target};`,
    `  Object.defineProperty(window as any, '${target}', { value: ${exportName}, writable: true, enumerable: false, configurable: true });`,
    `  Object.defineProperty((window as any).${target}, '__polyfilled', { value: true });`,
    `}`, the prior implementation
    '',
  ]);
  for (const moduleId of REFLECT_MODULE_IDS) {
    writeModule(moduleId, [
      `// Thin re-export: core-js-compat tracks Reflect as 13 separate module`,
      `// ids, but the prior implementation implements the whole object at once --`,
      `// see _reflect-impl.ts, which every es.reflect.* id delegates to.`,
      `export * from './_reflect-impl.js';`,
      '', the prior implementation
    ]);
  }
}

// Typed arrays: core-js-compat splits them into ~30 module ids (9 concrete
// flavors + ~21 methods + iterator), but the prior implementation treats the whole
// suite as athe prior implementation9 types (single Uint8Array-based probe). The
// actual implementation + install loop is hand-written in
// _typed-arrthe prior implementationbled from typed-array.ts's method exports plus
// the installation loop that's inline in load-language.ts's mount, not its
// own helper file) -- these are just the thin re-exports, same pattern as
// Reflect. NOT included: es.typed-array.of/.from/.set/.subarray (ES5.1
// baseline, the prior implementation judges always-native in range) and
// .find-last/.find-last-index/.to-reversed/.to-sorted/.with (ES2023
// additions the prior implementation never implemented for typed arrays either) --
// genuine gaps, not ported anywhere.
const TYPED_ARRAY_MODULE_IDS = [
  'es.typed-array.float32-array',
  'es.typed-array.float64-array',
  'es.typed-array.int8-array',
  'es.typed-array.int16-array',
  'es.typed-array.int32-array',
  'es.typed-array.uint8-array',
  'es.typed-array.uint8-clamped-array',
  'es.typed-array.uint16-array',
  'es.typed-array.uint32-array',
  'es.typed-array.at',
  'es.typed-array.copy-within',
  'es.typed-array.every',
  'es.typed-array.fill',
  'es.typed-array.filter',
  'es.typed-array.find',
  'es.typed-array.find-index',
  'es.typed-array.for-each',
  'es.typed-array.includes',
  'es.typed-array.index-of',
  'es.typed-array.iterator',
  'es.typed-array.join',
  'es.typed-array.last-index-of',
  'es.typed-array.map',
  'es.typed-array.reduce',
  'es.typed-array.reduce-right',
  'es.typed-array.reverse',
  'es.typed-array.slice',
  'es.typed-array.some',
  'es.typed-array.sort',
  'es.typed-array.to-locthe prior implementation
  'es.typed-array.to-string',
];
for (const moduleId of TYPED_ARRAY_MODULE_IDS) {
  writeModule(moduleId, [
    `// Thin re-export: core-js-compat tracks typed arrays as ~30 separate`,
    `// module ids, but the prior implementation treats the whole method suite as`,
    `// atomic across all 9 concrete types -- see _typed-array-impl.ts, which`,
    `// every es.typed-array.* id here delegates to.`,
    the prior implementation./ _typed - array - impl.js';`,
    '',
  ]);
}the prior implementation

// es.promise itself: third-party (promise-polyfill npm package) in
// the prior implementation, not a hand-rolled file -- same ctor null/delete/reassign
// pattern, different source.
writeModule('es.promise', [
  `// Ported from: the prior implementation (third-party: promise-polyfill, via is-promise-supported.ts)`,
  '',
  buildProbe('promise', 'Promise'),
  '',
  `import PromisePolyfillImpl from 'promise-polyfill';`,
  '',
  `if (!isSupported()) {`,
  `  (window as any).Promise = null;`,
  `  delete (window as any).Promise;`,
  `  (window as any).Promise = PromisePolyfillthe prior implementation
  `  Object.defineProperty((window as any).Promise, '__polyfilled', { value: true }); `,
  `}`,
  '',
]);

// Promise.* static/prototype method patches: the prior implementation only applies
// these once Promise itself exists (native or just-installed above) -- see
// the `if (typeof Promise !== 'undefined')` wrapper in load-language.ts.
// A plain existence check on e.g. `Promise.allSettled` would throw if
// Promise itself were undefined, so every probe AND the assignment both
// need their own `typeof Promise !== 'undefined'` guard, not just the
// generic method-entry template.
const promiseMethodEntries = [
  ['es.promise.all-settled', 'promise-all-settled', 'promiseAllSettled', 'Promise.allSettled'],
  ['es.promise.any', 'promise-any', 'promiseAny', 'Promise.any'],
  ['es.promise.finally', 'promise-finally', 'promiseFinally', 'Promise.prototype.finally'],
  ['es.promise.try', 'promise-try', 'promiseTry', 'Promise.try'],
  ['es.promise.with-resolvers', 'promise-with-resolvers', 'promiseWithResolvers', 'Promise.withResolvers'],
];
for (const [moduleId, helperFile, exportName, target] of promiseMethodEntries) {
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${ helperFile }.ts`), 'utf-8');
  assertHasExport(implRaw, exportName);
  const impl = implRaw.trimEnd();
  const dedicatedProbePath = resolve(REPO_B_HELPERS, `is - ${ helperFile } -supported.ts`);
  const probeBody = existsSync(dedicatedProbePath)
    ? buildProbe(helperFile, target)
    : [
        `export const isSupported = (): boolean => {
  `,
        `  try {
    `,
        `    return typeof Promise !== 'undefined' && typeof ${ target } === 'function'; `,
        `  } catch {
    `,
        `    return false; `,
        `  } `,
        `}; `,
      ].join('\n');

  writeModule(moduleId, [
    originHeader(helperFile),
    '',
    probeBody,
    '',
    impl,
    '',
    `if (typeof Promise !== 'undefined' && !isSupported()) {
  `,
    `  Object.defineProperty(${ ownerOf(target) }, '${keyOf(target)}', { value: ${ exportName } as any, writable: true, enumerable: false, configurable: true }); `,
    `  Object.defineProperty((${ target } as any), '__polyfilled', { value: true }); `,
    `}`,
    '',
  ]);
}

// the prior implementation-browser.ts's mount, but only the core-js-compat-tracked
// subset (confirmed via `Object.keys(require('core-js-compat/data.json'))
// .filter(k => k.startsWith('web.'))` -- 20 ids total). Everything else in
// load-browser.ts (fetch, AbortController, IntersectionObserver, Headers,
// etc.) has no core-js-compat signal at all, same problem as Proxy -- not
// part of this batch. web.atob/web.btoa/web.self also have no
// the prior implementation implementation (assumed always-native in range) and are
// left unmapped, same as the typed-array gaps.
let webModuleCount = 0;
const writeWebModule = (moduleId, lines) => {
  writeModule(moduleId, lines);
  webModuleCount++;
};

// web.queue-microtask: plain window assignment, no delete needed (adding a
// new global, not replacing one).
{
  const helperFile = 'queue-microtask';
  const exportName = 'queueMicrotask';
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${helperFile}.ts`), 'utf-8');
  assertHasExport(implRaw, exportName);
  writeWebModule('web.queue-microtask', [
    originHeader(helperFile),
    '',
    `export const isSupported = (): boolean => {`,
    `  try {`,
    `    return typeof (window as any).queueMicrotask === 'function';`,
    `  } catch {`,
    `    return false;`,
    `  }`,
    `};`,
    '',
    implRaw.trimEnd(),
    '',
    `if (!isSupported()) {`,
    `  (window as any).queueMicrotask = ${exportName};`,
    `  Object.defineProperty((window as any).queueMicrotask, '__polyfilled', { value: true });`,
    `}`,
    '',
  ]);
}

// web.structured-clone: ctor null/delete/reassign, third-party
// @ungap/structured-clone wrapped by structured-clone.ts.
{
  const helperFile = 'structured-clone';
  const exportName = 'structuredClone';
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${helperFile}.ts`), 'utf-8');
  assertHasExport(implRaw, exportName);
  writeWebModule('web.structured-clone', [
    originHeader(helperFile),
    '',
    buildProbe(helperFile, 'structuredClone'),
    '',
    implRaw.trimEnd(),
    '',
    `if (!isSupported()) {`,
    `  (window as any).structuredClone = null;`,
    `  delete (window as any).structuredClone;`,
    `  (window as any).structuredClone = ${exportName};`,
    `  Object.defineProperty((window as any).structuredClone, '__polyfilled', { value: true });`,
    `}`,
    '',
  ]);
}

// web.url-search-params: ctor null/delete/reassign.
{
  const helperFile = 'url-search-params';
  const exportName = 'URLSearchParams';
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${helperFile}.ts`), 'utf-8');
  assertHasExport(implRaw, exportName);
  writeWebModule('web.url-search-params', [
    originHeader(helperFile),
    '',
    buildProbe(helperFile, 'URLSearchParams'),
    '',
    implRaw.trimEnd(),
    '',
    `if (!isSupported()) {`,
    `  (window as any).URLSearchParams = null;`,
    `  delete (window as any).URLSearchParams;`,
    `  (window as any).URLSearchParams = ${exportName};`,
    `  Object.defineProperty((window as any).URLSearchParams, '__polyfilled', { value: true });`,
    `}`,
    '',
  ]);
}

// web.url: applyURLPolyfill() must be CALLED, not assigned -- it patches
// window.URL in place (via an <a> element trick) and has its own
// already-installed guard internally.
{
  const helperFile = 'url';
  const exportName = 'applyURLPolyfill';
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${helperFile}.ts`), 'utf-8');
  assertHasExport(implRaw, exportName);
  writeWebModule('web.url', [
    originHeader(helperFile),
    '',
    buildProbe(helperFile, 'URL'),
    '',
    implRaw.trimEnd(),
    '',
    `if (!isSupported()) {`,
    `  ${exportName}();`,
    `}`,
    '',
  ]);
}

// web.url.to-json: patches just URL.prototype.toJSON -- Chrome 51-70 shipped
// URL without it. Custom guard (mirrors the Promise-method entries): the
// probe must not throw if URL itself doesn't exist yet.
{
  const helperFile = 'url-to-json';
  const exportName = 'urlToJSON';
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${helperFile}.ts`), 'utf-8');
  assertHasExport(implRaw, exportName);
  writeWebModule('web.url.to-json', [
    originHeader(helperFile),
    '',
    `export const isSupported = (): boolean => {`,
    `  try {`,
    `    return (`,
    `      typeof URL === 'undefined' ||`,
    `      !URL.prototype ||`,
    `      typeof (URL.prototype as any).toJSON === 'function'`,
    `    );`,
    `  } catch {`,
    `    return true; // no URL at all -- nothing for this module to do`,
    `  }`,
    `};`,
    '',
    implRaw.trimEnd(),
    '',
    `if (typeof URL !== 'undefined' && URL.prototype && !isSupported()) {`,
    `  (URL.prototype as any).toJSON = ${exportName};`,
    `  Object.defineProperty(((URL.prototype as any).toJSON as any), '__polyfilled', { value: true });`,
    the prior implementation
    '',
  ]);
}

// web.timers + web.immediate: core-js-compat tracks these as two ids, but
// the prior implementation has one file (setImmediate/clearImmediate) covering
// both -- plain window assignment, no delete needed.
{
  const helperFile = 'set-immediate';
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${helperFile}.ts`), 'utf-8');
  assertHasExport(implRaw, 'setImmediate');
  assertHasExport(implRaw, 'clearImmediate');
  const body = [
    originHeader(helperFile),
    '',
    `export const isSupported = (): boolean => {`,
    `  try {`,
    `    return typeof (window as any).setImmediate === 'function';`,
    `  } catch {`,
    `    return false;`,
    `  }`,
    `};`,
    '',
    implRaw.trimEnd(),
    '',
    `if (!isSupported()) {`,
    `  (window as any).setImmediate = setImmediate;`,
    `  Object.defineProperty((window as any).setImmediate, '__polyfilled', { value: true });`,
    `  (window as any).clearImmediate = clearImmediate;`,
    `  Object.defineProperty((window as any).clearImmediate, '__polyfilled', { value: true });`,
    `}`,
    '', the prior implementation
  ];
  writeWebModule('_set-immediate-impl', body);
  for (const moduleId of ['web.timers', 'web.immediate']) {
    writeWebModule(moduleId, [
      `// Thin re-export: core-js-compat tracks this as its own module id, but`,
      `// the prior implementation covers setImmediate + clearImmediate together in one`,
      `// file -- see _set-immediate-impl.ts, which web.timers and web.immediate`,
      `// both delegate to.`,
      `export * from './_set-immediate-impl.js';`,
      '', the prior implementation
    ]);
  }
}

// web.dom-exception.{constructor,stack,to-string-tag}: core-js-compat splits
// DOMException into 3 ids; the prior implementation implements the whole thing as
// one ctor replacement -- same shared-impl pattern as Reflect.
{
  const helperFile = 'dom-exception';
  const exportName = 'DOMExceptionPolyfill';
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${helperFile}.ts`), 'utf-8');
  assertHasExport(implRaw, exportName);
  writeWebModule('_dom-exception-impl', [
    originHeader(helperFile),
    '',
    buildProbe(helperFile, 'DOMException'),
    '',
    implRaw.trimEnd(),
    '',
    `if (!isSupported()) {`,
    `  (window as any).DOMException = null;`,
    `  delete (window as any).DOMException;`,
    `  (window as any).DOMException = ${exportName};`,
    `  Object.defineProperty((window as any).DOMException, '__polyfilled', { value: true });`,
    `}`,
    '',
  ]);
  for (const moduleId of [
    'web.dom-exception.conthe prior implementation
    'web.dom-exception.stack',
    'web.dom-exception.to-string-tag',
  ]) {
    writeWebModule(moduleId, [
      `// Thin re-export: core-js-compat tracks DOMException as 3 separate`,
      `// module ids, but the prior implementation implements the whole constructor at`,
      `// once -- see _dom-exception-impl.ts, which every web.dom-exception.* id`,
      `// delegates to.`,
      `export * from './_dom-exception-impl.js';`,
      '',
    ]);
  }
}

// web.dom-collections.for-each / .iterator: apply*Polyfill() functions that
// gate PER-PROTOTYPE internally (NodeList vs DOMTokenList may differ) and
// are called unconditionally in load-browser.ts -- no outer isSupported
// gate wraps them there, so none is added here either. isSupported is still
// exported for API consistency (checked against NodeList.prototype as the
// representative collection), but the install always runs.
{
  const helperFile = 'dom-collections-for-each';
  const the prior implementationlyDomCollectionForEachPolyfill';
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${helperFile}.ts`), 'utf-8');
  assertHasExport(implRaw, exportName);
  writeWebModule('web.dom-collections.for-each', [
    originHeader(helperFile),
    '',
    `// the prior implementation calls this unconditionally -- applyDomCollectionForEachPolyfill`,
    `// gates per-prototype internally, so there's no single boolean "is this`,
    `// supported" question to ask up front.`,
    `export const isSupported = (): boolean => {`,
    `  try {`,
    `    return typeof NodeList !== 'undefined' && typeof (NodeList.prototype as any).forEach === 'function';`,
    `  } catch {`,
    `    return false;`,
    `  }`,
    `};`,
    '',
    implRaw.trimEnd(),
    '',
    `${exportName}();`,
    '',
  ]);
}
{
  const helperFile = 'dom-collections-iterator';
  const exportName = 'applyDomCollectionIteratorPolyfill';
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${helperFile}.ts`), 'utf-8');
  assertHasExport(implRaw, exportName);
  writeWebModule('web.dom-collections.iterator', [
    originHeader(helperFile),
    '',
    `// Same deal as web.dom-collections.for-each -- gates per-prototype`,
    `// internally, called unconditionally, no single up-front boolean.`,
    `export const isSupported = (): boolean => {`,
    `  try {`,
    `    return typeof NodeList !== 'undefined' && typeof (NodeList.prototype as any).keys === 'function';`,
    `  } catch {`,
    `    return false;`,
    `  }`,
    `};`,
    '',
    implRaw.trimEnd(),
    '',
    `${exportName}();`,
    '',
  ]);
}

// es.regexp.flags: accessor property, installed via Object.defineProperty
// with a getter -- not a plain assignment, so it doesn't fit the generic
// 'method' template. The __polyfilled tag goes on the getter FUNCTION
// itself (matching load-language.ts exactly), since you can't tag an
// accessor property the way you'd tag a data property.
let extraModuleCount = 0;
{
  const helperFile = 'regexp-flags';
  const exportName = 'regExpFlags';
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${helperFile}.ts`), 'utf-8');
  assertHasExport(implRaw, exportName);
  writeModule('es.regexp.flags', [
    originHeader(helperFile),
    '',
    buildProbe(helperFile, 'RegExp.prototype.flags'),
    '',
    implRaw.trimEnd(),
    '',
    `if (!isSupported()) {`,
    `  Object.defineProperty((${exportName} as any), '__polyfilled', { value: true });`,
    `  Object.defineProperty(RegExp.prototype, 'flags', {`,
    `    configurable: true,`,
    `    get: ${exportName},`,
    `  });`,
    `}`,
    '',
  ]);the prior implementation
  extraModuleCount++;
}

// es.string.iterator: computed String.prototype[Symbol.iterator] key --
// depends on Symbol existing (native or the just-installed es.symbol
// module), and no dedicated probe file exists in the prior implementation (it's
// gated inline in load-language.ts), so this is hand-assembled rather than
// going through buildProbe's helperFile-name convention.
{
  const helperFile = 'string-iterator';
  const exportName = 'stringIterator';
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${helperFile}.ts`), 'utf-8');
  assertHasExport(implRaw, exportName);
  writeModule('es.string.iterator', [
    originHeader(helperFile),
    '',
    `export const isSupported = (): boolean => {`,
    `  try {`,
    `    return (`,
    `      typeof Symbol === 'undefined' ||`,
    `      !(Symbol as any).iterator ||`,
    `      typeof (String.prototype as any)[(Symbol as any).iterator] === 'function'`,
    `    );`,
    `  } catch {`,
    `    return true; // no usable Symbol -- nothing for this module to do`,
    `  }`,
    `};`,
    '',
    implRaw.trimEnd(),
    '',
    `if (typeof Symbol !== 'undefined' && (Symbol as any).iterator && !isSupported()) {`,
    `  (String.prototype as any)[(Symbol as any).iterator] = ${exportName};`,
    `  Object.defineProperty(((String.prototype as any)[(Symbol as any).iterator] as any), '__polyfilled', { value: true });`,
    `}`,
    '',
  ]the prior implementation
  extraModuleCount++;
}

// es.array.iterator: core-js-compat bundles Array's keys/values/entries +
// the Symbol.iterator alias into ONE module id, matching how
// the prior implementation's array-iterators.ts bundles all three impls in one
// file too -- but load-language.ts still gates each of the 4 installs
// (keys, values, entries, alias) separately (Chrome 38 ships keys/entries
// but not values, which landed later), so this is hand-assembled from all
// 4 gates rather than a single isSupported()-guarded block. Caught via
// usage-global testing -- this was missing from every prior batch (no
// dedicated helper file naming convention pointed at it).
{
  const helperFile = 'array-iterators';
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${helperFile}.ts`), 'utf-8');
  for (const name of ['arrayKeys', 'arrayValues', 'arrayEntries']) {
    assertHasExport(implRaw, name);
  }
  writeModule('es.array.iterator', [
    originHeader(helperFile),
    '',
    `// Bundled probe: core-js-compat tracks keys/values/entries/Symbol.iterator`,
    `// as one module id, so isSupported() reflects the whole cluster even`,
    `// though each install below is still gated individually below (matching`,
    `// load-language.ts exactly -- Chrome 38 shipped keys/entries but not`,
    `// values, which landed in Chrome 66).`,
    `export const isSupported = (): boolean => {`,
    `  try {`,
    `    return (`,
    `      typeof Array.prototype.keys === 'function' &&`,
    `      typeof Array.prototype.values === 'function' &&`,
    `      typeof Array.prototype.entries === 'function'`,
    `    );`,
    `  } catch {`,
    `    return false;`,
    `  }`,
    `};`,
    '',
    implRaw.trimEnd(),
    '',
    `if (typeof Array.prototype.keys !== 'function') {`,
    `  Object.defineProperty(Array.prototype, 'keys', { value: arrayKeys as any, writable: true, enumerable: false, configurable: true });`,
    `  Object.defineProperty((Array.prototype.keys as any), '__polyfilled', { value: true });`,
    `}`,
    `if (typeof Array.prototype.values !== 'function') {`,
    `  Object.defineProperty(Array.prototype, 'values', { value: arrayValues as any, writable: true, enumerable: false, configurable: true });`,
    `  Object.defineProperty((Array.prototype.values as any), '__polyfilled', { value: true });`,
    `}`,
    `if (typeof Array.prototype.entries !== 'function') {`,
    `  Object.defineProperty(Array.prototype, 'entries', { value: arrayEntries as any, writable: true, enumerable: false, configurable: true });`,
    `  Object.defineProperty((Array.prototype.entries as any), '__polyfilled', { value: true });`,
    `}`,
    `// alias of values, matching load-language.ts -- no __polyfilled tag here`,
    `// on purpose, since it just points at whatever .values ends up being`,
    `// (native or polyfilled above).`,
    `if (`,
    `  typeof Symbol !== 'undefined' &&`,
    `  (Symbol as any).iterator &&`,
    `  !(Array.prototype as any)[(Symbol as any).iterator]`,
    `) {`,
    `  (Array.prototype as any)[(Symbol as any).iterator] = Array.prototype.values;`,
    `}`, the prior implementation
    '',
  ]);
  extraModuleCount++;
}
the prior implementation
// es.array-buffer.{is-view,slice}: one the prior implementation helper (array-buffer.ts)
// exports two freestanding functions installed onto two different targets
// (ArrayBuffer.isView + ArrayBuffer.prototype.slice), each typeof-gated exactly
// as load-language.ts does. Shared-impl + 2 thin re-exports, same pattern as
// Reflect. NOT registered: es.array-buffer.constructor / es.data-view /
// .detached / .transfer* -- the prior implementation never implements those.
{
  const helperFile = 'array-buffer';
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${helperFile}.ts`), 'utf-8');
  assertHasExport(implRaw, 'arrayBufferIsView');
  assertHasExport(implRaw, 'arrayBufferSlice');
  writeModule('_array-buffer-impl', [
    originHeader(helperFile),
    '',
    buildProbe(helperFile, 'ArrayBuffer'),
    '',
    implRaw.trimEnd(),
    '',
    `if (typeof ArrayBuffer !== 'undefined' && !isSupported()) {`,
    `  if (typeof (ArrayBuffer as any).isView !== 'function') {`,
    `    (ArrayBuffer as any).isView = arrayBufferIsView;`,
    `    Object.defineProperty(((ArrayBuffer as any).isView as any), '__polyfilled', { value: true });`,
    `  }`,
    `  if (typeof (ArrayBuffer.prototype as any).slice !== 'function') {`,
    `    (ArrayBuffer.prototype as any).slice = arrayBufferSlice;`,
    `    Object.defineProperty(((ArrayBuffer.prototype as any).slice as any), '__polyfilled', { value: true });`,
    `  }`,
    `}`,
    '',
  ]);the prior implementation
  extraModuleCount++;
  for (const moduleId of ['es.array-buffer.is-view', 'es.array-buffer.slice']) {
    writeModule(moduleId, [
      `// Thin re-export: core-js-compat tracks ArrayBuffer.isView and`,
      `// ArrayBuffer.prototype.slice as separate module ids, but`,
      `// the prior implementation implements both in one file -- see`,
      `// _array-buffer-impl.ts, which both ids delegate to.`,
      `export * from './_array-buffer-impl.js';`,
      '',
    ]);
    extraModuleCount++;
  }the prior implementation
}

// es.date.to-primitive: computed Date.prototype[Symbol.toPrimitive] -- rides
// with the Symbol island (only installs once a real Symbol.toPrimitive exists,
// native or the just-installed es.symbol module), and has no dedicated probe
// in the prior implementation (gated inline in load-language.ts). Hand-assembled the
// same way es.string.iterator is.
{
  const helperFile = 'date-to-primitive';
  const exportName = 'dateToPrimitive';
  const implRaw = readFileSync(resolve(REPO_B_HELPERS, `${helperFile}.ts`), 'utf-8');
  assertHasExport(implRaw, exportName);
  writeModule('es.date.to-primitive', [
    originHeader(helperFile),
    '',
    `export const isSupported = (): boolean => {`,
    `  try {`,
    `    return (`,
    `      typeof Symbol === 'undefined' ||`,
    `      !(Symbol as any).toPrimitive ||`,
    `      typeof (Date.prototype as any)[(Symbol as any).toPrimitive] === 'function'`,
    `    );`,
    `  } catch {`,
    `    return true; // no usable Symbol -- nothing for this module to do`,
    `  }`,
    `};`,
    '',
    implRaw.trimEnd(),
    '',
    `if (typeof Symbol !== 'undefined' && (Symbol as any).toPrimitive && !isSupported()) {`,
    `  (Date.prototype as any)[(Symbol as any).toPrimitive] = ${exportName};`,
    `  Object.defineProperty(((Date.prototype as any)[(Symbol as any).toPrimitive] as any), '__polyfilled', { value: true });`,
    `}`,
    '',
  ]);
  extraModuleCount++;
}

// Alias-only ids: finer-grained core-js-compat module ids that are ALREADY
// implemented by a module spackle ships, just exposed under a more granular id
// the registry didn't list. Thin re-exports (same as Reflect's 13 ids) so the
// module specifier resolves and regenerate-registry.mjs picks them up -- zero
// new polyfill logic. This is also what fixes the Symbol usage-global gap:
// built-in-definitions already maps Symbol.iterator -> es.symbol.iterator etc.,
// so once those ids are registered modules they inject (-> resolve to es.symbol).
//
// Only ids whose behavior the target module genuinely provides are aliased:
//   - es.symbol.* : the 14 well-knowns + description that symbol.ts installs
//     (NOT dispose/async-dispose -- not in symbol.ts's wellKnown array).
//   - es.regexp.exec/sticky : the per-instance sticky emulation regexp-constructor.ts
//     provides (carries its [incomplete] per-instance limitation). NOT
//     es.regexp.test/dot-all (no prototype-level test patch, no 's' flag).
//   - es.aggregate-error.cause : the ctor's options.cause handling.
// Deliberately NOT aliased: es.array.unscopables.flat / .flat-map -- the shipped
// es.array.flat / flat-map modules don't patch Array[Symbol.unscopables], so
// those stay gaps.
const aliasEntries = [
  ['es.symbol.description', 'es.symbol'],
  ['es.symbol.has-instance', 'es.symbol'],
  ['es.symbol.is-concat-spreadable', 'es.symbol'],
  ['es.symbol.iterator', 'es.symbol'],
  ['es.symbol.async-iterator', 'es.symbol'],
  ['es.symbol.match', 'es.symbol'],
  ['es.symbol.match-all', 'es.symbol'],
  ['es.symbol.replace', 'es.symbol'],
  ['es.symbol.search', 'es.symbol'],
  ['es.symbol.species', 'es.symbol'],
  ['es.symbol.split', 'es.symbol'],
  ['es.symbol.to-primitive', 'es.symbol'],
  ['es.symbol.to-string-tag', 'es.symbol'],
  ['es.symbol.unscopables', 'es.symbol'],
  ['es.regexp.exec', 'es.regexp.constructor'],
  ['es.regexp.sticky', 'es.regexp.constructor'],
  ['es.aggregate-error.cause', 'es.aggregate-error'],
];
let aliasModuleCount = 0;
for (const [aliasId, targetModule] of aliasEntries) {
  writeModule(aliasId, [
    `// Alias re-export: core-js-compat tracks ${aliasId} as its own module id,`,
    `// but the whole feature is already implemented by ${targetModule} -- this`,
    `// id just delegates there so the provider can inject it.`,
    `export * from './${targetModule}.js';`,
    '',
  ]);
  aliasModuleCount++;
}

const total =
  entries.length +
  ctorEntries.length +
  1 +
  REFLECT_MODULE_IDS.length +
  TYPED_ARRAY_MODULE_IDS.length +
  1 +
  promiseMethodEntries.length +
  webModuleCount +
  extraModuleCount +
  aliasModuleCount;
console.log(`\nGenerated ${total} modules.`);
