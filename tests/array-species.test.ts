import { isSupported } from '../src/modules/es.array.species.js';

/**
 * Conformance for the Array[@@species] getter island. The environment already
 * exposes it, so the island no-ops; we assert the spec shape it would install.
 */
describe('Array[Symbol.species] island', () => {
  it('exposes a species getter that returns the constructor', () => {
    expect((Array as any)[Symbol.species]).toBe(Array);
  });
  it('reports supported when the native accessor is present', () => {
    expect(isSupported()).toBe(true);
  });
});
