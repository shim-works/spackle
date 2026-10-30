<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/shim-works/spackle@main/assets/spencer.svg" width="120" alt="Spencer, the Spackle mascot" />
</p>

<h1 align="center">Spackle</h1>

<p align="center"><strong>Polyfills for weak hardware.</strong></p>

<p align="center">
  Fast, lightweight polyfills built for smart TVs, set-top boxes and other resource-constrained devices.
</p>

<p align="center">
  <a href="#-installation">Install</a> &nbsp;·&nbsp;
  <a href="#-spackle-benchmarks">Benchmarks</a> &nbsp;·&nbsp;
  <a href="#%EF%B8%8F-migrating-from-core-js">Migrate</a> &nbsp;·&nbsp;
  <a href="#-project-status--notes">Status</a>
</p>

<br />

Spackle is a specialized polyfill library designed for environments where memory, garbage collection and execution time actually matter.

Unlike traditional polyfill libraries, every Spackle polyfill is a self-contained **island**. No deeply nested helper dependencies. No unnecessary allocation trees. Just the functionality each API needs.

The result: less garbage, less memory pressure and fewer stop-the-world pauses on constrained hardware.

<br />

---

## 📺 Hardware Validation

> **2017 LG Smart TV · webOS 3.5 (Chromium 38)**. Both results below are from the same physical TV.

### Application performance

**Measured using the SolidTV demo application.**

