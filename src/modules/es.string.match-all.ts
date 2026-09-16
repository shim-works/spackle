// Ported from: the prior implementation (string-match-all.ts + is-string-match-all-supported.ts)

// String.prototype.matchAll — behavioral, because Chrome 73-79 shipped the
// pre-final draft that quietly accepts a non-global regexp; final ES2020 spec
// makes that a TypeError (silently matching once is never what callers meant).
export const isSupported = (): boolean => {
  try {
    if (typeof String.prototype.matchAll !== "function") {
      return false;
    }
    try {
      // a compliant engine refuses the non-global regexp here
      "".matchAll(/./ as any);
      return false;
    } catch {
      return true;
    }
  } catch {
    return false;
  }
};

export const isStringMatchAllSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.matchall
 * Inspired by: core-js (regexp-string-iterator), lean ES5 rewrite
 */

// Forward iterator over a fixed array, self-iterable when Symbol exists.
const makeIterator = function (items: any[]): any {
  let index = 0;
  const iterator: any = {
    next: function () {
      return index < items.length
        ? { value: items[index++], done: false }
        : { value: undefined, done: true };
    },
  };
  if (typeof Symbol !== "undefined" && (Symbol as any).iterator) {
    Object.defineProperty(iterator, (Symbol as any).iterator, {
      value: function () {
        return iterator;
      },
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
  return iterator;
};

export const stringMatchAll = function (this: any, regexp: any): any {
  if (this === null || this === undefined) {
    throw new TypeError(
      "String.prototype.matchAll called on null or undefined",
    );
  }
  const source = String(this);

  let pattern: string;
  let flags: string;
  if (regexp instanceof RegExp) {
    if (!regexp.global) {
      throw new TypeError(
        "String.prototype.matchAll called with a non-global RegExp argument",
      );
    }
    pattern = regexp.source;
    flags = "g";
    if (regexp.ignoreCase) flags += "i";
    if (regexp.multiline) flags += "m";
    if ((regexp as any).sticky) flags += "y";
    if ((regexp as any).unicode) flags += "u";
  } else {
    pattern = regexp === undefined ? "" : String(regexp);
    flags = "g";
  }

  // clone into our own regex so we don't stomp the caller's lastIndex
  const globalRegex = new RegExp(pattern, flags);
  const matches: any[] = [];
  let match: RegExpExecArray | null;
  while ((match = globalRegex.exec(source)) !== null) {
    matches.push(match);
    // a zero-width match (e.g. /x*/) never advances lastIndex on its own, so
    // nudge it forward by hand or we'd loop forever on the same spot
    if (match[0] === "") {
      globalRegex.lastIndex++;
    }
  }
  return makeIterator(matches);
};

if (!isSupported()) {
  Object.defineProperty(String.prototype, "matchAll", {
    value: stringMatchAll as any,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(String.prototype.matchAll, "name", {
    value: "matchAll",
    configurable: true,
  });
  Object.defineProperty(String.prototype.matchAll as any, "__polyfilled", {
    value: true,
  });
}
