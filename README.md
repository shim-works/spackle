<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/shim-works/spackle@main/assets/spencer.svg" width="120" alt="Spencer, the spackle mascot">
</p>

<h1 align="center">spackle</h1>

<p align="center">Polyfills for weak hardware.</p>

Spackle is a polyfill library built for weak hardware: smart TVs, set-top boxes
and other low-powered devices.

Every polyfill is a self-contained "island" to stop deeply nested polyfill dependencies, which greatly reduces the amount of garbage created.
With Spackle, the garbage collector runs less often, which means less stop-the-world work for the device.

| Engine | vs core-js (128 MB max heap size, single thread) |
|---|---|
| Chrome 38 | ~8× faster |
| Safari 7.1 | ~4× faster |
| Chrome 41 | ~7× less garbage, ~6× fewer GCs, half the heap |
| Chrome 80 | same speed |

Measurements and method: [docs/metrics.md](docs/metrics.md).

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
init call.

### Or as a script tag

No bundler? Copy `dist/index.global.js` from the package (or `spackle.js` from
this repo) next to your app, and load it before anything else:

```html
<script src="spackle.js"></script>
<script src="app.js"></script>
```

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
  workers.
- **Ship ES5 to old engines.** spackle covers built-ins, not syntax. Your own
  code still needs transpiling down to your target with tools like babel.
- **Known limits** are listed in each module's source under "Known limitations"
  (for example: polyfilled symbols report `typeof` as `'object'`, since ES5
  can't add a primitive type).
- **Alpha.** The API is one import, but expect rough edges. Issues are welcome.

## License

MIT
