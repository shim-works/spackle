# Remaining work

Tracking doc. Tick items as they land. Principle and rationale live in
`DESIGN.md`.

spackle is an **independent runtime polyfill** — `import "@shim-works/spackle"`
installs everything, each module gated on its own `isSupported()`. Babel is not
involved; `@babel/preset-env` still handles syntax, that's a separate job.

`core-js-compat` is kept purely as a **coverage yardstick** — "which features
would core-js cover at `{chrome: "38", safari: "7.1"}` that we don't yet." It no
longer drives what gets injected, because nothing gets injected any more.

Last recount: **8 es/web ids missing**, 278 registered — and all 8 are closed decisions (see below), not backlog.

---

## Retention

From the object-graph audit of all 217 modules. See `DESIGN.md` for the rules
and `tests/retention.test.ts` for the checks.

| # | Item | Problem | Effort | Status |
|---|---|---|---|---|
| R1 | `es.symbol.ts` | Every `Symbol()` permanently added an accessor to `Object.prototype`. Unbounded; degraded property lookup program-wide, not just for symbol users | ~½ day | ✅ **done** |
| R2 | `web.url.ts` | `url → searchParams → patched method → closure → url` cycle; a full HTML document allocated per `new URL(x, base)`; module-scope `<a>` retained | ~½ day | ✅ **done** |
| R3 | `es.weak-set.ts` | Nests on polyfilled `WeakMap` (`this._map = new WeakMap()`) | — | ✅ **accepted**, no action |

**R1 resolved (2026-08-04) — the dumb way, deliberately.**

Intercepting `obj[sym] = v` fundamentally requires a per-symbol accessor on
`Object.prototype`; there is no way around that in ES5. So the accessor is gone
and the leaked key is filtered out of everything that enumerates instead:
`Object.keys`, `getOwnPropertyNames`, `entries`, `values`, `assign`, and
`JSON.stringify` all skip `@@`-prefixed keys. Gated on *"did we polyfill
Symbol"*, not *"is Object.keys broken"* — any engine needing a Symbol polyfill
has a perfectly good native `Object.keys`, so the `es.object.*` islands never
install there and could not carry the filter themselves.

**5000 `Symbol()` calls now add zero properties to `Object.prototype`** (was
5000 accessors). Pinned by a test.

**The accepted cost — `for..in` over an object the caller symbol-keyed shows the
`@@` key.** `for..in` is syntax and cannot be wrapped. The blast radius is small
because every symbol-keyed property spackle installs itself now goes through
`Object.defineProperty` with `enumerable: false`, so nothing enumerable ever
lands on a prototype — `for (const k in someArray)` is unaffected. Only an
object you symbol-keyed directly can surface one, and only via `for..in`.
Documented as `[incomplete]` with its own test.

### Done

- ✅ `es.map.ts` / `es.set.ts` — iterators no longer pin their collection.
  `_self` released in the `done: true` branch, guarded against repeat `next()`.
- ✅ `_set-immediate-impl.ts` — always schedules a `setTimeout` alongside the
  `postMessage`, so undeliverable tasks drain instead of retaining callback +
  args for the life of the page. Un-blocked the 3 previously-skipped tests.
- ✅ `web.url.ts` — cycle broken. Liveness now runs URL → params only: `search`
  and `href` are prototype getters that re-serialize from the params on read,
  instead of the params carrying wrapper methods that closed over the URL.
  Params are lazy (a URL that never touches the query allocates none) and the
  resolver document is built once instead of per `new URL(x, base)`. Accessors
  moved to the prototype, so constructing a URL allocates no closures. Covered
  by `tests/url-polyfill.test.ts`.
- ✅ `web.url-search-params.ts` — storage switched from an object-of-arrays to a
  flat `[name, value]` pair list, the structure the spec describes. Fixes two
  real bugs: repeated keys were grouped (`a=1&b=2&a=3` round-tripped as
  `a=1&a=3&b=2`) and a key of `__proto__` corrupted the backing object. Also
  picked up `Array<[name, value]>` construction, closing that `[incomplete]`.
  Deliberately not backed by `Map` — that would nest this polyfill on another.

