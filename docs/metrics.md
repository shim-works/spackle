# Spackle performance

How Spackle compares with core-js 3.50, measured on 2026-10-30.

## How it was tested

An automated run in a custom emulator: real Chromium builds, the same engine a
webview embeds, driven by a script from Chromium 41 to 150, about every fifth
release. Every run had a 64 MB JavaScript heap and 80% of
one CPU core, in a fresh browser, two runs per test with the library order
swapped. Garbage collections come from V8's own log.

Raw data: [`results/webview-capture/`](../results/webview-capture/).

## Stress test

A loop that calls polyfilled built-ins the way a front-end framework does on
each render (`Object.assign`, `Array.from`, `Map`, `URL`, string and array
helpers), 2,000 passes. It measures what the polyfills cost, not whole-app speed.

| Chromium | Polyfill time | Garbage | Minor GCs | GC pause |
|---|---|---|---|---|
| 41 | 1.13 s vs 6.86 s | 175 vs 1151 MB | 39 vs 288 | 97 vs 597 ms |
| 45 | 0.57 s vs 3.21 s | 185 vs 1111 MB | 38 vs 274 | 67 vs 184 ms |
| 50 | 0.44 s vs 1.56 s | 141 vs 505 MB | 33 vs 121 | 41 vs 61 ms |
| 56 | 0.37 s vs 0.91 s | 168 vs 277 MB | 39 vs 66 | 49 vs 73 ms |
| 61 | 0.25 s vs 0.40 s | 128 vs 175 MB | 27 vs 41 | 39 vs 46 ms |
| 66 | 0.18 s vs 0.27 s | 117 vs 111 MB | 26 vs 31 | 18 vs 23 ms |
| 69 and later | level | level | level | level |

Spackle first, core-js second, median of two runs.

## Per-API test

Each polyfilled API called on its own and timed. Summed over all of them,
Spackle took 124 ms against core-js's 841 ms on Chromium 41, and 98 against
572 ms on Chromium 45. Level from 69. The per-API breakdown is in the README
and in `results.json`.

## React 19 app

A TV-style catalogue app walking 500 routes. React's own work dominates, so
this is the whole-app number: 19% faster on Chromium 41 (25.2 vs 31.0 s), 15%
on 45, 14% on 56, level from 61.

## `core-js/stable`

Everything was run against `core-js/stable`, the
entry most apps ship. The results were within run-to-run noise of the full
bundle, so the comparison holds either way.

## Real hardware

Spackle's verification suite has been run on almost every browser from
Chrome 38 and Safari 7.1 up, and Spackle has run on a range of real devices,
including smart TVs and set-top boxes. Those runs found the same pattern: the
oldest engines gain the most. They're not reported as numbers here because
they weren't measured under the same controlled conditions.
