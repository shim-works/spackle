/**
 * Vendored from babel-plugin-polyfill-corejs3 (usage-filters.js). Small,
 * targeted false-positive suppression for usage-global detection: a call
 * site that structurally matches a builtin method but is provably safe
 * doesn't need the polyfill injected. Same "data/logic, not core-js
 * implementation code" reasoning as built-in-definitions.ts.
 */
import * as babel from '@babel/core';

const { types: t } = babel;

export const canSkipPolyfill = (desc: { name?: string }, path: any): boolean | undefined => {
  const { node, parent } = path;
  switch (desc.name) {
    case 'es.string.split': {
      // str.split(x) only dispatches through Symbol.split when x isn't a
      // plain string/template literal -- a literal separator never needs
      // the Symbol.split machinery, native or polyfilled.
      if (!t.isCallExpression(parent, { callee: node })) return false;
      if (parent.arguments.length < 1) return true;
      const splitter = parent.arguments[0];
      return t.isStringLiteral(splitter) || t.isTemplateLiteral(splitter);
    }
  }
  return undefined;
};