---

## Coverage gap — 8 es/web ids, all closed decisions

| Batch | Ids | What | Shared machinery | Effort | Status |
|---|---|---|---|---|---|
| B7 | 4 | `es.map`/`es.weak-map` `get-or-insert(-computed)` | none | ~2 hrs | ✅ **done** |
| B1 | 19 | `es.object.is-sealed`, 4× `__defineGetter__` family, 2× `@@unscopables`, 3× `toStringTag`, 2× regexp, `es.function.has-instance`, 2× `es.error`, 2× `Symbol.dispose`, `web.self`, `web.atob` | none | ~1 day | ✅ **done** |
| B8 | 1 | `es.error.cause` | wraps 7 ctors, shared prototype | ~½ day | ✅ **done** |
| B9 | 5 | float16 ×3, `es.math.sum-precise`, `es.array.from-async` | `_float16-impl.ts` | ~1 day | ✅ **done** |
| B3 | 8 | typed-array fill — `from`/`of`/`set`/`find-last(-index)`/`to-reversed`/`to-sorted`/`with` | extends existing typed-array island | ~1 day | ✅ **done** |
| B4 | 6 | `es.uint8-array` base64/hex | one codec | ~1 day | ✅ **done** |
| B5 | 5 | `web.url.can-parse`/`.parse`, `url-search-params.delete`/`.has`/`.size` | edits shipped URL polyfills | ~½ day | ✅ **done** |
| B6 | 4 | Disposable stacks — `es.disposable-stack`, `es.async-disposable-stack`, `es.suppressed-error`, `es.async-iterator.async-dispose` | one impl | ~1 day | ✅ **done** |
| B2 | 15 | `es.iterator.*` helpers | shared `_iterator-impl.ts`, atomic install | ~3 days | ✅ **done** |
| — | 4 | **Infeasible on ES5** — `es.array-buffer.constructor`/`.detached`/`.transfer`/`.transfer-to-fixed-length` | — | — | ⛔ **never** |
| — | 4 | **Deliberately unbuilt** — `es.json.parse`/`.stringify`/`.raw-json`/`.is-raw-json` | — | — | ⛔ **won't do** |

### Suggested order

**Coverage is finished.** 67 ids shipped, gap **75 → 8**, plus the URL retention
rewrite. Every `web.*` id is covered, and every feasible `es.*` one.

**The remaining 8 are closed decisions, not backlog:**

- **`es.array-buffer.constructor` / `.detached` / `.transfer` /
  `.transfer-to-fixed-length` (4) — infeasible.** Detach semantics and resizable
  buffers are engine-level; ES5 has nothing to emulate them with.
- **`es.json.parse` / `.stringify` / `.raw-json` / `.is-raw-json` (4) — won't
  do.** Source-text access means replacing native `JSON.parse` and
  `JSON.stringify` with an ES5 parser. That's a real correctness and performance
  regression for every consumer of JSON, traded for a rarely-used proposal. Not
  a difficulty call — a bad-deal call. Revisit only if something concrete needs it.

### Real test262 (`yarn test262`)

`scripts/test262.mjs` runs the real suite against spackle. The trick it
encodes: test262 tests **globals**, so each feature deletes the natives first —
otherwise you measure V8, not this library. Needs a sparse checkout (~18MB,
setup in the script header) or `TEST262=/path`.

It found bugs the hand-written suite could not, and drove every fix below.

| Feature | First run | Then | Now |
|---|---|---|---|
| `Array.fromAsync` | 90/95 | 92/95 | **93/95** |
| `Iterator.*` helpers | 248/365 | 344/365 | **360/365** |
| `Map.getOrInsert` | 26/33 | 31/33 | **31/33** |
| `DisposableStack` | 62/93 | 84/93 | **85/93** |
| `Uint8Array.fromBase64/Hex` | 12/22 | 20/22 | **20/22** |
| `SuppressedError` | 11/22 | 20/22 | **20/22** |
| `Uint8Array.toBase64/setFrom*` | 16/48 | 39/48 | **42/48** |
| `WeakMap.getOrInsert` | 24/39 | 37/39 | **37/39** |
| `Math.f16round` | 3/5 | 4/5 | **4/5** (plus 56/56 conformance table) |
| `Math.sumPrecise` | 5/10 | 9/10 | **9/10** |
| **TOTAL** | | 680/732 (92%) | **701/732 (96%)** |

