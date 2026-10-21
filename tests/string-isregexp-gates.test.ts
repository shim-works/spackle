import { isSupported as startsWithSupported } from '../src/modules/es.string.starts-with.js';
import { isSupported as endsWithSupported } from '../src/modules/es.string.ends-with.js';
import { isSupported as includesSupported } from '../src/modules/es.string.includes.js';

// core-js's correctIsRegExpLogic, applied to the three gates
describe('startsWith / endsWith / includes gates', () => {
  const cases: Array<[string, () => boolean]> = [
    ['startsWith', startsWithSupported],
    ['endsWith', endsWithSupported],
    ['includes', includesSupported],
  ];

  for (const [name, gate] of cases) {
    it(`${name}: keeps a native that reads @@match`, () => {
      expect(gate()).toBe(true);
    });

    it(`${name}: replaces a native that refuses every RegExp, @@match or not (Chrome 41)`, () => {
      const SP: any = String.prototype;
      const saved = Object.getOwnPropertyDescriptor(SP, name)!;
      const native = saved.value;
      try {
        Object.defineProperty(SP, name, {
          value: function (this: any, search: any) {
            if (Object.prototype.toString.call(search) === '[object RegExp]') throw new TypeError('no RegExp');
            return native.apply(this, arguments);
          },
          writable: true,
          configurable: true,
        });
        expect(gate()).toBe(false);
      } finally {
        Object.defineProperty(SP, name, saved);
      }
    });
  }
});
