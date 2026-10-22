import { describe, expect, it } from 'vitest';
import { installMapExtensionsOnNative } from '../src/modules/es.map.js';
import { installSetExtensionsOnNative } from '../src/modules/es.set.js';

/**
 * Chrome 38's native Map and Set keep -0 as -0 (core-js's BUGGY_ZERO). Modern
 * engines normalise it, so a fake native with that bug stands in: raw keys,
 * SameValue lookups. The patch must make set/add store +0 and the lookups find
 * +0 for -0.
 */
const makeFake = (isMap: boolean): any => {
  const Fake: any = function (this: any) { this.k = []; this.v = []; };
  const at = (self: any, key: any) => { for (let i = 0; i < self.k.length; i++) if (Object.is(self.k[i], key)) return i; return -1; };
  Fake.prototype[isMap ? 'set' : 'add'] = function (this: any, key: any, value: any) {
    const i = at(this, key);
    if (i === -1) { this.k.push(key); this.v.push(isMap ? value : key); } else this.v[i] = isMap ? value : key;
    return this;
  };
  Fake.prototype.has = function (this: any, key: any) { return at(this, key) !== -1; };
  Fake.prototype.get = function (this: any, key: any) { const i = at(this, key); return i === -1 ? undefined : this.v[i]; };
  Fake.prototype['delete'] = function (this: any, key: any) { const i = at(this, key); if (i === -1) return false; this.k.splice(i, 1); this.v.splice(i, 1); return true; };
  Fake.prototype.forEach = function (this: any, fn: any) { for (let i = 0; i < this.k.length; i++) fn(this.v[i], this.k[i], this); };
  return Fake;
};

const withGlobal = (name: string, value: any, body: () => void) => {
  const saved = (window as any)[name];
  (window as any)[name] = value;
  try { body(); } finally { (window as any)[name] = saved; }
};

describe('Map and Set on a native that keeps -0', () => {
  it('Map: set stores +0, and -0 and +0 are one key', () => {
    const Fake = makeFake(true);
    withGlobal('Map', Fake, () => installMapExtensionsOnNative());
    const m = new Fake();
    m.set(-0, 'a');
    expect(Object.is(m.k[0], 0)).toBe(true);
    expect([m.get(0), m.get(-0), m.has(-0)]).toEqual(['a', 'a', true]);
    expect(m.set(0, 'b')).toBe(m);
    expect([m.k.length, m.get(-0)]).toEqual([1, 'b']);
    expect(m['delete'](-0)).toBe(true);
  });

  it('Set: add stores +0, and -0 finds it', () => {
    const Fake = makeFake(false);
    withGlobal('Set', Fake, () => installSetExtensionsOnNative());
    const s = new Fake();
    expect(s.add(-0)).toBe(s);
    expect(Object.is(s.k[0], 0)).toBe(true);
    expect([s.has(-0), s.has(0), s['delete'](-0)]).toEqual([true, true, true]);
  });
});