**Fixed:** the enumerable-descriptor class (46 → 0), three iterator **infinite
loops**, `IteratorClose` swallowing user errors, and helper argument-validation
order. All have regression tests in the normal suite, so `yarn test` catches
them without needing a test262 checkout.

**Fixed since:** the enumerable-descriptor class (46 → 0), three iterator
**infinite loops**, `IteratorClose` swallowing user errors, helper
argument-validation order, function `.name`/`.length` on installed members, and
a full rewrite of the base64 decoder (`lastChunkHandling`, `read` indexing the
original string, incremental writes, receiver guards). All have regression tests
in the normal suite, so `yarn test` catches them without a test262 checkout.

**Fixed (2026-08-08) — the 21 open Iterator/DisposableStack/base64 bugs, 21 wins:**
- **`_iterator-impl.ts`'s `@@dispose` never installed unless another module
  happened to create `Symbol.dispose` first.** It only *read* `Symbol.dispose`,
  never created it — the one island in the whole repo that broke the
  "no imports of other islands, each self-contained" rule. In the real full
  install this was masked (`es.disposable-stack.constructor` sorts before
  `es.iterator.*` alphabetically and creates the symbol first), but any bundle
  or environment where iterator modules load alone left `IteratorPrototype`
  with no `[Symbol.dispose]` at all — 6 test262 failures. Now does the same
  check-then-create rendezvous `_disposable-impl.ts` does.
- **`reduce`/`forEach`/`some`/`every`/`find` didn't close the underlying
  iterator when the callback argument failed validation** — only `map`/
  `filter`/`take`/`drop`/`flatMap` did. A direct violation of this repo's own
  "release on completion" rule (5 failures, and the class of bug this repo
  cares about most).
- **`flatMap`'s inner-iterator resolution accepted primitives with a
  monkeypatched wrapper prototype**, and silently used a returned object *as*
  the iterator when its `Symbol.iterator` was a defined-but-uncallable value
  instead of throwing (2 failures — `GetIteratorFlattenable` conformance).
- **`Iterator.prototype.reduce.length` was 2, not 1** — the optional trailing
  `initial` argument still counted toward compiled arity.
- **`Iterator.prototype.constructor` was a plain data property**, not the
  spec's accessor pair with `SetterThatIgnoresPrototypeProperties` semantics
  (2 failures — a plain writable property can't reproduce the one place they
  diverge: assigning directly to `IteratorPrototype.constructor` must throw).
- **`Map`/`Set`/`WeakMap`/`DisposableStack`/`AsyncDisposableStack`/
  `SuppressedError`'s `@@toStringTag` were installed `writable: true`** — every
  spec `@@toStringTag` data property is non-writable, unlike ordinary methods.
  Found via the DisposableStack test262 failure, then grepped for the same
  shape across the repo (Map/Set/WeakMap weren't in any test262 feature bucket,
  so this would have shipped silently otherwise).
- **`toBase64`/`setFromBase64` checked detachedness too early.** The options
  read (`alphabet`) can run a user getter with side effects; the spec checks
  detachedness *after* that read finishes, not on entry — so an
  already-detached-on-entry receiver must still fire the getter once before
  throwing. The early brand-check swallowed that (3 failures: 2 detached +
  the ordering itself).
- **`setFromBase64` scanned and rejected garbage input even when the target
  had zero length.** `maxLength = 0` short-circuits before any character is
  examined per spec; a zero-length target with `"#"` as input must return
  `{read:0, written:0}`, not throw `SyntaxError`.

All of the above have regression tests in `tests/iterator-helpers.test.ts`,
`tests/disposable.test.ts`, `tests/map.test.ts`, `tests/set.test.ts`,
`tests/weak-map.test.ts`, and `tests/uint8-array-base64.test.ts`.

