/**
 * A tiny vitest-shaped test runner, so the existing suite can run in a real
 * browser — including one far too old for vitest, Playwright, or ESM.
 *
 * This exists because every one of spackle's ~1300 tests currently runs in
 * jsdom or Node. jsdom is a DOM *shim*: it cannot exhibit the engine quirks the
 * polyfills are written for (Safari 12's broken `reverse`, Safari <=15.4's
 * non-writable `length`), so a green suite says nothing about whether any of
 * this works on the Chrome 38 / Safari 7.1 floor. Bundled to ES5, this file
 * plus the suite is something you can actually open on an old device or a
 * BrowserStack session.
 *
 * Only the matchers the suite genuinely uses are implemented — verified by
 * grepping tests/ rather than guessed at.
 */

interface Test {
  name: string;
  fn: () => any;
}

const suites: { name: string; tests: Test[] }[] = [];
let current: { name: string; tests: Test[] } | null = null;

const show = (value: any): string => {
  try {
    if (typeof value === 'string') return JSON.stringify(value);
    if (value === undefined) return 'undefined';
    if (typeof value === 'function') return 'function ' + (value.name || '(anonymous)');
    if (typeof value === 'object' && value !== null) {
      const json = JSON.stringify(value);
      return json === undefined ? typeOf(value) : json;
    }
    // distinguish -0 from 0, which is load-bearing in several suites
    if (value === 0 && 1 / value === -Infinity) return '-0';
    return String(value);
  } catch {
    return typeOf(value);
  }
};

export const describe = (name: string, fn: () => void): void => {
  const parent = current;
  const suite = { name: parent ? parent.name + ' > ' + name : name, tests: [] as Test[] };
  suites.push(suite);
  current = suite;
  try {
    fn();
  } finally {
    current = parent;
  }
};

export const it: any = (name: string, fn: () => any): void => {
  if (!current) {
    current = { name: '(root)', tests: [] };
    suites.push(current);
  }
  current.tests.push({ name: name, fn: fn });
};

/**
 * vitest's table-driven form: `it.each(cases)('name %p', (a, b) => …)`.
 * Ten suites use it. Placeholders are substituted positionally; vitest supports
 * several and treats them near-identically for these cases, so they all render
 * the argument.
 */
