// Ported from: the prior implementation (structured-clone.ts + is-structured-clone-supported.ts)

// structuredClone — behavioral: a typeof check can't tell a real deep clone from
// a shallow stub. So we clone a nested object with a Date and confirm the copy is
// a genuinely separate tree (new references) with the Date preserved.
export const isSupported = (): boolean => {
  try {
    if (typeof (window as any).structuredClone !== 'function') {
      return false;
    }
    const source: any = { a: 1, nested: { b: 2 }, when: new Date(0) };
    const copy = (window as any).structuredClone(source);
    // new top-level ref, new nested ref, values intact, Date still a Date
    return (
      copy !== source &&
      copy.nested !== source.nested &&
      copy.a === 1 &&
      copy.nested.b === 2 &&
      copy.when instanceof Date &&
      copy.when.getTime() === 0
    );
  } catch {
    return false;
  }
};

export const isStructuredCloneSupported = isSupported;

/**
 * Spec: https://html.spec.whatwg.org/multipage/structured-data.html#structuredclone
 * Inspired by: @ungap/structured-clone (ungap / WebReflection)
 */
import ungapStructuredClone from '@ungap/structured-clone';

export const structuredClone = function (value: any, options?: any): any {
  return ungapStructuredClone(value, options);
};

if (!isSupported()) {
  (window as any).structuredClone = null;
  delete (window as any).structuredClone;
  Object.defineProperty((window as any), 'structuredClone', { value: structuredClone, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).structuredClone, 'name', { value: 'structuredClone', configurable: true });
  Object.defineProperty((window as any).structuredClone, '__polyfilled', { value: true });
}
