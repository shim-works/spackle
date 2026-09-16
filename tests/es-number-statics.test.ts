import { isSupported as epsilonSupported } from '../src/modules/es.number.epsilon.js';
import { isSupported as maxSupported } from '../src/modules/es.number.max-safe-integer.js';
import { isSupported as minSupported } from '../src/modules/es.number.min-safe-integer.js';
import { isSupported as globalThisSupported } from '../src/modules/es.global-this.js';

/**
 * Conformance for the ES2015 Number constants + globalThis islands.
 * The natives are present in this environment, so isSupported() returns true
 * and nothing is patched; we assert the spec values the islands would install.
 */
describe('Number static constants', () => {
  it('Number.EPSILON is 2^-52', () => {
    expect(Number.EPSILON).toBe(2.220446049250313e-16);
    expect(epsilonSupported()).toBe(true);
  });

  it('Number.MAX_SAFE_INTEGER is 2^53 - 1', () => {
    expect(Number.MAX_SAFE_INTEGER).toBe(9007199254740991);
    expect(maxSupported()).toBe(true);
  });

  it('Number.MIN_SAFE_INTEGER is -(2^53 - 1)', () => {
    expect(Number.MIN_SAFE_INTEGER).toBe(-9007199254740991);
    expect(minSupported()).toBe(true);
  });
});

describe('globalThis', () => {
  it('exists and is self-referential', () => {
    expect(typeof globalThis).not.toBe('undefined');
    expect((globalThis as any).globalThis).toBe(globalThis);
    expect(globalThisSupported()).toBe(true);
  });
});
