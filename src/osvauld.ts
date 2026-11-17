// The library the host serves to an app's view at /.osvauld/osvauld.js (see
// docs/design/app-data.md). It holds no key and names no workspace: every call goes to the
// reserved path of the view's own origin, and Rust takes the workspace and app from the
// native view that made it.
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
type Subscription = { listener: (event: any) => void; off: () => void };

interface Entry {
  path: string;
  doc: LoroDoc;
  write: boolean;
  dead: boolean;
  queue: Promise<void>;
  subs: Set<Subscription>;
}

const bytesToBase64 = (bytes: Uint8Array): string => {
  let text = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    text += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(text);
};
const base64ToBytes = (text: string): Uint8Array => Uint8Array.from(atob(text), c => c.charCodeAt(0));

export function createOsvauld(deps: Deps) {
  const waitMs = deps.waitMs ?? 15000;
  const sleep = deps.sleep ?? (ms => new Promise<void>(resolve => setTimeout(resolve, ms)));
  const entries = new Map<string, Promise<Entry>>();
  const handlers = new Set<Refused>();
  let loaded: Loro | undefined;

  async function load(path: string, old?: Entry): Promise<Entry> {
    loaded ??= await deps.loadLoro();
    const { LoroDoc } = loaded;
    const opened = await deps.call('open', { doc: path });
    const doc = new LoroDoc();
    const snapshot = base64ToBytes(opened.snapshot);
    if (snapshot.length) doc.import(snapshot);
    const entry: Entry = {
      path,
      doc,
      write: opened.write === true,
      dead: false,
      queue: Promise.resolve(),
      subs: old?.subs ?? new Set(),
    };
    // A writing view signs its changes with this device's peer; a read-only copy keeps
    // Loro's random one, so that edits it must not make never collide with the device's.
    if (entry.write) doc.setPeerId(opened.peer);
    // The app subscribes through the document it holds; keep its listeners across a reload.
    const subscribe = doc.subscribe.bind(doc);
    for (const sub of entry.subs) sub.off = subscribe(sub.listener);
    (doc as any).subscribe = (listener: (event: any) => void) => {
      const sub: Subscription = { listener, off: subscribe(listener) };
      entry.subs.add(sub);
      return () => {
        sub.off();
        entry.subs.delete(sub);
      };
    };
    if (entry.write) {
      doc.subscribeLocalUpdates(update => send(entry, update));
    } else if (path.includes(':')) {
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

  function send(entry: Entry, update: Uint8Array) {
    entry.queue = entry.queue.then(async () => {
      if (entry.dead) return;
      try {
        await deps.call('apply', { doc: entry.path, update: bytesToBase64(update) });
      } catch (error) {
        await refuse(entry, (error as Failure)?.code ?? 'failed');
      }
    });
  }

  // Rust refused the update, or could not be asked: what the view holds is not what is
  // stored, and a Loro document cannot drop an operation it has made. Load a new document
  // from Rust's copy, in place of the old one, and tell the app.
  async function refuse(entry: Entry, why: string) {
    if (entry.dead) return;
    entry.dead = true;
    for (const sub of entry.subs) sub.off();
    const next = load(entry.path, entry);
    entries.set(entry.path, next);
    try {
      const fresh = await next;
      for (const sub of fresh.subs) {
        try {
          sub.listener({ by: 'import', origin: 'osvauld.reload', events: [] });
        } catch {}
      }
      for (const handler of handlers) {
        try {
          handler(entry.path, why, fresh.doc);
        } catch {}
      }
    } catch {
      entries.delete(entry.path);
    }
  }

  // Imports what Rust holds beyond this copy, for as long as this copy is the current one.
  async function follow(entry: Entry) {
    while (!entry.dead) {
      try {
        const since = bytesToBase64(entry.doc.oplogVersion().encode());
        const got = await deps.call('changes', { doc: entry.path, since, wait: waitMs });
        if (entry.dead) return;
        const update = base64ToBytes(got.update);
        if (update.length) entry.doc.import(update);
      } catch (error) {
        const code = (error as Failure)?.code;
        if (code === 'locked' || code === 'no_workspace') return;
        await sleep(2000);
      }
    }
  }

  return {
    /** Loro's classes (`LoroMap`, `LoroText`, ...), once the first document has loaded. */
    get Loro(): Loro | undefined {
      return loaded;
    },
    /**
     * A Loro document of the app's declared path, loaded from Rust's copy. A name of the form
     * `<app>:<doc>` opens another app's document read-only, if this app's manifest says
     * `uses "<app>" read`; Rust decides, and the library only passes the name through.
     */
    async doc(path: string): Promise<LoroDoc> {
      let entry = entries.get(path);
      if (!entry) {
        entry = load(path);
        entries.set(path, entry);
        entry.catch(() => entries.delete(path));
      }
      return (await entry).doc;
    },
    /** Whether this view may write the document (it opened it first, and the manifest allows it). */
    async writable(path: string): Promise<boolean> {
      await this.doc(path);
      return (await entries.get(path)!).write;
    },
    /** Called when Rust refused an update and the document was put back in line. */
    onRefused(handler: Refused): () => void {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
    /** The caller's display name and roles at this app. */
    async me(): Promise<Me> {
      return deps.call('me', {});
    },
  };
}
