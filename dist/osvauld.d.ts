import type { LoroDoc } from 'loro-crdt';
export interface Loro {
    LoroDoc: typeof LoroDoc;
}
export interface Failure {
    code: string;
    message: string;
}
export interface Deps {
    /** Loads Loro (and its WebAssembly) once, on the first document. */
    loadLoro: () => Promise<Loro>;
    /** One POST to the reserved path. Rejects with a `Failure`. */
    call: (op: 'open' | 'apply' | 'changes' | 'me', body: Record<string, unknown>) => Promise<any>;
    /** How long a poll waits for Rust to hold something new. */
    waitMs?: number;
    sleep?: (ms: number) => Promise<void>;
}
export interface Me {
    name: string;
    roles: string[];
}
type Refused = (path: string, why: string, doc: LoroDoc) => void;
export declare function createOsvauld(deps: Deps): {
    /** Loro's classes (`LoroMap`, `LoroText`, ...), once the first document has loaded. */
    readonly Loro: Loro | undefined;
    /**
     * A Loro document of the app's declared path, loaded from Rust's copy. A name of the form
     * `<app>:<doc>` opens another app's document read-only, if this app's manifest says
     * `uses "<app>" read`; Rust decides, and the library only passes the name through.
     */
    doc(path: string): Promise<LoroDoc>;
    /** Whether this view may write the document (it opened it first, and the manifest allows it). */
    writable(path: string): Promise<boolean>;
    /** Called when Rust refused an update and the document was put back in line. */
    onRefused(handler: Refused): () => void;
    /** The caller's display name and roles at this app. */
    me(): Promise<Me>;
};
export {};
