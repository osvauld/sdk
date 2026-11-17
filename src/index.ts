// Public entry of @osvauld/sdk: the library's factory and types, and Loro's types so an app
// does not list loro-crdt itself. At run time the host serves the library (see README).
import type { createOsvauld } from './osvauld.js';

export { createOsvauld } from './osvauld.js';
export type { Deps, Failure, Loro, Me } from './osvauld.js';
export type * from 'loro-crdt';

/** The `osvauld` object an app page gets. */
export type Osv = ReturnType<typeof createOsvauld>;
