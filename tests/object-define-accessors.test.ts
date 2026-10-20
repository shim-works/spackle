import { objectDefineGetter } from '../src/modules/es.object.define-getter.js';
import { objectDefineSetter } from '../src/modules/es.object.define-setter.js';

/**
 * __defineGetter__ / __defineSetter__ (Annex B). Covers the path where
 * defineProperty throws: with no try/finally around it, the next call must
 * still install its own accessor, not a leftover.
 */
describe('__defineGetter__ / __defineSetter__', () => {
  it('installs a getter and a setter', () => {
    const o: any = {};
    let stored = 0;
    objectDefineGetter.call(o, 'x', () => 42);
    objectDefineSetter.call(o, 'y', (v: number) => { stored = v; });
    expect(o.x).toBe(42);
    o.y = 7;
    expect(stored).toBe(7);
  });

  it('throws on a non-configurable key, and the next call is unaffected', () => {
    const locked: any = {};
    Object.defineProperty(locked, 'x', { value: 1, configurable: false });
    expect(() => objectDefineGetter.call(locked, 'x', () => 2)).toThrow(TypeError);
    expect(() => objectDefineSetter.call(locked, 'x', () => {})).toThrow(TypeError);
    const o: any = {};
    objectDefineGetter.call(o, 'z', () => 'fresh');
    expect(o.z).toBe('fresh');
    expect(Object.getOwnPropertyDescriptor(o, 'z')!.set).toBe(undefined);
  });
});
