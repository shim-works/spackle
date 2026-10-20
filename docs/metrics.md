# spackle metrics

Measured evidence for the islands thesis. All numbers are from Chrome 41 (or 56 where
noted) in fauxmium with a 96 MB heap and one CPU core, unless a row says otherwise.
Raw captures live in `~/Desktop/TEST-FOLDER`. Update this file when a new capture lands.

## Thesis

> Write each polyfill as a self-contained island, with no shared helpers and no
> allocation per call. On weak TV engines that cuts CPU time and garbage-collector
> pauses several times over.

The cost is duplicated source: a spec fix has to be applied in every copy. The
maintainer pays that once, instead of every device paying at runtime.

## Evidence

| What | Result | What it proves |
|---|---|---|
| Twin test: the same Map as an island vs routed through shared helpers | 1.66× faster, 2.2× less garbage | Islands themselves are the cause (one variable changed) |
| /benchmark, 5000 passes, natives kept, against core-js | 6.8× faster, 5× less GC time, 6× fewer GCs, half the heap | The size of the win on app-shaped code |
| CPU profile of that run | core-js time sits in shared helpers plus a URL parser V8 gave up optimising | Where the shared-helper cost lands |
| Real React app, against core-js | 19% faster on Chrome 38, 7% on Safari 7.1 (BrowserStack); level on fauxmium Chrome 41; 17–22% less live heap | Real apps gain too, on the oldest engines |

## /benchmark, 5000 passes (Chrome 41, natives kept, after inlining, 2026-10-19)

Files: `spack-5k-run-natives.json`, `corejs-5k-run-natives.json`. Time is measured
between the `run-start` and `run-end` timestamps.

| | core-js | spackle | Δ |
|---|---|---|---|
| Test time | 12.06 s | 1.77 s | 6.8× |
| GC count | 444 | 73 | 6.1× fewer |
| GC pause total | 1287 ms | 290 ms | 4.4× |
| Garbage made | 3.2 GB | 0.46 GB | 7× |
| Heap after full GCs (median) | 31.0 MB | 15.5 MB | −50% |

This repeats the earlier capture from before inlining (74 against 444 GCs).

## CPU profile of the same run

Files: `coreJS-CPU-Profile`, `spackle-CPU-Profile`.

| | core-js | spackle |
|---|---|---|
| Busy CPU | 12.9 s | 2.1 s |
| Garbage collector | 1232 ms | 247 ms |
| `Object.assign` | 3.3 s | 0.21 s |
| `new URL` (+ URLSearchParams) | 3.0 s; parser marked "Optimized too many times" | 0.27 s |
| `Array#concat` | 2.7 s (core-js replaces the native for `isConcatSpreadable`) | not in the profile (native kept) |
| `Array.from` | 1.0 s | 0.01 s |
| `padStart` | 0.9 s | 0.003 s |
| `trim`, `flat` | about 0.3 s each | about 0.02 s |

## React app (Chrome 41, after inlining, 2026-10-19)

Files: `*-react-post-inline-helpers.json`.