**Still open (31 failures) — all are one of four closed categories, not
backlog:**

1. **`not-a-constructor` (23)** — genuinely unfixable on ES5. See "What
   'unfixable' actually means" below.
2. **`new.target` / cross-realm (5)** — `DisposableStack` (3: two
   `newtarget-*` + `proto-from-ctor-realm`) and `SuppressedError` (2:
   `newtarget-proto-custom` + `proto-from-ctor-realm`). ES5 cannot observe
   `new.target`, so subclassing through `Reflect.construct(C, [], Other)`
   picking `Other`'s realm/prototype is out of reach.
3. **Immutable ArrayBuffer (2)** —
   `setFromBase64`/`setFromHex throws-when-target-is-backed-by-immutable-arraybuffer`.
   A separate, unshipped TC39 proposal; ES5 has no concept of an immutable
   buffer to construct one against. Revisit only if the proposal ships broadly.
4. **`Array.fromAsync` has no own `prototype` property (1)** — same root cause
   as `not-a-constructor`: an ordinary ES5 function's own `prototype` property
   is non-configurable, so it can't be stripped after the fact. (A
   `Function.prototype.bind()` wrapper *would* lack an own `prototype`, but
   changes `this`-binding semantics and arity in ways not worth it for one
   test.)

**Also still open, unrelated to the above:**
1. **`Math.sumPrecise` 9/10** — the 1 remaining failure is `not-a-constructor`
   (see above), already counted in that bucket. No further action.
2. **Browser harness** — Vitest browser mode + Playwright, as Repo B does it.
   Not started; the piece that closes the fidelity gap jsdom leaves.

**Done (2026-08-08) — symbol-keyed / accessor function names.** Audited every
`Object.defineProperty(X, <symbol-or-string-key>, {value|get: fn})` site in
`src/modules/` for the "get "/"set " and `[Symbol.x]` naming rules core-js's
`make-built-in.js` applies universally and ours didn't. Not all symbol-keyed
installs needed a fix — several (`Array.prototype[Symbol.iterator]` /
`.values`, `Map.prototype[Symbol.iterator]` / `.entries`,
`Set.prototype[Symbol.iterator]` / `.values`, the typed-array and DOM-collection
iterator installs) are spec-required to be the *same function object* as an
already-correctly-named method, so renaming them would have broken the aliased
name instead of fixing anything — checked each one's spec text before touching
it. Real fixes, each previously silently wrong:
- `MapIterator.prototype`/`SetIterator.prototype[Symbol.iterator]` (the
  "return this" helpers) — were unnamed, now `"[Symbol.iterator]"`.
- `String.prototype[Symbol.iterator]` — unnamed, now `"[Symbol.iterator]"`.
- `Date.prototype[Symbol.toPrimitive]` — unnamed, now `"[Symbol.toPrimitive]"`.
- `Function.prototype[Symbol.hasInstance]` — unnamed, now
  `"[Symbol.hasInstance]"`. (Not unit-testable in this environment: the native
  descriptor is non-configurable, so the install gate can never be forced open
  here — verified by direct reasoning + test262's `name.js` text instead.)
- `Array[Symbol.species]` getter — was named after its declaration
  (`arraySpeciesGetter`), now `"get [Symbol.species]"`.
- `Map.prototype.size` / `Set.prototype.size` getters — method-shorthand
  `get(){}` inside a descriptor object names the function `"get"` (the
  shorthand key), not `"get size"` — an easy trap since it looks named
  already. Now `"get size"`.
- `RegExp.prototype.flags` / `.dotAll` getters — same unnamed-getter gap, now
  `"get flags"` / `"get dotAll"`.
- `%IteratorPrototype%.constructor`'s accessor pair (added this session, see
  above) — now `"get constructor"` / `"set constructor"`.

