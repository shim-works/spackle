import { describe, expect, it } from 'vitest';
import { Reflect as ReflectPolyfill } from '../src/modules/_reflect-impl.js';
import { install as installIteratorImpl } from '../src/modules/_iterator-impl.js';

/**
 * Nothing that walks a prototype chain may loop forever.
 *
 * Safari 7.1 hung on /verify with no error, which is the signature of an
 * unbounded walk. installIteratorExtensionsOnNative() re-parents native iterator prototypes,
 * and on engines predating Object.setPrototypeOf it falls back to
 * `__proto__ =` -- whose cycle behaviour is the engine's business, not ours. If
 * a cycle ever lands, every getPrototypeOf loop in the program spins and the
 * page dies silently.
 *
 * So the walks are step-capped, and these tests build a real cycle to prove it.
 * Each has a timeout: a regression must FAIL, not hang the suite.
 */

/*
 * A chain with no end.
 *
 * Node refuses to BUILD a cycle -- both setPrototypeOf and `__proto__ =` throw
 * -- so a cycle test here would pass by doing nothing. A Proxy whose
 * getPrototypeOf trap hands back a fresh proxy every time is the same thing
 * from the walker's point of view: getPrototypeOf never returns null. If the
 * walk is uncapped this hangs, which is exactly the Safari 7.1 symptom.
 */
const endlessChain = (): any => {
  const handler: any = {
    getPrototypeOf: function () {
      return new Proxy({}, handler);
    },
  };
  return new Proxy({}, handler);
};

describe('prototype walks are bounded', () => {
  it('Reflect gives up on an endless chain instead of spinning', { timeout: 2000 }, () => {
    const endless = endlessChain();
    // undefined is the honest answer for "no such property"; a hang is not.
    expect(ReflectPolyfill.get(endless, 'nothing-here')).toBeUndefined();
    expect(ReflectPolyfill.getOwnPropertyDescriptor(endless, 'nothing-here')).toBeUndefined();
  });

  it('the splice pass leaves every chain terminating', { timeout: 2000 }, () => {
    installIteratorImpl();

    const walk = (value: any): number => {
      let current = value;
      let steps = 0;
      while (current !== null && current !== undefined) {
        if (++steps > 200) return -1; // a cycle, or a chain nobody should have
        current = Object.getPrototypeOf(current);
      }
      return steps;
    };

    const samples: any[] = [
      ([] as any)[Symbol.iterator](),
      ([] as any).values(),
      ('' as any)[Symbol.iterator](),
      new Map()[Symbol.iterator](),
      new Set()[Symbol.iterator](),
      Object.prototype,
    ];
    for (const sample of samples) {
      expect(walk(sample)).toBeGreaterThan(0);
    }
  });

  it('a prototype that cannot be re-pointed is left exactly as it was', { timeout: 2000 }, () => {
    // Frozen prototypes are the other engine-dependent path through setProtoOf.
    const frozen = Object.freeze({ next: function () {} });
    const before = Object.getPrototypeOf(frozen);
    installIteratorImpl();
    expect(Object.getPrototypeOf(frozen)).toBe(before);
  });
});
