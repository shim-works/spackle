import { install as installJsonTag, isSupported as jsonTagSupported } from '../src/modules/es.json.to-string-tag.js';
import { install as installMathTag, isSupported as mathTagSupported } from '../src/modules/es.math.to-string-tag.js';
import { install as installReflectTag, isSupported as reflectTagSupported } from '../src/modules/es.reflect.to-string-tag.js';
import { symbolIsShimmed } from './engine-capabilities.js';

/**
 * test262-derived conformance suite for the three namespace-object
 * @@toStringTag islands.
 *
 * Cases hand-ported from tc39/test262 —
 *   test/built-ins/JSON/Symbol.toStringTag.js
 *   test/built-ins/Math/Symbol.toStringTag.js
 *   test/built-ins/Reflect/Symbol.toStringTag.js
 *
 * JSON, Math and Reflect are ordinary objects, not constructors, so the only
 * thing marking them is `@@toStringTag`. The spec pins the value and the
 * descriptor: writable false, enumerable false, configurable TRUE.
 *
 * All three no-op when the engine has no Symbol at all — there is no key to
 * attach to — which is why isSupported() reports true in that case rather than
 * failing. On a Symbol-shimmed engine the tag is a '@@' string key, so
 * Object.prototype.toString still cannot read it; only the property is
 * asserted here, and object-to-string coverage lives with es.object.to-string.
 */
describe('JSON / Math / Reflect @@toStringTag — test262 conformance', () => {
  const namespaces: [string, any, () => void, () => boolean][] = [
    ['JSON', JSON, installJsonTag, jsonTagSupported],
    ['Math', Math, installMathTag, mathTagSupported],
    ['Reflect', typeof Reflect !== 'undefined' ? Reflect : undefined, installReflectTag, reflectTagSupported],
  ];

  for (const [name, namespace, install, isSupported] of namespaces) {
    describe(name, () => {
      it('tags the namespace with its own name', () => {
        if (!namespace) return; // no Reflect on this engine; the island no-ops
        install();
        expect(namespace[Symbol.toStringTag]).toBe(name);
      });

      it('is non-writable, non-enumerable and configurable', () => {
        if (!namespace) return;
        install();
        const descriptor = Object.getOwnPropertyDescriptor(namespace, Symbol.toStringTag)!;
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBe(false);
        expect(descriptor.writable).toBeFalsy();
        // configurable so user code can still redefine it, matching the spec
        expect(descriptor.configurable).toBe(true);
      });

      it('reports supported once installed', () => {
        if (!namespace) return;
        install();
        expect(isSupported()).toBe(true);
      });

      /*
       * Object.prototype.toString reads @@toStringTag from a real symbol key.
       * A shimmed Symbol is a '@@' string, which native toString cannot see —
       * documented as unfixable in DESIGN.md, so this only runs where Symbol
       * is genuine.
       */
      it.skipIf(symbolIsShimmed())('makes Object.prototype.toString report [object ' + name + ']', () => {
        if (!namespace) return;
        install();
        expect(Object.prototype.toString.call(namespace)).toBe('[object ' + name + ']');
      });
    });
  }

  it('install is idempotent across repeated runs', () => {
    installJsonTag();
    installJsonTag();
    expect((JSON as any)[Symbol.toStringTag]).toBe('JSON');
  });
});
