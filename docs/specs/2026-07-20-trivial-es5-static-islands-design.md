# Design: trivial ES5-static islands (first new-island batch)

**Date:** 2026-07-20
**Status:** approved, implementing

## Context

spackle registers 185 core-js module ids for `chrome 38, safari 7`; core-js would
inject 287 es/web. After the bucket-A pass, 103 es/web ids remain — of which ~92 have
no `the prior implementation` implementation and must be authored as new islands to
`/Users/samseabourn/Projects/polyfill`'s Module Guidelines. This is the first batch:
the 11 that are ES5-static and highest-value.

Wiring is already in place: all 11 ids are mapped in the vendored
`src/built-in-definitions.ts` (global/static/instance shapes), so no provider or
definition edits are needed. Modules are hand-authored directly in `src/modules/`
(no origin source, so `scripts/generate-modules.mjs` is not involved);
`scripts/regenerate-registry.mjs` picks them up into `module-registry.ts` + `stable.ts`.

## Scope — 11 modules, two classes

**Pure gaps (6)** — absent or constant on the floor, plain native-first install:
- `es.global-this` → `window.globalThis = window` when absent. `__polyfilled` marker.
- `es.number.epsilon` → `Number.EPSILON = 2.220446049250313e-16`. Inline constant, **no marker**.
- `es.number.max-safe-integer` → `9007199254740991`. Inline constant, no marker.
- `es.number.min-safe-integer` → `-9007199254740991`. Inline constant, no marker.
- `es.date.to-iso-string` → `Date.prototype.toISOString` spec impl. Marker.
- `es.date.to-json` → `Date.prototype.toJSON` (returns null for non-finite, else `toISOString()`). Marker.

**Behavioral fills (5)** — method exists in range; probe mirrors core-js's `FORCED`
boolean exactly (run the native on known-buggy inputs), patches only when buggy:
- `es.parse-int` → global `parseInt`. Probe: `parseInt(ws+'08')!==8 || parseInt(ws+'0x16')!==22`. Impl: inlined trim + radix/hex handling.
- `es.parse-float` → global `parseFloat`. Probe: `1/parseFloat(ws+'-0')!==-Infinity`. Impl: inlined trim + `-0` preservation.
- `es.number.to-fixed` → `Number.prototype.toFixed`. Probe: fails on `0.00008.toFixed(3)`/`0.9.toFixed(0)`/`1.255.toFixed(2)`/big-int. Impl: core-js integer-array algorithm, inlined.
- `es.number.to-exponential` → `Number.prototype.toExponential`. Probe: rounding + non-finite-this. Impl: core-js algorithm, inlined (`log10`, `repeat`).
- `es.number.to-precision` → `Number.prototype.toPrecision`. Probe: `toPrecision(1,undefined)!=='1'` + non-number-this. Impl: thin wrapper over native (core-js's own impl is a wrapper).

## Island contract (per the guide)

Each file: `export isSupported()` → `export <impl>` → gated install + `__polyfilled`
(except primitive constants). Self-contained — **no imports of other islands**;
`trim`/`repeat`/`toIntegerOrInfinity`/`log10`/`thisNumberValue` are inlined ES5-safe
helpers, native-first where a native exists. Header = `Spec:` link + `Based on:
core-js <module>` provenance + `Known limitations:` when real. `whitespaces` constant
inlined from core-js. Probes lead with a one-line `//` explaining existence vs behavioral.

Install idioms:
- globals (`globalThis`, `parseInt`, `parseFloat`): `window.X = impl; window.X.__polyfilled = true` under the gate (plain add/replace, no null/delete needed — not constructors).
- statics (`Number.EPSILON` etc.): `Number.EPSILON = <value>` inline constant, no marker.
- prototype methods (`Date.prototype.toISOString`, `Number.prototype.toFixed`, …): `Proto.method = impl; (Proto.method).__polyfilled = true`.

## Tests

New vitest suites in `tests/` (no origin test262 to port), matching existing globals
style: constant values + non-writability intent, `globalThis` identity, `parseInt`
octal/hex/whitespace, `parseFloat` `-0`, `toFixed` the four core-js rounding cases,
`toExponential`/`toPrecision` spot checks + `RangeError` on bad fractionDigits, Date
methods incl. `toJSON(NaN) === null`.

## Verification

`node scripts/regenerate-registry.mjs` → `yarn lint` clean → `yarn build` clean →
`yarn test` (existing 1027 + new pass) → gap recount **103 → 92** → usage-global
spot-check injects `parseInt`, `globalThis`, `Number.EPSILON`, `n.toFixed()`,
`d.toISOString()`.

## Out of scope

The other ~81 feasible es/web ids (iterator helpers, Set methods, JSON, typed-array,
Uint8Array base64/hex, disposable stacks, ES5 array fills, Object accessors) — later
batches. ES5-infeasible ids and esnext remain permanent gaps.
