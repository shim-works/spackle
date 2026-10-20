import { install as installSelf, isSupported as selfSupported } from '../src/modules/web.self.js';

/**
 * Conformance suite for the `window.self` island.
 *
 * Not from test262 — `self` is HTML, not ECMA-262
 * (https://html.spec.whatwg.org/multipage/window-object.html#dom-self), so
 * there is no upstream tree to port. Cases derived from the spec text instead.
 *
 * The probe is behavioural rather than existence-based on purpose: some
 * embedded webviews expose a `self` that is not the global object, and an
 * existence check would accept it. The spec says `window.self === window`.
 *
 * No __polyfilled marker: the value IS the window object, so tagging it would
 * tag the global. Same reasoning as the Number constants.
 */
describe('self', () => {
  it('points at the global object', () => {
    installSelf();
    expect((window as any).self).toBe(window);
  });

  it('reports supported once installed', () => {
    installSelf();
    expect(selfSupported()).toBe(true);
  });

  it('reinstalls after self is pointed somewhere else', () => {
    const original = (window as any).self;
    try {
      // what a webview exposing a non-global `self` looks like
      (window as any).self = { notTheGlobal: true };
      expect(selfSupported()).toBe(false);

      installSelf();
      expect((window as any).self).toBe(window);
      expect(selfSupported()).toBe(true);
    } finally {
      (window as any).self = original;
    }
  });

  it('does not throw when self is a non-writable accessor', () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'self');
    try {
      Object.defineProperty(window, 'self', {
        get: function () {
          return { locked: true };
        },
        configurable: true,
      });
      // install swallows here: failing would abort every island after it
      expect(() => installSelf()).not.toThrow();
    } finally {
      if (descriptor) Object.defineProperty(window, 'self', descriptor);
      else delete (window as any).self;
    }
  });
});