| | core-js | spackle | Δ |
|---|---|---|---|
| Render time | 1328 ms | 1286 ms | level |
| GCs | 1840 | 1838 | level (React's own garbage, about 7.5 GB each) |
| Full-GC pause | 10.6 s | 9.85 s | −7% (noise range) |
| Heap after full GCs: min / median / max | 21.1 / 46.4 / 79.2 MB | 16.8 / 39.1 / 66.1 MB | −17% |
| Heap at rest | 19.55 MB | 12.78 MB | −35% |

## /speed per-API (spackle's own times, natives deleted, Chrome 41)

| API | Before | After |
|---|---|---|
| Map/Set, 10k entries | 113 ms | 0.9 ms |
| WeakMap | 33 ms | 13 ms |
| Array#at | 8.7 ms | 4.0 ms |
| URLSearchParams | 68 ms | 52 ms |
| Sum of all rows | — | about 1.6 s, against core-js about 21–22 s (13.5×) |

spackle wins 53–54 of the 56 rows. The open rows are Map iterate (0.81–0.86×), Object.keys
(about 0.9×), and queueMicrotask and Object.assign (1 shape), which swing between runs.

## Real engines: BrowserStack /compare, 5000 passes, natives kept (2026-10-20)

Pass-6 build. One run per browser, with the order drawn at random. Files are in
`~/Projects/Spackle-tests-browserstack`. Treat ratios as indicative because the VMs are
shared; only the ratios are worth quoting.

| Engine | spackle installs | spackle | core-js | Ratio | Slot (spackle) |
|---|---|---|---|---|---|
| Chrome 38 | 51/80 | 7490 ms | 58510 ms | 7.8× | first |
| Safari 7.1 | 62/80 | 5784 ms | 25081 ms | 4.3× | second |
| Chrome 56 | 26/80 | 1939 ms | 7224 ms | 3.7× | first |
| Chrome 80, run 1 | 16/80 | 1150 ms | 999 ms | 0.87× | second |
| Chrome 80, run 2 | 16/80 | 1114 ms | 1135 ms | 1.02× | first |

**/verify smoke test, pass-6 build:** working on Safari 7.1, 8, 9 and 10, and on Chrome
38, 44, 53, 56, 75 and 100.

The fewer natives an engine has, the bigger the gap. On Chrome 80 the two are level
(within noise), as expected when almost nothing is polyfilled.

## Real React app on BrowserStack (natives kept, medians, 2026-10-20)

Time to complete each operation. Lower is better.

| Op | Rows | Chrome 38: core-js | Chrome 38: spackle | Safari 7.1: core-js | Safari 7.1: spackle |
|---|---|---|---|---|---|
| create rows | 1000 | 1243 ms | 1171 ms | 495 ms | 213 ms |
| create many rows | 10000 | 19384 ms | 15349 ms | 4107 ms | 4088 ms |
| replace all rows | 1000 | 1252 ms | 1039 ms | 385 ms | 327 ms |
| clear rows | 1000 | 72 ms | 131 ms | 106 ms | 109 ms |
| **Sum** | | **21951 ms** | **17690 ms (−19%)** | **5093 ms** | **4737 ms (−7%)** |

- On the real Chrome 38 engine, spackle is about 20% faster in the React app. Fauxmium's Chrome 41 had them level.
- Chrome 38 `clear rows` is the one place spackle is slower: +59 ms on a 72 ms op.
- Safari 7.1 `create rows` (2.3×) is noisy: core-js's minimum was 180 ms.

## React app traces (fauxmium, 128 MB heap, 120% CPU throttle, 2026-10-20)

| Engine | Library | GCs | GC pause | Heap median | Heap after full GC (median) |
|---|---|---|---|---|---|
| Chrome 44 | core-js | 120 | 752 ms | 28.8 MB | 36.7 MB |
| Chrome 44 | spackle | 99 | 646 ms | 23.4 MB | 28.5 MB (−22%) |
| Chrome 80 | core-js | 181 | 503 ms | 19.4 MB | 20.9 MB |
| Chrome 80 | spackle | 183 | 534 ms | 17.9 MB | 21.2 MB (level) |
| Chrome 56 | spackle only | 184 | 763 ms | 38.1 MB | 41.1 MB (no core-js pair) |

This matches the earlier picture: React is the main source of garbage. On old engines
spackle lowers the floor (heap −22%, 18% fewer GCs). On a modern engine they are level.

## Earlier GC captures

- Chrome 41, natives kept, /benchmark: spackle 74 GCs and 0.3 s of pause, against core-js 444 GCs and 1.2 s.
- Chrome 56: 2–2.7× less garbage. The React test was even.

## Caveats

- **Over-replacement.** Part of the core-js gap is how much it replaces (it swaps out
  native `concat` on Chrome 41), not only its helpers. Cite the twin test for "islands
  win", and core-js for "how big the gap is in practice".
- **Noise.** Single /speed runs swing ±30–100%. Use medians of 5 or more for public claims.
- **No TV hardware yet.** GC and heap numbers come from fauxmium. The /compare timings
  also come from real desktop engines on BrowserStack (Chrome 38/56/80, Safari 7.1). No
  real TV device has been run yet.
- **Known gaps.** WeakMap can't take frozen keys, and symbol weak keys are held strongly.
