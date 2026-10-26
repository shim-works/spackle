<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/shim-works/spackle@main/assets/spencer.svg" width="120" alt="Spencer, the spackle mascot" />
</p>

<h1 align="center">spackle</h1>

<p align="center"><strong>Polyfills for weak hardware.</strong></p>

Spackle is a specialized polyfill library built for low-powered devices like smart TVs and set-top boxes. 

Unlike traditional polyfill libraries every Spackle polyfill is a self-contained **island**. This eliminates deeply nested dependencies, dramatically reducing garbage collection overhead, memory pressure, and stop-the-world pauses on constrained hardware.

---

## 🚀 Real-World Impact (SolidTV Demo)

In the [SolidTV demo app](https://github.com/solid-tv/solid-demo-app) (5-run averages on low-spec hardware), Spackle radically improves performance over standard setups:

| Metric | Baseline | With Spackle | Improvement |
|---|---|---|---|
| **Initial render** | 4.53 s | 1.03 s | **4.4× faster** |
| **Visually complete** | 5.64 s | 2.07 s | **2.7× faster** |
| **Frame rate** | 34.8 fps | 47.1 fps | **36% higher** |
| **Longest frame** | 3.32 s | 0.13 s | **~25× shorter** |

---

## 📊 Benchmarks vs. core-js

On old engines, Spackle runs simulated workloads **4–8× faster** with a fraction of the garbage. On modern engines (like Chrome 80) where little needs polyfilling, performance matches parity.

### Engine Performance & Memory Overview

| Engine | Workload / Context | Performance (vs core-js) | Memory & Garbage Collection |
|---|---|---|---|
| **Chrome 38** | Simulated front-end loop | ~8× faster | — |
| **Safari 7.1** | Simulated front-end loop | ~4× faster | — |
| **Chrome 41** | Emulator | ~6.8× faster | ~7× less garbage, ~6.1× fewer GCs, half the peak heap |
| **2017 LG Smart TV** | webOS 3.5+ | ~7× faster | ~9× less garbage, ~5× fewer GCs, 37% lower peak heap |
| **Chrome 80** | Modern baseline | Same speed | — |

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

---

## ⚙️ Migrating from core-js

Spackle replaces `core-js`. Running both means paying for two sets of polyfills, and `core-js` will overwrite Spackle's optimizations. 

### 1. Remove Dependencies
```sh
npm uninstall core-js core-js-pure @babel/runtime-corejs3
```
Delete any explicit `import 'core-js/...'` or `import 'core-js/stable'` lines from your codebase.

### 2. Update Bundler Configs

> **Note:** Spackle handles **built-ins**, not syntax. **Ship ES5 to old engines**—your own code and packages still need transpiling down to your target using tools like Babel, SWC, or Vite.

#### **Babel** (`babel.config.js` / `.babelrc`)
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
*(If you use async functions or generators, keep `regenerator-runtime`—it's a syntax helper, not a built-in polyfill).*

#### **SWC** (`.swcrc`)
```json
{
  "env": {
    "targets": "chrome 38, safari 7.1"
  }
}
```
*(Remove `"mode": "usage"` / `"mode": "entry"` and `"coreJs"` settings from your `env` config).*

#### **Vite** (`@vitejs/plugin-legacy`)
```js
legacy({
  targets: ['chrome >= 38', 'safari >= 7.1'],
  polyfills: false,
  modernPolyfills: false,
})
```

---

## 📝 Project Status & Notes
* **Coverage:** Core-js parity (or better).
* **Known Gaps:** Safari 7.1 currently has some broken natives (being addressed).
* **Scope:** Tested successfully against target legacy environments (Chrome 38 / Safari 7.1 up to modern baselines).

---

## License

[MIT](LICENSE)