7 of these have regression tests in `tests/install.test.ts` (delete-native +
`vi.resetModules()` + reimport, the same pattern the file already used).
`Set.prototype.size` doesn't: deleting the real global `Set` in-process
reliably breaks something the test runner's own module loader needs before
`es.set.ts` even evaluates, unlike every other constructor tried here — the
fix is byte-identical to `Map.prototype.size`'s (verified working) and
`es.set.ts`'s own suite exercises the polyfill directly. None of this moved
the test262 score (none of these properties are in any FEATURES bucket in
`scripts/test262.mjs`) — verified by direct reproduction and against each
property's `name.js` in the test262 source instead.

### What "unfixable" actually means — checked against core-js

**`not-a-constructor` (23) — genuinely unfixable, and core-js has the same
limitation.** Read core-js's `internals/make-built-in.js`: it sets `.name`
(including `get `/`set ` prefixes and `[Symbol.x]` for symbol keys) and `.length`
via an `arity` option, and does **nothing** about constructibility.
`internals/define-built-in.js` then installs with
`{ value, enumerable: false, configurable: true, writable: true }` — exactly the
descriptor shape we converged on independently. Every ordinary ES5 function is
constructible via `new`; there is no way around it without `Proxy` or arrow/
shorthand syntax, none of which exist on the floor.

It is never *measured* for core-js because you cannot run test262 on the engines
where core-js's polyfills actually install. Our forced-install runner is what
makes it visible — a property of the measurement, not a defect of the polyfill.

**`$262` was NOT unfixable — it was a hole in our runner.** `createRealm` and
`detachArrayBuffer` are host hooks a real test262 runner provides; ours didn't,
so seven tests reported "$262 is not defined" and got filed as a polyfill limit.
The runner now implements them (`vm.createContext` for realms, `structuredClone`
with a transfer list to detach), and four of those seven turned out to be **real
bugs**: `toBase64`/`toHex`/`setFromBase64`/`setFromHex` must throw `TypeError` on
a detached buffer and didn't. Fixed.

Lesson worth keeping: *"unfixable" claimed by a harness that cannot run the test
is not a finding.* Make the test run first, then classify.

**`new.target` / cross-realm (5)** — ES5 cannot observe `new.target`, so
`Reflect.construct(C, [], Other)` subclassing is genuinely out of reach.

## Browser test harness (`yarn build:browser-tests`)

`src/debug/spackle-test.js` + `spackle-test.html` — the whole suite bundled to
**real ES5**, exposing `window.spackleTest()`, which auto-runs on load and
also stashes its result on `window.__debugResult` for anything driving the
page headlessly (a CDP client polling for that global, for instance). Both
files are **committed source under `src/`, not a build artifact** — they used
to live in `dist/`, which `yarn build`'s `tsup --clean` wipes on every real
build, so anything written there couldn't survive. Treated the same way
`@babel/runtime`'s helpers are: a real, permanent piece of the toolkit,
regenerated via `yarn build:browser-tests` and recommitted when the suite
changes, not thrown away between uses. `spackleTest()` also logs
`passed`/`failed`/`failures` to console, so devtools alone is enough without
reading the page.

**Verified: 1300 passed, 0 failed in real Chrome (2026-08-08, re-checked after
the test262 fixes above).** That is the full suite minus 5 files that cannot
run bundled, each excluded for a stated reason in
`scripts/build-browser-tests.mjs` (`provider.test.ts` needs `@babel/core`;
`dom-collections-for-each` is node-only; three use `vi.resetModules`/`spyOn`,
which have no meaning once bundled).

**It found a real bug on its first run.** `@@dispose` and `@@toStringTag` were
being wired inside `_disposable-impl.ts`'s `if (!isSupported())` block. Chrome
ships `DisposableStack`, so the gate short-circuited and the exported classes
were left without them — while jsdom (no native) opened the gate and everything
looked fine. **The install gate decides whether to touch the GLOBAL; it must
never decide whether our own class is fully formed.** Worth checking other
islands for the same shape.

Two constraints the build encodes, both of which silently produce a broken
bundle if ignored:
- **Babel, not esbuild alone.** esbuild lowers `async` only as far as
  generators, and generators need ES6. Ten suites are async.
