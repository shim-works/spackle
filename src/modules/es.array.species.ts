// Authored for spackle (no the prior implementation origin) -- based on core-js (es.array.species / internals/set-species)

// Well-known Symbol.species accessor on Array. Only meaningful once a real
// Symbol.species exists (native or the es.symbol island). Supported when there's
// no Symbol.species to hang it on, or Array already exposes it.
export const isSupported = (): boolean => {
  try {
    const species = typeof Symbol !== 'undefined' && (Symbol as any).species;
    if (!species) return true; // nothing to install without Symbol.species
    return !!(Array as any)[species];
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-get-array-@@species
 *
 * Known limitations:
 * - [race] needs a live Symbol.species. On a Symbol-less floor (Safari 7) the
 *   es.symbol island installs Symbol later in the load order, so this can no-op;
 *   the species-aware Array methods fall back to the Array constructor, which is
 *   the correct default anyway. Same Symbol-load-order caveat as es.array.iterator.
 */
// named so the __polyfilled marker has a function to sit on (accessor property,
// like es.regexp.flags -- can't tag the property itself)
const arraySpeciesGetter = function (this: any): any {
  return this;
};

if (!isSupported()) {
  const species = (Symbol as any).species;
  Object.defineProperty((arraySpeciesGetter as any), '__polyfilled', { value: true });
  // Accessor + symbol-keyed: "get " prepended to the bracketed symbol name.
  Object.defineProperty(arraySpeciesGetter, 'name', { value: 'get [Symbol.species]', configurable: true });
  Object.defineProperty(Array, species, {
    configurable: true,
    get: arraySpeciesGetter,
  });
}
