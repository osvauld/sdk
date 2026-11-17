const bytesToBase64 = (bytes) => {
    let text = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
        text += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return btoa(text);
};
const base64ToBytes = (text) => Uint8Array.from(atob(text), c => c.charCodeAt(0));
export function createOsvauld(deps) {
    const waitMs = deps.waitMs ?? 15000;
    const sleep = deps.sleep ?? (ms => new Promise(resolve => setTimeout(resolve, ms)));
    const entries = new Map();
    const handlers = new Set();
    let loaded;
    async function load(path, old) {
        loaded ??= await deps.loadLoro();
        const { LoroDoc } = loaded;
        const opened = await deps.call('open', { doc: path });
        const doc = new LoroDoc();
        const snapshot = base64ToBytes(opened.snapshot);
        if (snapshot.length)
            doc.import(snapshot);
        const entry = {
            path,
            doc,
            write: opened.write === true,
            dead: false,
            queue: Promise.resolve(),
            subs: old?.subs ?? new Set(),
        };
        // A writing view signs its changes with this device's peer; a read-only copy keeps
        // Loro's random one, so that edits it must not make never collide with the device's.
        if (entry.write)
            doc.setPeerId(opened.peer);
        // The app subscribes through the document it holds; keep its listeners across a reload.
        const subscribe = doc.subscribe.bind(doc);
        for (const sub of entry.subs)
            sub.off = subscribe(sub.listener);
        doc.subscribe = (listener) => {
            const sub = { listener, off: subscribe(listener) };
            entry.subs.add(sub);
            return () => {
                sub.off();
                entry.subs.delete(sub);
            };
        };
        if (entry.write) {
            doc.subscribeLocalUpdates(update => send(entry, update));
        }
        else if (path.includes(':')) {
            // Another app's document (`<app>:<doc>`) is read-only. A local edit is never sent;
            // it fails loudly: the copy is put back in line and `onRefused` hears `read_only`.
            doc.subscribeLocalUpdates(() => {
                console.error(`osvauld: "${path}" belongs to another app and is read-only; the edit was dropped`);
                void refuse(entry, 'read_only');
            });
        }
        void follow(entry);
        return entry;
    }
    function send(entry, update) {
        entry.queue = entry.queue.then(async () => {
            if (entry.dead)
                return;
            try {
                await deps.call('apply', { doc: entry.path, update: bytesToBase64(update) });
            }
            catch (error) {
                await refuse(entry, error?.code ?? 'failed');
            }
        });
    }
    // Rust refused the update, or could not be asked: what the view holds is not what is
    // stored, and a Loro document cannot drop an operation it has made. Load a new document
    // from Rust's copy, in place of the old one, and tell the app.
    async function refuse(entry, why) {
        if (entry.dead)
            return;
        entry.dead = true;
        for (const sub of entry.subs)
            sub.off();
        const next = load(entry.path, entry);
        entries.set(entry.path, next);
        try {
            const fresh = await next;
            for (const sub of fresh.subs) {
                try {
                    sub.listener({ by: 'import', origin: 'osvauld.reload', events: [] });
                }
                catch { }
            }
            for (const handler of handlers) {
                try {
                    handler(entry.path, why, fresh.doc);
                }
                catch { }
            }
        }
        catch {
            entries.delete(entry.path);
        }
    }
    // Imports what Rust holds beyond this copy, for as long as this copy is the current one.
    async function follow(entry) {
        while (!entry.dead) {
            try {
                const since = bytesToBase64(entry.doc.oplogVersion().encode());
                const got = await deps.call('changes', { doc: entry.path, since, wait: waitMs });
                if (entry.dead)
                    return;
                const update = base64ToBytes(got.update);
                if (update.length)
                    entry.doc.import(update);
            }
            catch (error) {
                const code = error?.code;
                if (code === 'locked' || code === 'no_workspace')
                    return;
                await sleep(2000);
            }
        }
    }
    return {
        /** Loro's classes (`LoroMap`, `LoroText`, ...), once the first document has loaded. */
        get Loro() {
            return loaded;
        },
        /**
         * A Loro document of the app's declared path, loaded from Rust's copy. A name of the form
         * `<app>:<doc>` opens another app's document read-only, if this app's manifest says
         * `uses "<app>" read`; Rust decides, and the library only passes the name through.
         */
        async doc(path) {
            let entry = entries.get(path);
            if (!entry) {
                entry = load(path);
                entries.set(path, entry);
                entry.catch(() => entries.delete(path));
            }
            return (await entry).doc;
        },
        /** Whether this view may write the document (it opened it first, and the manifest allows it). */
        async writable(path) {
            await this.doc(path);
            return (await entries.get(path)).write;
        },
        /** Called when Rust refused an update and the document was put back in line. */
        onRefused(handler) {
            handlers.add(handler);
            return () => handlers.delete(handler);
        },
        /** The caller's display name and roles at this app. */
        async me() {
            return deps.call('me', {});
        },
    };
}
