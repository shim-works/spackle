<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/shim-works/spackle@main/assets/spencer.svg" width="120" alt="Spencer, the spackle mascot">
</p>

<h1 align="center">spackle</h1>

<p align="center">Polyfills for weak hardware.</p>

Spackle is a polyfill library built for weak hardware: smart TVs, set-top boxes
and other low-powered devices.

Every polyfill is a self-contained "island" to stop deeply nested polyfill dependencies, which greatly reduces the amount of garbage created.
With Spackle, the garbage collector runs less often, which means less stop-the-world work for the device.

## Findings

On old engines, spackle ran the same app workload 4–8× faster than core-js and
made a fraction of the garbage, on a real TV, real old browsers and an emulator
capped at a 128 MB heap. On a modern engine, with little left to polyfill, the
two are level.

| Engine | spackle vs core-js (simulated front end workload in a loop) |
|---|---|
| Chrome 38 | ~8× faster |
| Safari 7.1 | ~4× faster |
| Chrome 41 | ~7× less garbage, ~6× fewer GCs, half the heap |
| LG UJ634 TV, 2017 (webOS 3.5, Chromium 38) | ~7× faster, ~9× less garbage, ~5× fewer GCs |
| Chrome 80 | same speed |

## Fewer garbage collections

The test is a loop that does what a front-end framework does on each render of
a 30-row list: props spread with `Object.assign`, keyed reconciliation with
`Map` and `Set`, class-name checks, `new URL` and `URLSearchParams` for routing,
and `Promise.allSettled` for data fetching. Each library runs it in its own
iframe, in random order, with a 30-second idle between them so the first
library's garbage is collected before the second starts. Every collection is
counted from the browser's own performance trace.

It runs on a real TV and on an emulator capped at a 128 MB heap:

| | core-js | spackle |
|---|---|---|
| **LG UJ634 TV (2017)**, 500 passes: time | 20.5 – 23.3 s | 2.9 – 3.3 s |
| garbage collections | 29 – 33 | 6 – 7 |
| garbage created | 205 – 276 MB | 23 – 58 MB |
| peak heap | 71.5 MB | 45.0 MB |
| **Chrome 41 emulator**, 5000 passes: time | 12.06 s | 1.77 s |
| garbage collections | 444 | 73 |
| total GC pause | 1287 ms | 290 ms |
| garbage created | 3.2 GB | 0.46 GB |

## Coverage

- **Aiming for the same coverage as core-js or better.**
- **Known gaps on Safari 7.1 (for now)**, where core-js does better:
  - `Array#find`, `findIndex`, `sort`, `keys` and `entries`: spackle keeps
    Safari's native versions, which mishandle holes, huge lengths, sort
    stability and iterator shape.
  - Typed array methods (`at`, `copyWithin`, `indexOf`, `map`, `find`, `sort`,
    `set`, `toReversed`, `from`, `of` and others) don't work on Safari's typed
    arrays.
  - `Math.imul.length` reads 1, not 2.
  - `structuredClone` clones DOM nodes instead of throwing `DataCloneError`.
- Everything else is covered as well as core-js or better.

## Install

```sh
npm install @shim-works/spackle
```

Import it once, **first**, before anything else in your app's entry file:

```js
import '@shim-works/spackle';
import App from './App';
```

It installs everything it needs as a side effect. There's no config and no
init call (for now at least).

## Remove core-js

spackle replaces core-js. Running both means paying for two sets of
polyfills, and core-js will overwrite spackle's. Remove core-js and turn off
anything that injects it.

**Dependencies**

```sh
npm uninstall core-js core-js-pure @babel/runtime-corejs3
```

Delete any `import 'core-js/...'` or `import 'core-js/stable'` lines.

**Babel** (`babel.config.js` / `.babelrc`)

```js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: { chrome: '38', safari: '7.1' },
      // useBuiltIns: 'usage' or 'entry', corejs: 3 <-- not this
      useBuiltIns: false,
    }],
  ],
  plugins: [
    // if you use transform-runtime, keep it for helpers only
    ['@babel/plugin-transform-runtime', { corejs: false }],
  ],
};
```

Babel still handles **syntax** (arrow functions, classes, async/await).
spackle handles the **built-ins**. If you use async functions or generators,
keep `regenerator-runtime`; it's a syntax helper, not a polyfill.

**SWC** (`.swcrc`)

```json
{
  "env": {
    "targets": "chrome 38, safari 7.1"
  }
}
```

Remove `"mode": "usage"` / `"mode": "entry"` and `"coreJs"` from `env`.

**Vite** (`@vitejs/plugin-legacy`)

```js
legacy({
  targets: ['chrome >= 38', 'safari >= 7.1'],
  polyfills: false,
  modernPolyfills: false,
})
```


## Important Notes

- **Browser only.** spackle expects `window`. It isn't meant for Node or web
  workers. It supports webviews based on Chrome 38+ and Safari 7.1+.
- **Ship ES5 to old engines.** spackle covers built-ins, not syntax. Your own
  code still needs transpiling down to your target with tools like [Babel](https://babeljs.io).
- **Known limits** are listed in each module's source under "Known limitations"
  (for example: polyfilled symbols report `typeof` as `'object'`, since ES5
  can't add a primitive type).
- **Alpha.** The API is one import, but expect rough edges. Issues are welcome.

## License

MIT