- **Globals must be assigned from their own module.** ES imports are hoisted
  above all statements, so assigning `window.describe` in the entry body runs
  *after* the test files have already evaluated — and they call `describe()` at
  module scope. Same hoisting trap as `import "@shim-works/spackle"`.

## Verification layers (all four now in place)

| Command | What it proves | Result |
|---|---|---|
| `yarn test` | logic, fast, jsdom | 1347, zero skips |
| `yarn test262` | real conformance vs. spec | 701/732 (96%) |
| `yarn test:browser` | **two real engines**, in CI | **2648 passed, 0 failed** — chromium + webkit (2026-08-08) |
| `yarn build:browser-tests` | the **actual old target**, by hand | **1300 passed, 0 failed**, real Chrome (2026-08-08) |

`yarn test:browser` (`vitest.browser.config.ts`, playwright) now runs the
suite in both **chromium** and **webkit** automatically — 208 test files ×
2 engines, 2648 tests, zero failures on the WebKit run's first pass. WebKit
matters more than chromium here: it's the engine family the Safari 7.1 floor
actually comes from, and it had never been run against this suite before
today. Neither reaches the real Chrome 38 / Safari 7.1 floor itself — the ES5
bundle is the only thing that does, and has to be opened by hand.

Two files are excluded from browser mode, both for the same Node-only reason:
`provider.test.ts` imports `@babel/core`, and `install.test.ts` leans on
`vi.resetModules()` to force re-evaluation after deleting a native — Vite serves
modules from its own graph and will not re-run them, so the polyfill never
reinstalls. `scripts/build-browser-tests.mjs` skips both for the same reason.

## Install-gate audit — done, clean

The bug real Chrome found (`@@dispose`/`@@toStringTag` wired inside
`if (!isSupported())`, so an engine with the native left the exported class
half-built) was checked across every module. **`_disposable-impl.ts` was the only
instance.** The audit is validated: it flags writes to exported names inside a
gate block, which is exactly the shape of the original bug.

The five remaining hits are all `__polyfilled` markers applied inside the gate,
which is correct — the marker means "this was installed".

## Next step

~~**Symbol-keyed function names**~~ — done, see "Real test262" above.

~~**Webkit in browser mode**~~ — done (2026-08-08). `vitest.browser.config.ts`
now runs `instances: [{browser:'chromium'}, {browser:'webkit'}]`; WebKit binary
installed via `npx playwright install webkit`. 2648/2648 passed on the first
run — no WebKit-specific bugs found.

Nothing left on this list. Coverage, retention, and verification are all
closed items as of 2026-08-08; see the top of this doc for the standing
baseline commands.

**Not worth doing:** 23 `not-a-constructor` (unfixable on ES5 — core-js shares
the limitation), 5 `new.target`/cross-realm (ES5 cannot observe `new.target`),
2 immutable-ArrayBuffer (unshipped proposal), 1 `Array.fromAsync` own-`prototype`
(same root cause as `not-a-constructor`) — see "Real test262" above for detail
on all 31.

All remaining work is **retention and verification**, not coverage:
### Notes that bite

- **No `built-in-definitions.ts` edits needed any more.** B4 and B7 used to
  require them (`toBase64`/`toHex`/`setFromBase64`/`setFromHex` and
  `getOrInsert`/`getOrInsertComputed` are unmapped in the vendored AST→id
  table). That table only ever fed `usage-global`, which no longer ships — a
  new module now just needs to exist in `src/modules/` and be picked up by
  `regenerate-registry.mjs`. Leave the table alone.
- **`_typed-array-impl.ts` now has TWO independent gates, and that's load-bearing.**
  `isSupported()` covers the ES2015 suite atomically (an engine has all of it or
  none). `isModernSupported()` covers the ES2023 additions plus the `from`/`of`
  statics. Folding the second into the first would mean they never install
  anywhere they're needed, since an engine can have the entire ES2015 suite and
  none of the ES2023 ones. Don't merge them.
- **`es.typed-array.set` replaces rather than fills.** Unlike its seven
  batch-mates the method already exists everywhere, so the per-name presence
  check would skip it — it's installed off a behavioural probe instead (a source
  that doesn't fit must throw `RangeError`, not truncate).
