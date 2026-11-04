# Changelog

All notable changes to `@shim-works/spackle`. Spackle is in alpha: anything may change between releases.

## [0.1.0-alpha.10] - 2026-11-04

### Changed
- New website at [spackle.samseabourn.com](https://spackle.samseabourn.com): test your own device, race Spackle against core-js, and read the paper. The npm homepage now points there.
- README links to the website and paper. The headline figure is now "up to 6.6× less garbage", matching the paper.

No runtime changes.

## [0.1.0-alpha.9] - 2026-10-30

### Removed
- The install trace added in alpha.6. Spackle no longer writes `[spackle]` lines to the console.

### Changed
- README rewritten with animated comparisons and a tidier metrics write-up.

## [0.1.0-alpha.8] - 2026-10-28

### Fixed
- `queueMicrotask` and promise scheduling now only reuse a real native `queueMicrotask` or `Promise`. Before, a setTimeout-based shim loaded ahead of Spackle could be picked up, which cost a timer tick per promise job.

## [0.1.0-alpha.7] - 2026-10-28

### Fixed
- Feature checks for `indexOf`, `lastIndexOf`, `reduce`, `reduceRight`, `slice` and `splice` could make Chrome 38 walk about 2³² indices, which hung or ran out of memory. The checks now return immediately on every engine.

### Changed
- `structuredClone` and typed arrays use the engine's own `Object.prototype.toString`, which old V8 can optimise, so they're faster on older engines.

## [0.1.0-alpha.6] - 2026-10-28

### Changed
- `queueMicrotask` wakes up on a native `Promise.then` where there is one, and falls back to `MutationObserver`, then `setTimeout`. This gives real microtask timing on more old WebKit builds, including webOS.

### Known issue
- This release (through alpha.8) logs an install trace to the console, added to debug Broadcom set-top boxes. It was removed in alpha.9.

## [0.1.0-alpha.5] - 2026-10-27

### Fixed
- A polyfilled `URLSearchParams` passed as a `fetch` or `Request` body was sent as `text/plain` and not as a form. It's now sent as a form, and a content-type set by the app is left alone.

### Changed
- More shared helpers were inlined into each polyfill: strings, `Symbol`, `WeakMap`, `WeakSet`, typed arrays, `URLSearchParams` and the `URL` parser's per-character loop. That means fewer calls and fewer allocations per call.

## [0.1.0-alpha.4] - 2026-10-26

### Changed
- Faster `Array.from`, with a fast path for plain arrays.
- Faster stable `Array.prototype.sort`: insertion sort for small lists, and no per-call closure.

### Fixed
- Native `Map`, `Set`, `WeakMap` and `WeakSet` on Chrome 38–48 and Safari 9 now get `Symbol.toStringTag` and `Symbol.species`, as they do with core-js.

## [0.1.0-alpha.3] - 2026-10-22

### Added
- Polyfills for `ArrayBuffer`, typed arrays, `DOMException` and `Reflect`.

### Changed
- Coverage aligned with `core-js/stable`.
- Much more complete `URL` parser.

### Fixed
- Many test262 failures, with a large new set of tests behind them.

## [0.1.0-alpha.2] - 2026-10-20

### Changed
- README wording.

## [0.1.0-alpha.1] - 2026-10-20

### Changed
- README image and metrics write-up.

## [0.1.0-alpha.0] - 2026-10-20

First public release: self-contained polyfills for older devices and WebViews (Chrome 38+, Safari 7.1+).

[0.1.0-alpha.10]: https://github.com/shim-works/spackle/compare/v0.1.0-alpha.9...v0.1.0-alpha.10
[0.1.0-alpha.9]: https://github.com/shim-works/spackle/compare/v0.1.0-alpha.8...v0.1.0-alpha.9
[0.1.0-alpha.8]: https://github.com/shim-works/spackle/compare/v0.1.0-alpha.7...v0.1.0-alpha.8
[0.1.0-alpha.7]: https://github.com/shim-works/spackle/compare/v0.1.0-alpha.6...v0.1.0-alpha.7
[0.1.0-alpha.6]: https://github.com/shim-works/spackle/compare/v0.1.0-alpha.5...v0.1.0-alpha.6
[0.1.0-alpha.5]: https://github.com/shim-works/spackle/compare/v0.1.0-alpha.4...v0.1.0-alpha.5
[0.1.0-alpha.4]: https://github.com/shim-works/spackle/compare/v0.1.0-alpha.3...v0.1.0-alpha.4
[0.1.0-alpha.3]: https://github.com/shim-works/spackle/compare/v0.1.0-alpha.2...v0.1.0-alpha.3
[0.1.0-alpha.2]: https://github.com/shim-works/spackle/compare/v0.1.0-alpha.1...v0.1.0-alpha.2
[0.1.0-alpha.1]: https://github.com/shim-works/spackle/compare/49a0c84...v0.1.0-alpha.1
[0.1.0-alpha.0]: https://github.com/shim-works/spackle/commit/49a0c84
