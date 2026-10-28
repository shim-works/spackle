import { isSupported as isLastIndexOfSupported } from '../src/modules/es.array.last-index-of.js';
import { isSupported as isIndexOfSupported } from '../src/modules/es.array.index-of.js';
import { isSupported as isSliceSupported } from '../src/modules/es.array.slice.js';
import { isSupported as isSpliceSupported } from '../src/modules/es.array.splice.js';
import { isSupported as isReduceRightSupported } from '../src/modules/es.array.reduce-right.js';

/**
 * The ToLength probes must never walk, whatever an engine does with the length.
 * The Foxtel box (WPE, mipsel) spent ~15 minutes in the old lastIndexOf probe
 * ({ length: 2^32+1 }): a C++ double -> unsigned cast saturates on MIPS, so the
 * native walked down from ~2^31. Each fake below reads `length` one way, walks
 * per the spec, and flags a hang past 1000 steps (isSupported swallows throws).
 */
const LIMIT = 1000;
let hung = false;
const tick = (steps: number): void => {
  if (steps > LIMIT) {
    hung = true;
    throw new Error('would hang');
  }
};

type ToLen = (n: any) => number;
const models: Record<string, { toLen: ToLen; keep: boolean | null }> = {
  // the box and every modern engine: keep the native, like core-js
  toLength: { toLen: (n) => { n = +n; return n !== n || n <= 0 ? 0 : Math.min(Math.floor(n), 9007199254740991); }, keep: true },
  // Chrome < 45: replace
  toUint32: { toLen: (n) => n >>> 0, keep: false },
  // raw casts on MIPS: either decision is fine, as long as it doesn't walk
  saturateLow: { toLen: (n) => { n = +n; return n !== n || n <= 0 ? 0 : n > 4294967295 ? 2147483647 : Math.floor(n); }, keep: null },
  saturateHigh: { toLen: (n) => { n = +n; return n !== n ? 0 : n < 0 ? 4294967295 : n > 4294967295 ? 4294967295 : Math.floor(n); }, keep: null },
};

const fakes: Record<string, (toLen: ToLen) => any> = {
  lastIndexOf: (toLen) => function (this: any, search: any): number {
    if (this == null) throw new TypeError('null this');
    let steps = 0;
    for (let i = toLen(this.length) - 1; i >= 0; i--) {
      tick(++steps);
      if (i in this && this[i] === search) return i + 0;
    }
    return -1;
  },
  indexOf: (toLen) => function (this: any, search: any, from: any): number {
    const len = toLen(this.length);
    let steps = 0;
    for (let i = Math.floor(+from || 0); i < len; i++) {
      tick(++steps);
      if (i in this && this[i] === search) return i + 0;
    }
    return -1;
  },
  slice: (toLen) => function (this: any, start: any): any[] {
    const len = toLen(this.length);
    const out: any[] = [];
    let steps = 0;
    for (let i = Math.min(Math.floor(+start), len); i < len; i++) {
      tick(++steps);
      if (i in this) out[out.length] = this[i];
    }
    return out;
  },
  splice: (toLen) => function (this: any, start: any, deleteCount: any): any[] {
    const len = toLen(this.length);
    const k = Math.min(Math.floor(+start), len);
    const n = Math.min(deleteCount, len - k);
    const out: any[] = [];
    let steps = 0;
    for (let i = 0; i < n; i++) {
      tick(++steps);
      if (k + i in this) out[out.length] = this[k + i];
    }
    this.length = len - n;
    return out;
  },
  reduceRight: (toLen) => function (this: any, callback: any, initial: any): any {
    if (this == null) throw new TypeError('null this');
    let acc = initial;
    let steps = 0;
    for (let i = toLen(this.length) - 1; i >= 0; i--) {
      tick(++steps);
      if (i in this) acc = callback(acc, this[i], i, this);
    }
    return acc;
  },
};

const probes: Record<string, () => boolean> = {
  lastIndexOf: isLastIndexOfSupported,
  indexOf: isIndexOfSupported,
  slice: isSliceSupported,
  splice: isSpliceSupported,
  reduceRight: isReduceRightSupported,
};

describe('ToLength probes never walk', () => {
  for (const method of Object.keys(probes)) {
    for (const model of Object.keys(models)) {
      it(`${method}, ${model} native`, () => {
        const proto: any = Array.prototype;
        const saved = proto[method];
        hung = false;
        let kept: boolean;
        proto[method] = fakes[method](models[model].toLen);
        try {
          kept = probes[method]();
        } finally {
          proto[method] = saved;
        }
        expect(hung).toBe(false);
        if (models[model].keep !== null) expect(kept).toBe(models[model].keep);
      });
    }
  }

  it('keeps the real natives here', () => {
    for (const method of Object.keys(probes)) expect([method, probes[method]()]).toEqual([method, true]);
  });
});