- **`_disposable-impl.ts` creates `Symbol.dispose` if it has to.** `stable.ts`
  loads ids alphabetically, so `es.disposable-stack.constructor` runs *before*
  `es.symbol.dispose`. Both use the same check-then-create rendezvous on the
  live `Symbol`, so whichever lands first wins and the other finds it. Don't
  "fix" this by capturing the symbol at module-evaluation time — it isn't there
  yet.
- **`DisposableStack.dispose()` detaches its list before running it.** A
  disposer that throws must not leave the remaining resources reachable from a
  stack the caller is already done with. Pinned by a test.
- **`installPolyfills()` gets slower with every module, and the tests feel it.**
  It imports all 272 one at a time (that sequencing is what makes it
  fault-isolated). The two tests in `tests/install.test.ts` that call it carry a
  30s budget because the 5s default started timing out under full-suite parallel
  load at ~272 modules — it passes in isolation, which makes it look like a
  flake. Raise the budget as the registry grows; don't parallelise the install.
- **After adding modules, rebuild before running the suite.**
  `installPolyfills()` resolves through the package's own `exports` map against
  `dist/`, so a stale build makes `tests/install.test.ts` log resolution
  warnings for the new ids. Tests still pass; the noise is the tell.
- **Install with `Object.defineProperty`, never a plain assignment.** The most
  frequently repeated bug in this repo: `Proto.method = fn` creates an
  **enumerable** property where every native member is non-enumerable, so a
  polyfilled method surfaces in `for..in` over any instance. Fixed across **182
  sites in 160 files** plus the `_disposable-impl.ts` prototype block and the
  `generate-modules.mjs` templates. Keep `writable`/`configurable` true so user
  code can still replace or delete, like a real built-in. Guarded by two tests in
  `tests/install.test.ts`.
- **`Math.sumPrecise` cannot use compensated summation.** Shewchuk/Neumaier
  two-sum computes `hi = x + y`, which overflows to Infinity near MAX_VALUE and
  makes the next step `Infinity + -Infinity = NaN` — so it returns NaN for sums
  that are genuinely finite, not merely an imprecise answer. It now accumulates
  **exactly** in fixed point (24-bit limbs spanning 2^-1074 … 2^1024, separate
  positive/negative accumulators) and rounds once at the end. That single
  rounding is what makes it exactly rounded. Don't "simplify" it back.
- **`CanBeHeldWeakly` includes non-registered symbols.** A `Symbol()` is a valid
  WeakMap key; a `Symbol.for()` one is not, because the global registry keeps it
  alive forever. Objects-and-functions-only was wrong.
- **WeakMap methods need a brand check.** A `Map` has `has`/`get`/`set`, so a
  polyfill written against the public API alone silently accepts one. Checked
  via `Object.prototype.toString` — `'[object WeakMap]'`.
- **`Map` canonicalises `-0` to `+0`**, and the callback must see the canonical
  key, not the raw argument.
- **The test262 runner executes bodies in STRICT mode.** test262 runs most files
  both ways; running only sloppy gives false failures on anything asserting
  strict semantics (`this === undefined` inside a callback). Files flagged
  `noStrict` opt out.
- **`es.error.cause` is not the wholesale swap this doc used to claim.** Each
  wrapper builds a *real native error* and returns it (a constructor returning
  an object overrides `this`), and takes the native's prototype **object**
  outright — `Wrapped.prototype = Native.prototype`. So `instanceof` keeps
  working both ways, `.stack` is genuine, and `Error.prototype` is untouched.
  Pinned by a test. `AggregateError` is excluded: it already reads
  `options.cause` itself.
- **`_iterator-impl.ts` is shared and its install is atomic — don't split it.**
  This doc previously said to write 15 self-contained islands instead. That was
  wrong: every helper must return an object with the same
  `%IteratorHelperPrototype%` (`getPrototypeOf(it.map(f)) ===
  getPrototypeOf(it.filter(f))` is spec-observable), and since the CJS build
  inlines a shared impl into each delegate, only an atomic gate keeps exactly
  one copy live. Per-id installs would each build their own prototype. Pinned by
  the first test in `tests/iterator-helpers.test.ts`.
