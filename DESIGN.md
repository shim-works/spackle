# spackle — working notes

## Pragmatism over principle

The governing rule in this repo is **pragmatism**. Not DRY, not elegance, not
minimal diffs, not clever structure. What survives contact with a 2014 browser
running for hours on a real page is the only test that counts.

Every rule below exists because it was measured or traced in this codebase, not
because it's good practice somewhere else. When a general software principle
conflicts with what actually keeps memory flat on the target engines, the
principle loses. Duplicate the code. Write the extra file. Inline the helper.

## The thing that actually matters here

These polyfills run for the **entire lifetime of a page**, on engines
(Chrome 38, Safari 7.1) with collectors far weaker than anything you can test
against locally. A polyfill is not a library call that returns and goes away —
it installs objects onto globals that never die, and every object it hands out
drags its whole reference graph along with it.

So the primary design constraint in this repo is **object-graph retention**, not
code reuse and not payload size.

Concretely: when you add or edit a module, the question is *what does this
object hold a reference to, and when does that reference die.* Not "can I share
this with the other seven modules."

### Explicitly deprioritized

- **DRY.** Duplicating a helper rather than reaching for a shared one is fine.
  What's actually prohibited is narrower than "don't share code": a shared
  `_x-impl.ts` that makes N objects point at one **live graph** is worse than N
  copies that each hold only their own. Sharing *stateless* code is fine and is
  what this repo already does — 8 shared impls back 76 module ids, and 7 of them
  have zero module-scope mutable state. Judge by what the module *retains*, not
  by how many files it spans.
- **Bundle size.** Do not trade a retention improvement for bytes. Under
  `usage-global` (the mode that matters) only what's used gets injected anyway.
- **File count.** 217 module files is not a problem. One file per core-js id,
  self-contained, is the target shape.

### The rules

1. **No polyfilled object holds another polyfilled object** unless there is no
   alternative. Each layer is a graph that outlives the one above it.
2. **No cycles.** A closure that captures the instance it's being attached to is
   a cycle. Old collectors do not reliably break these.
3. **Release on completion.** Anything with a terminal state (an exhausted
   iterator, a delivered task, a settled promise) nulls its references *at* that
   state, not never.
4. **No unbounded module-scope registries.** A dict or array at module scope
   that only ever grows is a permanent leak. If it must exist, it needs a
   removal path on every entry.
5. **Never permanently mutate `Object.prototype` per-instance.** Per-feature,
   once, at install: fine. Per object created at runtime: never.
6. **Prototype methods over per-instance closures.** `next` on the prototype,
   state in instance fields — one allocation per iterator, no closure per call.
   `src/modules/es.map.ts:105` already documents this; follow it.

### The model to copy

`src/modules/es.weak-map.ts` gets this right: the entry is stored as a hidden
property **on the key itself**, so it dies exactly when the key dies. No
registry, no parallel array, nothing retained by the WeakMap instance. That is
the standard.

## Known offenders (already shipping — do not add more of this)

Ranked by how much they retain.

**1. `es.symbol.ts` — unbounded `Object.prototype` growth.** Every single
`Symbol(desc)` call does `defineProperty(Object.prototype, '@@' + name, {...})`
and adds a key to the module-scope `usedNames` dict. Neither is ever removed. A
loop calling `Symbol()` permanently grows `Object.prototype`'s property table for
the life of the page — which slows down property lookup on *every object in the
program*, not just symbol users. This is the worst one and it's load-bearing for
`es.map`/`es.set`/`es.array.iterator`/anything with a well-known symbol.

**2. `web.url.ts` — a reference cycle plus per-construction DOM allocation.**
```js
this.searchParams = new URLSearchParams(this.search || '');
const self = this;
const updateSearch = () => { self.search = ...; self.href = ...; };
this.searchParams.append = function (...) { origAppend.call(...); updateSearch(); };
```
`url → searchParams → patched append → closure over self → url`. Also retains a
module-scope `<a>` forever, and `resolveUrl` builds a whole
`document.implementation.createHTMLDocument('')` on **every** `new URL(x, base)`.

**3. `es.weak-set.ts` — nests on polyfilled `WeakMap`.** `this._map = new WeakMap()`.
Correct, and inherits WeakMap's good behaviour, but it is a layer. Acceptable;
noted so it isn't multiplied.

### Fixed

- **`es.map.ts` / `es.set.ts` iterators pinned their collection.** `_self` was
  never cleared, so an exhausted iterator left in scope kept the whole Map/Set
  and every key and value alive. Now nulled in the `done: true` branch, with a
  guard so a repeat `next()` doesn't read through the null. Covered by
  `tests/retention.test.ts`.
- **`_set-immediate-impl.ts` retained undeliverable tasks.** `pendingTasks` only
  drained via the `message` listener, so where delivery never fired the callback
  and its args were held for the life of the page. `setImmediate` now always
  schedules a `setTimeout` alongside the `postMessage`; `runTask` deletes the
  entry before invoking, so whichever lands first wins and the other no-ops.
  This also un-blocked the three tests that used to be skipped.

## Iterator helpers (`es.iterator.*`) — built, and why they're shared

