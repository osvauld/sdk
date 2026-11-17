// Fake host test kit for apps: the real `createOsvauld` over an in-memory stand-in for the
// host's reserved path (/.osvauld/). It answers with the codes the Rust channel uses, so an
// app's tests see the same refusals a real host gives. It is a test double: it enforces only
// the declared documents, the read/write role and the refusal you configure, not the
// manifest's rules.
import { LoroDoc, VersionVector, decodeImportBlobMeta } from 'loro-crdt';
import * as Loro from 'loro-crdt';
import { createOsvauld, type Me } from './osvauld.js';

const b64 = (b: Uint8Array) => Buffer.from(b).toString('base64');
const unb64 = (s: string) => new Uint8Array(Buffer.from(s, 'base64'));
const fail = (code: string, message: string) => Object.assign(new Error(message), { code, message });

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

export function fakeHost(options: HostOptions = {}) {
  const { workspace = true, writer = true, peer = '4242', refuse, me = { name: 'Tester', roles: ['member'] } } = options;
  const declared: Record<string, DocOptions> = Array.isArray(options.docs)
    ? Object.fromEntries(options.docs.map(name => [name, {}]))
    : (options.docs ?? { doc: {} });
  const stored = new Map<string, LoroDoc>(Object.keys(declared).map(name => [name, new LoroDoc()]));
  const waiters = new Map<string, (() => void)[]>();
  const calls: { op: string; doc?: string }[] = [];

  const wake = (path: string) => { for (const w of waiters.get(path) ?? []) w(); waiters.set(path, []); };
  const noWorkspace = () => fail('no_workspace', 'This app view is not part of a workspace, so it has no app data.');

  async function call(op: string, body: Record<string, any>) {
    calls.push({ op, doc: body.doc });
    if (!workspace) throw noWorkspace();
    if (op === 'me') return { name: me.name, roles: [...me.roles] };
    const path = body.doc as string;
    if (path.includes(':')) throw fail('uses_not_declared', `This app does not declare that it reads the data of "${path.split(':')[0]}".`);
    const doc = stored.get(path);
    if (!doc) throw fail('undeclared_path', 'The app does not declare that document.');
    if (op === 'open') return { peer, write: declared[path].writer ?? writer, snapshot: b64(doc.export({ mode: 'snapshot' })) };
    if (op === 'apply') {
      if (typeof refuse === 'string') throw fail(refuse, 'The host refused that change.');
      if (refuse) {
        const candidate = new LoroDoc();
        candidate.import(doc.export({ mode: 'snapshot' }));
        candidate.import(unb64(body.update));
        const code = refuse(path, doc, candidate);
        if (code) throw fail(code, 'The host refused that change.');
      }
      doc.import(unb64(body.update));
      wake(path);
      return {};
    }
    // changes: held until something new arrives, as the real channel waits.
    const since = VersionVector.decode(unb64(body.since));
    const have = () => doc.export({ mode: 'update', from: since });
    const empty = (u: Uint8Array) => decodeImportBlobMeta(u, false).changeNum === 0;
    let u = have();
    if (!empty(u)) return { update: b64(u) };
    await new Promise<void>(resolve => { waiters.set(path, [...(waiters.get(path) ?? []), resolve]); });
    u = have();
    return { update: empty(u) ? '' : b64(u) };
  }

  /** A fresh `osvauld` the way a page gets it: new library, new documents, same host. */
  const connect = () => createOsvauld({ loadLoro: async () => Loro as any, call: call as any, sleep: () => new Promise(() => {}) });

  /** A change made by another device: it lands in the host's copy and the waiting `changes` call returns. */
  function remote(path: string, edit: (d: LoroDoc) => void) {
    const other = new LoroDoc();
    other.setPeerId('777');
    const doc = stored.get(path)!;
    other.import(doc.export({ mode: 'snapshot' }));
    edit(other);
    other.commit();
    doc.import(other.export({ mode: 'snapshot' }));
    wake(path);
  }

  return { connect, call, remote, stored, calls };
}