- **Sharing stateless code was never what the island rule prohibited.** It
  prohibits shared *live object graphs*. 8 shared impls back 76 ids here and 7
  have zero module-scope mutable state. Judge by what a module retains, not by
  how many files it spans. `DESIGN.md` has been corrected.
- **B8 (`es.error.cause`) is why it isn't in B1.** Setting `.cause` from
  `new Error(msg, { cause })` means wrapping the `Error` constructor *and* all
  seven subclass constructors (`TypeError`, `RangeError`, …), preserving
  `instanceof`, `.stack`, and subclass identity through each. That's a wholesale
  swap of eight globals — the opposite of the add-to-the-live-native shape every
  other island uses, and a real risk of breaking `instanceof` across the app.
  Deliberately deferred rather than rushed in with the cheap batch.
- **Existence-only probes are fine, but not where the method always exists.**
  Three B1 modules needed behavioral probes or they'd have been permanent
  no-ops: `es.object.is-sealed` (probe `Object.isSealed(1) === true`, the
  ES5→ES2015 primitive change), `es.regexp.test` (probe that `test` delegates to
  a user-supplied `exec`), `es.error.to-string` (probe the four name/message
  combinations). Same trap applies to any future module patching a method that
  has existed since ES5 — `src/modules/es.object.is-frozen.ts` still has this
  flaw and never installs.
- **The 2-arg `has`/`delete` overloads need behavioral probes.** Both methods
  have always existed; only the second argument is new, and a one-arg
  implementation silently ignores it (`has('a','2')` returns true, `delete` drops
  every match). The probes exercise the overload, not `typeof`. Same class of
  trap as the B1 note above.
- **`delete(name, value)` rebuilds rather than splicing.** It snapshots through
  `forEach`, clears via the original one-arg `delete`, then re-appends the
  survivors in order — so it works against a native `URLSearchParams` as well as
  ours, without reaching into internal storage. Don't "optimise" it into a
  `_pairs` splice; that would break the native case.
- **`web.url.ts` now rejects a relative URL with no base**, matching native.
  The anchor trick can't detect this on its own: assigning a relative string to
  `anchor.href` silently resolves it against the *document's* base URL and
  reports a valid protocol, so `new URL('not-a-url')` used to succeed. There is
  now an explicit scheme check before parsing. Any future work on that module
  must keep it.
- **140 `esnext.*` ids are out of scope** — stage-3-and-below proposals, not
  worth carrying. Nothing in the registry references them.
- **Adding a module is now: write the file, run `regenerate-registry.mjs`.**
  That regenerates `module-registry.ts` and `stable.ts`, and `src/index.ts`
  imports `stable.ts`, so a new island reaches consumers with no other wiring.

---

## Baseline

`yarn lint` clean · `yarn build` clean · **1347 tests, 106 files, zero skips**

Re-run the gap count after any batch:

```js
import compat from 'core-js-compat';
const { list } = compat({ targets: { chrome: '38', safari: '7.1' } });
// diff against the keys of src/module-registry.ts, ignore esnext.*
```

### Also done

- ✅ **Runtime entry.** `import "@shim-works/spackle"` installs everything;
  `src/index.ts` imports `stable.ts`. `package.json` carries
  `"sideEffects": true` so a bundler can't tree-shake the install away.
- ✅ **`__polyfilled` is non-enumerable.** All 155 tag sites across 138 modules
  use `Object.defineProperty(..., { value: true })` instead of a plain
  assignment; `scripts/generate-modules.mjs` emits the same form for new
  modules. Pinned by a test in `tests/install.test.ts`.
- ⚠️ **The Babel provider is no longer exported.** `src/provider.ts`,
  `built-in-definitions.ts` and `usage-filters.ts` are untouched on disk and
  `tests/provider.test.ts` still passes, but nothing reaches them from the
  package — Babel `require()`s plugins in Node, where these modules throw on
  `window`. Kept, not deleted.
