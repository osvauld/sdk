import type { createOsvauld } from './osvauld.js';
export { createOsvauld } from './osvauld.js';
export type { Deps, Failure, Loro, Me } from './osvauld.js';
export type * from 'loro-crdt';
/** The `osvauld` object an app page gets. */
export type Osv = ReturnType<typeof createOsvauld>;
