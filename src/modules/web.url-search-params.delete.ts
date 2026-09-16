// Behavioral, not existence: delete() has always been there -- what's missing on
// older implementations is the second argument. A one-arg delete() ignores the
// extra value and removes every pair with that name, so probe that directly.
export const isSupported = (): boolean => {
  try {
    if (typeof URLSearchParams === 'undefined') {
      return true;
    }
    const params = new URLSearchParams('a=1&a=2');
    params.delete('a', '1');
    return params.toString() === 'a=2';
  } catch {
    return false;
  }
};

export const isURLSearchParamsDeleteSupported = isSupported;

/**
 * Spec: https://url.spec.whatwg.org/#dom-urlsearchparams-delete
 *
 * Removes only the pairs matching BOTH name and value, leaving the order of
 * everything else intact. Done by snapshotting through forEach, clearing via the
 * original one-arg delete, then re-appending the survivors in their original
 * order -- so it works against whichever URLSearchParams is live rather than
 * reaching into internal storage.
 */

const originalDelete =
  typeof URLSearchParams !== 'undefined' && URLSearchParams.prototype
    ? URLSearchParams.prototype.delete
    : undefined;

export const urlSearchParamsDelete = function (this: any, name: any, value?: any): void {
  if (value === undefined) {
    originalDelete!.call(this, name);
    return;
  }
  const key = String(name);
  const unwanted = String(value);

  // snapshot both lists BEFORE mutating anything
  const survivors: [string, string][] = [];
  const names: string[] = [];
  this.forEach(function (pairValue: string, pairName: string) {
    if (pairName !== key || pairValue !== unwanted) {
      survivors.push([pairName, pairValue]);
    }
    if (names.indexOf(pairName) === -1) {
      names.push(pairName);
    }
  });

  for (let i = 0; i < names.length; i++) {
    originalDelete!.call(this, names[i]);
  }
  for (let i = 0; i < survivors.length; i++) {
    this.append(survivors[i][0], survivors[i][1]);
  }
};

if (originalDelete && !isSupported()) {
  Object.defineProperty(URLSearchParams.prototype, 'delete', { value: urlSearchParamsDelete as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(URLSearchParams.prototype.delete, 'name', { value: 'delete', configurable: true });
  Object.defineProperty((URLSearchParams.prototype.delete as any), '__polyfilled', {
    value: true,
  });
}
