# spackle performance

How spackle compares with core-js on old browser engines, and how it was measured.

## The idea

Each polyfill in spackle is written as a self-contained module, with no shared
helper functions and no temporary objects created per call. Less allocation
means less garbage, so the garbage collector runs less often and has less live
data to trace when it does. On weak devices, garbage-collection pauses show up
as stutter.

The trade-off is duplicated code inside the library: a fix to shared logic has
to be made in each module that uses it. That cost falls on the library's
maintainers once, rather than on every device at runtime.

## Summary

| Test | Result |
|---|---|
| Design test: one Map polyfill written both ways | Self-contained version: 1.66× faster, 2.2× less garbage |
| App workload, Chrome 41 | ~7× faster, ~7× less garbage, ~6× fewer GCs, half the heap |
| App workload on real browsers | Chrome 38 ~8× faster, Safari 7.1 ~4×, Chrome 56 ~4×, Chrome 80 level |
| React app, real browsers | ~19% faster on Chrome 38, ~7% on Safari 7.1 |
| React app, memory | 17–22% less heap after collection on old engines; level on modern ones |
| Compatibility | Works on Chrome 38+ and Safari 7.1+ |

The gap is largest on the oldest engines and disappears on modern ones, where
there is little left to polyfill.

## Where the numbers come from

**Emulator.** Old Chromium builds (Chrome 41 to 80) run on a desktop with the
JavaScript heap capped (96 or 128 MB) and the CPU limited, to approximate TV
hardware. Chrome's own performance tracing records every garbage collection, so
collection counts, pause times and heap sizes come from there.

**BrowserStack.** Real desktop builds of the old engines: Chrome 38, 44, 53, 56,
75, 80 and 100, and Safari 7.1, 8, 9 and 10. The VMs are shared and noisy, so
only the ratios between the two libraries are meaningful, not the absolute times.

**Natives kept vs natives deleted.** "Natives kept" is the real-world case: each
library only polyfills what the engine is missing. "Natives deleted" removes the
built-ins first, so both libraries install everything; that compares the
implementations directly.

## Tests

### Design test

The same Map polyfill was written two ways: once self-contained, and once routed
through shared helper functions, as a typical polyfill library is built. Nothing
else differed. The self-contained version was **1.66× faster and made 2.2× less
garbage**. This isolates the design itself as a cause of the difference.

### App workload

A loop that does what a front-end framework does on each render of a 30-row list
(123 elements). Every pass calls the APIs a typical app relies on:

| API | Calls per pass | Why an app calls it |
|---|---|---|
| `Object.assign` | 33 | Props spread on each element |
| `Object.keys` | 30 | Shallow prop comparison per row |
| `Object.is` | 12 | Hook dependency checks |
| `Array.from` | 1 | Rebuilding a hook state list |
| `Array#flat`, `findIndex`, `includes` | 1, 1, 30 | Child flattening, active-row lookup, class checks |
| `Map.set` / `get`, `Set.add` / `has` | 30 each | Keyed reconciliation |
| `WeakMap.set` | 1 | Per-element instance cache |
| `String#trim`, `startsWith`, `padStart` | 30, 30, 60 | Class names, time formatting |
| `new URL`, `URLSearchParams`, `Object.fromEntries`, `Object.entries` | 1 each | Routing and query params |
| `Promise`, `Promise.allSettled`, `queueMicrotask` | 3, 1, 1 | Effects and data fetching |

Each library runs 5000 passes in its own iframe, in random order, with a
30-second idle between them so the first library's garbage is collected before
the second starts.

**Chrome 41, emulator, natives kept**

| | core-js | spackle | |
|---|---|---|---|
| Time | 12.06 s | 1.77 s | 6.8× faster |
| Garbage collections | 444 | 73 | 6.1× fewer |
| Total GC pause | 1287 ms | 290 ms | 4.4× less |
| Garbage created | 3.2 GB | 0.46 GB | 7× less |
| Heap after full GCs (median) | 31.0 MB | 15.5 MB | half |

A CPU profile of the same run shows where core-js spends its time:

| | core-js | spackle |
|---|---|---|
| Total CPU | 12.9 s | 2.1 s |
| Garbage collector | 1232 ms | 247 ms |
| `Object.assign` | 3.3 s | 0.21 s |
| `new URL` + `URLSearchParams` | 3.0 s (V8 stopped optimising the parser) | 0.27 s |
| `Array#concat` | 2.7 s (core-js replaces the native) | 0 (native kept) |
| `Array.from` | 1.0 s | 0.01 s |
| `padStart` | 0.9 s | 0.003 s |
| `trim`, `flat` | ~0.3 s each | ~0.02 s each |

**Real browsers, BrowserStack, natives kept** (one run each)

| Engine | Modules spackle installed | spackle | core-js | spackle faster by |
|---|---|---|---|---|
| Chrome 38 | 51 of 80 | 7.5 s | 58.5 s | 7.8× |
| Safari 7.1 | 62 of 80 | 5.8 s | 25.1 s | 4.3× |
| Chrome 56 | 26 of 80 | 1.9 s | 7.2 s | 3.7× |
| Chrome 80 (2 runs) | 16 of 80 | 1.15 / 1.11 s | 1.00 / 1.14 s | level |

### Per-API test

Each polyfilled API is timed on its own, with natives deleted so both libraries
supply every implementation (56 APIs, Chrome 41, emulator). spackle was faster
on 53 of 56. Summed across all of them: **spackle ~1.6 s, core-js ~22 s**. The
APIs where the two are close or core-js is ahead are Map iteration (~0.85×),
`Object.keys` (~0.9×), and `queueMicrotask`, whose times are under a millisecond
and swing between runs.

### React app

A real React app running row operations modelled on the
js-framework-benchmark: create 1000 rows, create 10,000 rows, replace all rows,
clear rows. Each operation is repeated, with the first run discarded and the
median reported.

**Real browsers, BrowserStack, natives kept**

| Operation | Chrome 38: core-js | Chrome 38: spackle | Safari 7.1: core-js | Safari 7.1: spackle |
|---|---|---|---|---|
| Create 1000 rows | 1243 ms | 1171 ms | 495 ms | 213 ms |
| Create 10,000 rows | 19384 ms | 15349 ms | 4107 ms | 4088 ms |
| Replace all rows | 1252 ms | 1039 ms | 385 ms | 327 ms |
| Clear rows | 72 ms | 131 ms | 106 ms | 109 ms |
| **Total** | **21.9 s** | **17.7 s (−19%)** | **5.1 s** | **4.7 s (−7%)** |

Clearing rows on Chrome 38 is the one operation where spackle is slower. The
Safari "create 1000 rows" figure is noisy (core-js's best run was 180 ms).

**Memory, emulator**

| Engine | Library | GCs | GC pause | Heap after full GCs (median) |
|---|---|---|---|---|
| Chrome 41 | core-js | 1840 | 10.6 s (full GCs) | 46.4 MB |
| Chrome 41 | spackle | 1838 | 9.9 s (full GCs) | 39.1 MB (−17%) |
| Chrome 44 | core-js | 120 | 752 ms | 36.7 MB |
| Chrome 44 | spackle | 99 | 646 ms | 28.5 MB (−22%) |
| Chrome 80 | core-js | 181 | 503 ms | 20.9 MB |
| Chrome 80 | spackle | 183 | 534 ms | 21.2 MB (level) |

In a React app, most of the garbage is React's own, so collection counts stay
close. spackle still lowers the memory floor on old engines.

### Compatibility

spackle's verification page, which checks each polyfilled API against its
expected behaviour, passes on Chrome 38, 44, 53, 56, 75 and 100, and Safari 7.1,
8, 9 and 10.

## Caveats

- **Not only the design.** Part of the gap against core-js comes from how much
  core-js replaces: on Chrome 41 it swaps out the native `Array#concat`. The
  design test above is the cleaner measure of the design itself.
- **Noise.** Single runs vary, by ±30% or more for per-API timings. BrowserStack
  figures are one run per browser.
- **No TV hardware yet.** Results come from the emulator and real desktop
  browser builds, not from a TV or set-top box.
- **Known gaps.** WeakMap can't take frozen objects as keys, and symbol keys in a
  WeakMap are held strongly.