it.each = (cases: any[]) => (name: string, fn: (...args: any[]) => any): void => {
  for (let i = 0; i < cases.length; i++) {
    const args: any[] = Object.prototype.toString.call(cases[i]) === '[object Array]'
      ? cases[i]
      : [cases[i]];
    let cursor = 0;
    const label = String(name).replace(/%[psidjfo#]/g, () => show(args[cursor++]));
    (function (boundArgs) {
      it(label, function () {
        return fn.apply(null, boundArgs);
      });
    })(args);
  }
};

const typeOf = (value: any): string => Object.prototype.toString.call(value);

const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  // NaN
  if (a !== a && b !== b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }
  if (typeOf(a) !== typeOf(b)) return false;

  const aIsArrayLike = typeof a.length === 'number' && typeOf(a) !== '[object Object]';
  if (aIsArrayLike) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (let i = 0; i < aKeys.length; i++) {
    const key = aKeys[i];
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
};

const fail = (message: string): never => {
  throw new Error(message);
};

const makeMatchers = (actual: any, negated: boolean): any => {
  const check = (ok: boolean, message: string): void => {
    if (negated ? ok : !ok) {
      fail((negated ? 'expected NOT: ' : 'expected: ') + message);
    }
  };
  return {
    toBe(expected: any) {
      // Object.is semantics, so -0 !== 0 and NaN === NaN, matching vitest
      const same =
        actual === expected
          ? actual !== 0 || 1 / actual === 1 / expected
          : actual !== actual && expected !== expected;
      check(same, show(actual) + ' to be ' + show(expected));
    },
    toEqual(expected: any) {
      check(deepEqual(actual, expected), show(actual) + ' to deeply equal ' + show(expected));
    },
    toThrow(expected?: any) {
      let threw = false;
      let error: any;
      try {
        actual();
      } catch (caught) {
        threw = true;
        error = caught;
      }
      if (negated) {
        if (threw) fail('expected NOT to throw, but threw ' + show(error && error.message));
        return;
      }
      if (!threw) fail('expected to throw, but did not');
      if (expected === undefined) return;
      if (typeof expected === 'function') {
        if (!(error instanceof expected)) {
          fail('expected to throw ' + (expected.name || 'that error') + ', got ' + show(error));
        }
        return;
      }
      const message = error && error.message ? String(error.message) : String(error);
      if (message.indexOf(String(expected)) === -1) {
        fail('expected message to contain ' + show(expected) + ', got ' + show(message));
      }
    },
    toBeNaN() {
      check(actual !== actual, show(actual) + ' to be NaN');
    },
    toBeCloseTo(expected: number, digits?: number) {
      const precision = digits === undefined ? 2 : digits;
      const ok = Math.abs(actual - expected) < Math.pow(10, -precision) / 2;
      check(ok, show(actual) + ' to be close to ' + show(expected));
    },
    toContain(expected: any) {
      let found = false;
      if (typeof actual === 'string') {
        found = actual.indexOf(expected) !== -1;
      } else if (actual && typeof actual.length === 'number') {
        for (let i = 0; i < actual.length; i++) {
          if (actual[i] === expected) {
            found = true;
            break;
          }
        }
      }
      check(found, show(actual) + ' to contain ' + show(expected));
    },
    toHaveLength(expected: number) {
      check(actual != null && actual.length === expected,
        show(actual) + ' to have length ' + expected);
    },
    toBeUndefined() {
      check(actual === undefined, show(actual) + ' to be undefined');
    },
    toBeNull() {
      check(actual === null, show(actual) + ' to be null');
    },
    toBeDefined() {
      check(actual !== undefined, show(actual) + ' to be defined');
    },
    toBeInstanceOf(expected: any) {
      check(actual instanceof expected, show(actual) + ' to be instance of ' + expected.name);
    },
    toBeGreaterThan(expected: number) {
      check(actual > expected, show(actual) + ' to be greater than ' + expected);
    },
    toBeLessThanOrEqual(expected: number) {
      check(actual <= expected, show(actual) + ' to be <= ' + expected);
    },
  };
};

export const expect = (actual: any): any => {
  const matchers = makeMatchers(actual, false);
  matchers.not = makeMatchers(actual, true);
  // `await expect(promise).resolves.toEqual(x)` — the thenable forms
  // Every matcher is reachable through .resolves / .rejects, rather than the
  // handful that happened to be used first -- a missing one fails as
  // "not a function", which reads like a product bug and isn't.
  const settled = (wantRejection: boolean): any => {
    const forward: any = {};
    const names = [
      'toBe', 'toEqual', 'toThrow', 'toBeNaN', 'toBeCloseTo', 'toContain',
      'toHaveLength', 'toBeUndefined', 'toBeNull', 'toBeDefined',
      'toBeInstanceOf', 'toBeGreaterThan', 'toBeLessThanOrEqual',
    ];
    for (let i = 0; i < names.length; i++) {
      (function (matcher) {
        forward[matcher] = function (expected?: any) {
          return Promise.resolve(actual).then(
            function (value: any) {
              if (wantRejection) fail('expected promise to reject, but it resolved');
              return (makeMatchers(value, false) as any)[matcher](expected);
            },
            function (error: any) {
              if (!wantRejection) throw error;
              // `.rejects.toThrow(X)` inspects the rejection reason as a throw;
              // every other matcher inspects the reason as a value
              const subject = matcher === 'toThrow'
                ? function () { throw error; }
                : error;
              return (makeMatchers(subject, false) as any)[matcher](expected);
            },
          );
        };
      })(names[i]);
    }
    return forward;
  };
  matchers.resolves = settled(false);
  matchers.rejects = settled(true);
  return matchers;
};

export interface Results {
  passed: number;
  failed: number;
  failures: string[];
}

/**
 * Run everything. Returns a promise because ~10 suites are async.
 */
export const run = (): Promise<Results> => {
  const failures: string[] = [];
  let passed = 0;
  let failed = 0;

  const flat: { label: string; fn: () => any }[] = [];
  for (let s = 0; s < suites.length; s++) {
    for (let t = 0; t < suites[s].tests.length; t++) {
      flat.push({
        label: suites[s].name + ' > ' + suites[s].tests[t].name,
        fn: suites[s].tests[t].fn,
      });
    }
  }

  let index = 0;
  const step = (): any => {
    if (index >= flat.length) return { passed: passed, failed: failed, failures: failures };
    const entry = flat[index++];
    return Promise.resolve()
      .then(entry.fn)
      .then(
        () => {
          passed++;
        },
        (error: any) => {
          failed++;
          failures.push(entry.label + '\n    ' + (error && error.message ? error.message : String(error)));
        },
      )
      .then(step);
  };
  return Promise.resolve().then(step);
};

/** Render to the page, so this is readable on a device with no devtools. */
export const render = (results: Results): void => {
  if (typeof document === 'undefined') return;
  const lines = [
    'spackle — ' + results.passed + ' passed, ' + results.failed + ' failed',
    '',
  ].concat(results.failures);
  const pre = document.createElement('pre');
  pre.style.cssText = 'font:12px/1.5 monospace;white-space:pre-wrap;padding:12px';
  pre.appendChild(document.createTextNode(lines.join('\n')));
  if (document.body) document.body.appendChild(pre);
};