In the [SolidTV demo app](https://github.com/solid-tv/solid-demo-app), Spackle delivers substantial improvements over standard setups.

| Metric | Baseline | With Spackle | Improvement |
|---|---:|---:|---:|
| **Initial render** | 4.53 s | 1.03 s | **4.4× faster** |
| **Visually complete** | 5.64 s | 2.07 s | **2.7× faster** |
| **Frame rate** | 34.8 fps | 47.1 fps | **36% higher** |
| **Longest frame** | 3.32 s | 0.13 s | **~25× shorter** |

<sub>*Five-run medians.*</sub>

### Stress test

In addition to the controlled emulator benchmarks below, Spackle has been tested on real hardware.
Unlike the emulator tests, these measurements were collected directly from the device using its own performance trace via CDP.
Using 500 passes (the most a TV can run) over three runs, the emulator's stress test (see below) showed:

| Metric | Result |
|---|---:|
| **Garbage** | **~9× less** |
| **Garbage collections** | **~5× fewer** |
| **Peak heap** | **37% lower** |

<br />

---

## 🤔 Why Spackle?

Spackle takes a fundamentally different approach to polyfills.

Instead of pulling APIs through layers of shared helpers, each polyfill operates independently.

### 1. Islands by design

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/shim-works/spackle@main/assets/spackle-vs-core-js-nesting-example.gif" width="100%" alt="core-js pulls each API through a web of nested helper functions; each Spackle polyfill is one standalone island" />
</p>

Traditional polyfills can introduce deeply nested dependency trees. Spackle keeps each implementation self-contained and flat, avoiding unnecessary execution paths and allocations.

### 2. Less garbage. Less work.

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/shim-works/spackle@main/assets/spackle-vs-core-js-allocations.gif" width="100%" alt="Each core-js call leaves a tree of temporaries behind and the heap keeps filling up for garbage collection; Spackle's calls leave almost nothing" />
</p>

Every unnecessary allocation creates more work for the garbage collector.

Spackle minimizes temporary objects and intermediate allocations, helping keep memory pressure and GC activity down.

<br />

---

## 📊 Spackle Benchmarks

Spackle was evaluated against core-js across **24 Chromium webviews (spanning 41 to 150)**.
These tests isolate polyfill overhead and allow repeatable comparisons across legacy browser engines.
In legacy environments Spackle generates **up to 7× less garbage** for the collector.

On modern engines, Spackle steps aside and the two are level.

The performance gap holds against both `core-js/stable` and the full bundle.

### Benchmark methodology

The stress test: a render loop that repeatedly hammers polyfilled built-ins (`Object.assign`, `Array.from`, `Map`, `URL`, string and array helpers). Hundreds of calls are made per pass.

This is deliberately a worst-case scenario for a polyfill library: it measures what the polyfills themselves cost, rather than whole-application performance.

| Setting | Value |
|---|---|
| Webviews | 24 Chromium-based (41–150) |
| Heap | 64 MB |
| CPU | Single core |
| Passes | 2,000 |
| GC measurement | V8's own log |

### Chromium results

| Chromium | 41 | 45 | 50 | 56 | 61 | 69+ |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Polyfill time** | **6.1× less** | 5.6× less | 3.5× less | 2.5× less | 1.6× less | level |
| **Garbage** | **6.6× less** | 6.0× less | 3.6× less | 1.6× less | 1.4× less | level |
| **Minor GCs** | **7.4× fewer** | 7.2× fewer | 3.7× fewer | 1.7× fewer | 1.5× fewer | level |
| **GC pause time** | **6.2× less** | 2.7× less | 1.5× less | 1.5× less | 1.2× less | level |

<sub>*69 and later: level, both mostly step aside for native built-ins.*</sub>

### Polyfill general performance, on a couple of common hot paths

Average execution speed comparison over 10 function executions with a warmup.

| Chromium | 41 | 50 | 56 | 78 |
|---|:---:|:---:|:---:|:---:|
| `Object.assign` | **9.3×** | level | level | level |
| `Object.keys` | level | level | level | level |
| `Array.from` | **18.6×** | **3.3×** | level | level |
| `Array#includes` | **10.9×** | level | level | level |
| `Array#find` | **1.4×** | level | level | level |
| `String#padStart` | **7.3×** | **3.0×** | level | level |
| `Map` get/has | **2.8×** | level | level | level |
| `Set#has` | level | level | level | level |
| `Promise` chain | level | level | level | level |
| `new URL` | **29.4×** | **7.6×** | **4.5×** | level |
| `URLSearchParams` | **9.9×** | **8.3×** | **2.5×** | level |

<sub>*Each API was called 500 times in a row and timed.*</sub>

<br />

---

## 📥 Installation

```sh
npm install @shim-works/spackle
```

Import it once, **first**, before anything else in your app's entry file:

```js
import '@shim-works/spackle';
import App from './App';
```

It installs everything it needs as a side effect (no configuration or init calls required).

<br />

---

## ⚙️ Migrating from core-js

Spackle replaces `core-js`. Running both means paying for two sets of polyfills, and `core-js` will overwrite Spackle's optimizations.

### 1. Remove dependencies

```sh
npm uninstall core-js core-js-pure @babel/runtime-corejs3
```

Delete any explicit `import 'core-js/...'` or `import 'core-js/stable'` lines from your codebase.

### 2. Update bundler configs

> **Note:** Spackle handles **built-ins**, not syntax. **Ship ES5 to old engines**—your own code and packages still need transpiling down to your target using tools like Babel, SWC, or Vite.

#### Babel (`babel.config.js` / `.babelrc`)

```js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: { chrome: '38', safari: '7.1' },
      useBuiltIns: false, // <-- Turn off core-js injection
    }],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', { corejs: false }],
  ],
};
```

<sub>*(If you use async functions or generators, keep `regenerator-runtime`—it's a syntax helper, not a built-in polyfill).*</sub>

#### SWC (`.swcrc`)

```json
{
  "env": {
    "targets": "chrome 38, safari 7.1"
  }
}
```

<sub>*(Remove `"mode": "usage"` / `"mode": "entry"` and `"coreJs"` settings from your `env` config).*</sub>

#### Vite (`@vitejs/plugin-legacy`)

```js
legacy({
  targets: ['chrome >= 38', 'safari >= 7.1'],
  polyfills: false,
  modernPolyfills: false,
})
```

<br />

---

## 📝 Project Status & Notes

| | |
|---|---|
| **Status** | Alpha. The API is stable (one import, no config); internals are still being tuned. |
| **Targets** | Chrome 38+ and Safari 7.1+, including the webviews in smart TVs and set-top boxes. |
| **Coverage** | Matches or better than `core-js/stable`. Unfinished TC39 proposals from core-js's full bundle (like `Set.prototype.filter`) aren't included; use the standard Iterator helpers instead, e.g. `set.values().filter(fn)`. |
| **Spec compliance** | On test262-derived tests run in real browsers, Spackle is as compliant as core-js or better. Neither is fully spec compliant. |
| **Known gaps** | Safari 7.1 has some broken natives (being worked on).<br />`WeakMap` can't take frozen objects as keys. |

<br />

---

## 📄 License

[MIT](LICENSE)
