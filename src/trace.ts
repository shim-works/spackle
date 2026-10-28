/** TEMPORARY install trace for the Foxtel box. Remove with every start( / step( line. */
const t0 = Date.now();
let last = t0;

export const installed: string[] = [];

const log = (msg: string): void => {
  if (typeof console !== 'undefined') console.log('[spackle] ' + msg);
};

export const start = (label: string): void => {
  log('installing ' + label + '...');
  last = Date.now();
};

export const step = (label: string): void => {
  const now = Date.now();
  log(label + ' complete ' + (now - last) + 'ms (total ' + (now - t0) + 'ms)');
};

export const summary = (): void => {
  log('done in ' + (Date.now() - t0) + 'ms, installed ' + installed.length + ':\n' + installed.join('\n'));
};
