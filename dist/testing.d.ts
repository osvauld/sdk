import { LoroDoc } from 'loro-crdt';
import * as Loro from 'loro-crdt';
import { type Me } from './osvauld.js';
export interface DocOptions {
    /** Whether a view may write this document. Defaults to the host-wide `writer`. */
    writer?: boolean;
}
export interface HostOptions {
    /** The app's declared documents: names, or names with per-document options. */
    docs?: string[] | Record<string, DocOptions>;
    /** False: the view is not part of a workspace and every call fails with `no_workspace`. */
    workspace?: boolean;
    /** Whether views may write the declared documents (default true). */
    writer?: boolean;
    /** The device peer id handed to a writing view. */
    peer?: string;
    /** What `me()` answers. */
    me?: Me;
    /**
     * Refuse `apply` calls. A code refuses every one; a function sees the document before and
     * after the update is applied to a copy and returns a code to refuse it (or nothing to accept).
     */
    refuse?: string | ((path: string, before: LoroDoc, after: LoroDoc) => string | undefined | void);
}
export declare function fakeHost(options?: HostOptions): {
    connect: () => {
        readonly Loro: import("./osvauld.js").Loro | undefined;
        doc(path: string): Promise<LoroDoc>;
        writable(path: string): Promise<boolean>;
        onRefused(handler: (path: string, why: string, doc: LoroDoc) => void): () => void;
        me(): Promise<Me>;
    };
    call: (op: string, body: Record<string, any>) => Promise<{
        name: string;
        roles: string[];
        peer?: undefined;
        write?: undefined;
        snapshot?: undefined;
        update?: undefined;
    } | {
        name?: undefined;
        roles?: undefined;
        peer: string;
        write: boolean;
        snapshot: string;
        update?: undefined;
    } | {
        name?: undefined;
        roles?: undefined;
        peer?: undefined;
        write?: undefined;
        snapshot?: undefined;
        update?: undefined;
    } | {
        name?: undefined;
        roles?: undefined;
        peer?: undefined;
        write?: undefined;
        snapshot?: undefined;
        update: string;
    }>;
    remote: (path: string, edit: (d: LoroDoc) => void) => void;
    stored: Map<string, LoroDoc<Record<string, Loro.Container>>>;
    calls: {
        op: string;
        doc?: string;
    }[];
};