Chains nest by construction: `it.map(f).filter(g).take(3)` is three wrapper
objects, each holding the one beneath plus its callback. That is the real
retention risk, and it exists regardless of how the code is laid out.

`_iterator-impl.ts` is one shared file with an **atomic** install, backing all
15 ids. An earlier version of this document said to write 15 self-contained
islands instead. That was wrong on two counts:

1. A stateless shared impl retains nothing, so the island rule never applied.
2. It would have broken the spec. Every helper must return an object whose
   prototype is the same `%IteratorHelperPrototype%` —
   `getPrototypeOf(it.map(f)) === getPrototypeOf(it.filter(f))` is observable.
   The CJS build inlines a shared impl into each delegate, so only an atomic
   gate keeps exactly one copy live; 15 independent installs would each build
   their own prototype.

What actually matters, and what the tests pin:

- Each helper drops `_underlying` and `_callback` the moment it completes, is
  `return()`ed, or a callback throws. An exhausted chain retains nothing — not
  the source, not the callbacks, not the intermediates.
- `next()` on a released helper returns `{value: undefined, done: true}` rather
  than throwing.
- Helpers that stop early (`take`, `some`, `every`, `find`) call `return()` on
  the source so it releases too.
- `next`/`return` live on the prototype; per-instance state is in fields.

## Structure

This is an **independent runtime polyfill**, not a Babel plugin.
`import "@shim-works/spackle"` installs everything. Babel is only ever
responsible for syntax transforms — a separate job that needs no cooperation
from this package.

- One file per core-js-compat id in `src/modules/`, self-contained, exporting
  `isSupported()` then the impl then a gated install + `__polyfilled` marker.
  No imports of other islands — inline the helpers.
- **Install with `Object.defineProperty`, never a plain assignment.** This is
  the single most-repeated bug in the repo's history — `Proto.method = fn`
  creates an **enumerable** property, where every native method is
  non-enumerable. A polyfilled method then shows up in `for..in` over any
  instance. Real test262 caught 46 of these. The shape:
  ```ts
  Object.defineProperty(Owner, 'key', {
    value: impl, writable: true, enumerable: false, configurable: true,
  });
  ```
  `writable`/`configurable` stay true so user code can still replace or delete
  it, exactly like a real built-in. Applies to prototype methods, statics,
  globals, and own properties set in a constructor (`self.message = …` has the
  same bug). Guarded by tests in `tests/install.test.ts`.
- **The `__polyfilled` marker is likewise defined, never assigned:**
  `Object.defineProperty(x, '__polyfilled', { value: true })`.
  `scripts/generate-modules.mjs` emits both forms; keep it that way.
- `src/module-registry.ts` and `src/stable.ts` are generated. Run
  `node scripts/regenerate-registry.mjs` after adding files; never hand-edit
  them. `src/index.ts` imports `stable.ts`, so a new island needs no other
  wiring to reach consumers.
- `src/provider.ts` + `built-in-definitions.ts` + `usage-filters.ts` are the old
  Babel provider. Still on disk and still tested, but **not exported** — Babel
  `require()`s plugins in Node, where these modules throw on `window`. Don't
  wire them back into the package root.
- Browser-only: constructors use `window`, not `globalThis`.

## Verifying a polyfill

`yarn test` is necessary but **not sufficient** — hand-written tests reflect the
cases the author thought of, and they have repeatedly passed implementations
that real test262 then failed (one was 9/28, another looped forever).

Run **`yarn test262`** on anything non-trivial. It runs the real suite against
this code, deleting the natives first so the gates actually fire — without that
you measure V8, not spackle. Setup is in `scripts/test262.mjs`'s header.

When test262 finds something, fix the implementation *and* add a regression test
to the normal suite, so `yarn test` keeps catching it without a checkout.

Failures that are **correctly ignorable**: `not-a-constructor` (ES5 cannot
express a non-constructible function) and cross-realm `$262` tests.

## The install gate guards the GLOBAL, not your class

`if (!isSupported())` decides whether to touch a global. It must **never** decide
whether the module's own exported class or function is fully formed — put
`@@toStringTag`, `@@dispose`, prototype methods and the like *outside* the gate.

Real Chrome caught this: it ships `DisposableStack`, so the gate short-circuited
and the exported class had no `@@dispose`, while jsdom (no native) opened the
gate and everything looked correct. A whole class of environment-dependent bug
hides here.

## Commands

`yarn build` · `yarn test` · `yarn test262` · `yarn build:browser-tests` ·
`yarn lint` (src only) · `yarn lint:tests` ·
`node scripts/regenerate-registry.mjs` after adding modules.

`yarn build:browser-tests` emits `src/debug/spackle-test.js` + `.html` — the
suite as real ES5 with `window.spackleTest()`, auto-run on load. Committed
source, not a build artifact (lives outside `dist/` on purpose — `tsup`'s
`clean: true` would otherwise wipe it on every `yarn build`). Open it in
whatever browser you can get: that is the only way to learn whether any of
this works on the Chrome 38 / Safari 7.1 floor, since jsdom is a DOM shim and
cannot exhibit engine quirks.
