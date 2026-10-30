# Spackle performance

How Spackle compares with core-js 3.50, measured on 2026-10-30.

<br />

---

## 🧪 How it was tested

An automated run in a custom emulator: real Chromium builds, the same engine a
webview embeds, driven by a script from Chromium 41 to 150, about every fifth
release. Every run had a 64 MB JavaScript heap and 80% of
one CPU core, in a fresh browser, two runs per test with the library order
swapped. Garbage collections come from V8's own log.

Raw data: [`results/webview-capture/`](../results/webview-capture/).

<br />

---

## 🔥 Stress test

A loop that calls polyfilled built-ins the way a front-end framework does on
each render (`Object.assign`, `Array.from`, `Map`, `URL`, string and array
helpers), 2,000 passes. It measures what the polyfills cost, not whole-app speed.

| Chromium | Time · Spackle | Time · core-js | Garbage · Spackle | Garbage · core-js | Minor GCs · Spackle | Minor GCs · core-js | GC pause · Spackle | GC pause · core-js |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 41 | **1.13 s** | 6.86 s | **175 MB** | 1151 MB | **39** | 288 | **97 ms** | 597 ms |
| 45 | **0.57 s** | 3.21 s | **185 MB** | 1111 MB | **38** | 274 | **67 ms** | 184 ms |
| 50 | **0.44 s** | 1.56 s | **141 MB** | 505 MB | **33** | 121 | **41 ms** | 61 ms |
| 56 | **0.37 s** | 0.91 s | **168 MB** | 277 MB | **39** | 66 | **49 ms** | 73 ms |
| 61 | **0.25 s** | 0.40 s | **128 MB** | 175 MB | **27** | 41 | **39 ms** | 46 ms |
| 66 | **0.18 s** | 0.27 s | **117 MB** | 111 MB | **26** | 31 | **18 ms** | 23 ms |
| 69 and later | level | level | level | level | level | level | level | level |

<sub>*Median of two runs.*</sub>

<br />

---

## 🔬 Per-API test

Each polyfilled API called on its own and timed. Summed over all of them,
Spackle took 124 ms against core-js's 841 ms on Chromium 41, and 98 against
572 ms on Chromium 45. Level from 69. The per-API breakdown is in the README
and in `results.json`.

<br />

---

## ⚛️ React 19 app

A TV-style catalogue app walking 500 routes. React's own work dominates, so
this is the whole-app number: 19% faster on Chromium 41 (25.2 vs 31.0 s), 15%
on 45, 14% on 56, level from 61.

<br />

---

## 📦 `core-js/stable`

Everything was run against `core-js/stable`, the
entry most apps ship. The results were within run-to-run noise of the full
bundle, so the comparison holds either way.

<br />

---

## 📺 Real hardware

Spackle's verification suite has been run on almost every browser from
Chrome 38 and Safari 7.1 up, and Spackle has run on a range of real devices,
including smart TVs and set-top boxes. Those runs found the same pattern: the
oldest engines gain the most. They're not reported as numbers here because
they weren't measured under the same controlled conditions.
