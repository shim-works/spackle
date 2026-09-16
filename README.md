# spackle

**Polyfills that are nice to the garbage collector.**

A runtime polyfill for Chrome >= 38 / Safari >= 7.1, hand-rolled so that nothing it installs quietly
retains memory for the lifetime of your page.

```bash
npm install @shim-works/spackle
```

```js
import "@shim-works/spackle";
```

That's the whole API. Every module gates on its own `isSupported()` and patches only what the
browser actually running your code is missing. Installation is synchronous and finishes before any
module imported after it evaluates.

> **Beta.** `0.1.0-beta.1` is the first public release. The coverage and test numbers below are
> real and reproducible, but this has not yet been run in anger by anyone but its author. Pin the
> exact version.

## Why not core-js

core-js is excellent and optimises for spec fidelity. This optimises for something else.

A polyfill is not a library call that returns and goes away. It installs objects onto globals that
never die, on engines whose collectors are far weaker than anything you can test against locally,
and it stays there for hours of real session time. Every object it hands out drags its whole
reference graph along with it.

So the governing constraint here is **object-graph retention**. An audit of all 288 modules found
and fixed:

- a reference cycle in **every single `URL`** — `url → searchParams → patched method → closure →
  url`, plus a full HTML document allocated per `new URL(x, base)`
- **Map/Set iterators pinning their entire collection**, keeping every key and value alive for as
  long as an exhausted iterator stayed in scope
- **`setImmediate` retaining undeliverable callbacks forever** — a task that never got delivered
  held its callback and arguments for the life of the page
- **unbounded `Object.prototype` growth from `Symbol`** — every `Symbol()` permanently added an
  accessor to `Object.prototype`, degrading property lookup program-wide, for every page that
  touched a symbol. 5000 `Symbol()` calls now add zero properties.

Each is pinned by a test in `tests/retention.test.ts`. None of these are exotic; they are what
happens when a polyfill is written for correctness on a machine with a modern collector.

**Babel is not involved.** `@babel/preset-env` still compiles *syntax* — arrow functions, classes,
`async`, destructuring. Providing *built-ins* is a separate job that needs no compiler. Keep
preset-env; this sits alongside it.

## Making sure it runs first

ES modules evaluate dependencies in source order, so the bare import works as long as it is first.
That is a source convention, though — import sorters will happily reorder it. The robust form puts
it in the bundler entry, where order is not up to any one file:

```js
// webpack
entry: ["@shim-works/spackle", "./src/index.js"]
// vite / rollup
input: ["@shim-works/spackle", "./src/index.js"]
```

### `installPolyfills()`

```js
import { installPolyfills } from "@shim-works/spackle";
await installPolyfills();
```

Also exported, for per-module fault isolation: each module is imported independently, so one
failing — say, one assuming a browser context you are not in — is caught and warned rather than
taking the rest down. Note the root import has already installed everything by the time this runs.

Every module ships; there is no target-based trimming. At a Chrome 38 / Safari 7.1 floor that is
nearly the whole set anyway, and serving less to modern browsers is differential serving, which
belongs in the bundler.

## Coverage

**278 module ids registered.** Measured against `core-js-compat` at `{chrome: "38", safari: "7.1"}`,
8 ids remain — all closed decisions rather than backlog:

- `es.array-buffer.constructor` / `.detached` / `.transfer` / `.transfer-to-fixed-length` —
  **infeasible.** Detach semantics and resizable buffers are engine-level; ES5 has nothing to
  emulate them with.
- `es.json.parse` / `.stringify` / `.raw-json` / `.is-raw-json` — **won't do.** Source-text access
  means replacing native `JSON.parse`/`JSON.stringify` with an ES5 parser: a real correctness and
  performance regression for every consumer of JSON, traded for a rarely-used proposal.

`usage-pure` (non-mutating imports for library authors) is not built — that needs a parallel
side-effect-free file tree, which is an architectural fork, not a feature.

## How it is verified

Four layers, because each catches what the others structurally cannot.

**`yarn test` — 1347 tests, 106 files, zero skips.** Mostly test262-derived conformance suites,
plus hand-written suites for the modules authored here.

**`yarn test262` — real test262, 680/732 (92%).** The trick it encodes: test262 tests *globals*, so
each feature deletes the natives first, otherwise you measure V8 rather than this library. It found
bugs the hand-written suite could not — `Math.sumPrecise` returning `NaN` for finite sums, three
infinite loops in the iterator helpers, and a class of enumerable-property leaks. Of the 52
remaining failures, ~21 are `not-a-constructor`, which is genuinely unfixable in ES5 — core-js has
the identical limitation, it is simply never measured, since you cannot run test262 on the engines
where its polyfills actually install.

**`yarn test:browser` — 2648 passing** in real chromium + webkit via Playwright. jsdom is a DOM
*shim*; these are actual engines. WebKit matters most, being the engine family the Safari 7.1 floor
comes from.

**`yarn build:browser-tests` — the suite as real ES5, in a real browser.** Emits a standalone
bundle you can open on an old device or a BrowserStack session. **1300 passing in Chrome.** It
earned its keep on the first run: `@@dispose` and `@@toStringTag` were being wired inside an
`if (!isSupported())` block, so on a browser that ships `DisposableStack` the gate short-circuited
and the exported classes were left half-built — while jsdom opened the gate and everything looked
fine.

## License

MIT © Sam Seabourn

Contributor and design documentation lives in [`DESIGN.md`](DESIGN.md) — in particular the
retention rules, which are the reason most of this code looks the way it does.
