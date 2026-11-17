// The guest library against a stand-in for the Rust service (the real service is tested in
// Rust and in the native guest-view run), and the Rust <-> JavaScript Loro round trip by
// fixture files each side reads from the other.
import { readFileSync, writeFileSync } from 'node:fs';
import { LoroDoc, LoroMap, VersionVector, decodeImportBlobMeta } from 'loro-crdt/nodejs';
import { createOsvauld, type Failure } from '../src/osvauld';

const fixture = (name: string) => `${process.cwd()}/tests/fixtures/loro/${name}`;
const b64 = (bytes: Uint8Array) => Buffer.from(bytes).toString('base64');
const unb64 = (text: string) => new Uint8Array(Buffer.from(text, 'base64'));

/** Stands in for Rust: one stored copy, a ledger rule, one device peer. */
function service() {
  const stored = new LoroDoc();
  const calls: string[] = [];
  const peer = '4242';
  const state = { fail: undefined as undefined | Failure };
  const call = async (op: string, body: any) => {
    calls.push(op);
    if (state.fail) throw state.fail;
    if (op === 'open') {
      return { peer, write: true, snapshot: b64(stored.export({ mode: 'snapshot' })) };
    }
    if (op === 'apply') {
      const update = unb64(body.update);
      const probe = new LoroDoc();
      probe.import(stored.export({ mode: 'snapshot' }));
      const before = probe.toJSON().entries ?? {};
      probe.import(update);
      const after = probe.toJSON().entries ?? {};
      for (const key of Object.keys(before)) {
        if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
          throw { code: 'rule_refused', message: 'no' } satisfies Failure;
        }
      }
      stored.import(update);
      return {};
    }
    if (op === 'changes') {
      const since = body.since ? VersionVector.decode(unb64(body.since)) : undefined;
      await new Promise(resolve => setTimeout(resolve, 20));
      const bytes = stored.export({ mode: 'update', from: since });
      const meta = decodeImportBlobMeta(bytes, false);
      return { update: meta.changeNum ? b64(bytes) : '' };
    }
    return { name: 'Ada', roles: ['member'] };
  };
  return { stored, calls, call, peer, state };
}

const make = (s: ReturnType<typeof service>) =>
  createOsvauld({ loadLoro: async () => ({ LoroDoc }) as any, call: s.call as any, waitMs: 50, sleep: () => new Promise(r => setTimeout(r, 10)) });

const until = async (condition: () => boolean, what: string) => {
  for (let i = 0; i < 300; i++) {
    if (condition()) return;
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  throw new Error('timed out: ' + what);
};

const entry = (doc: LoroDoc, id: string, text: string) => {
  const map = doc.getMap('entries').setContainer(id, new LoroMap());
  map.set('text', text);
};

describe('osvauld.doc', () => {
  it('returns a real document loaded from the stored copy under the device peer', async () => {
    const s = service();
    entry(s.stored, 'e0', 'old');
    s.stored.commit();
    const osv = make(s);
    const doc = await osv.doc('ledger');
    expect(doc).toBeInstanceOf(LoroDoc);
    expect(doc.toJSON().entries.e0.text).toBe('old');
    expect(doc.peerIdStr).toBe(s.peer);
    expect(await osv.doc('ledger')).toBe(doc);
  });

  it('sends each local commit to apply, and the next one continues its counter', async () => {
    const s = service();
    const doc = await make(s).doc('ledger');
    entry(doc, 'e1', 'rent');
    doc.commit();
    entry(doc, 'e2', 'paint');
    doc.commit();
    await until(() => Object.keys(s.stored.toJSON().entries ?? {}).length === 2, 'both stored');
    expect(s.stored.toJSON().entries.e2.text).toBe('paint');
  });

  it('imports remote changes and fires the subscribers', async () => {
    const s = service();
    const doc = await make(s).doc('ledger');
    let fired = 0;
    doc.subscribe(() => fired++);
    const other = new LoroDoc();
    other.import(s.stored.export({ mode: 'snapshot' }));
    other.setPeerId('7');
    entry(other, 'remote', 'hello');
    other.commit();
    s.stored.import(other.export({ mode: 'update' }));
    await until(() => doc.toJSON().entries?.remote?.text === 'hello', 'imported');
    await until(() => fired > 0, 'subscriber fired');
  });

  it('puts the document back and calls onRefused when an update is refused', async () => {
    const s = service();
    entry(s.stored, 'e1', 'rent');
    s.stored.commit();
    const osv = make(s);
    const doc = await osv.doc('ledger');
    let fired = 0;
    doc.subscribe(() => fired++);
    const refused: any[] = [];
    osv.onRefused((path, why, fresh) => refused.push({ path, why, fresh }));
    doc.getMap('entries').set('e1', 'edited');
    doc.commit();
    await until(() => refused.length === 1, 'onRefused');
    expect(refused[0].path).toBe('ledger');
    expect(refused[0].why).toBe('rule_refused');
    const now = await osv.doc('ledger');
    expect(now).not.toBe(doc);
    expect(now).toBe(refused[0].fresh);
    expect(now.toJSON().entries.e1.text).toBe('rent');
    expect(s.stored.toJSON().entries.e1.text).toBe('rent');
    // The subscriber survived, was told, and the new document keeps writing under the peer.
    await until(() => fired > 0, 'subscriber told');
    entry(now, 'e2', 'paint');
    now.commit();
    await until(() => s.stored.toJSON().entries?.e2?.text === 'paint', 'later write accepted');
  });

  it('answers me() and does not write when the view may not', async () => {
    const s = service();
    const osv = make(s);
    expect(await osv.me()).toEqual({ name: 'Ada', roles: ['member'] });
    const call = s.call;
    const readonly = createOsvauld({
      loadLoro: async () => ({ LoroDoc }) as any,
      call: (async (op: string, body: any) => {
        const r = await call(op, body);
        return op === 'open' ? { ...r, write: false } : r;
      }) as any,
      waitMs: 50,
    });
    const doc = await readonly.doc('ledger');
    expect(await readonly.writable('ledger')).toBe(false);
    entry(doc, 'x', 'y');
    doc.commit();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(s.calls.filter(op => op === 'apply')).toHaveLength(0);
  });
});

describe('osvauld.doc of another app (app:doc)', () => {
  it('passes the name through, never sends a local edit, and fails loudly with read_only', async () => {
    const s = service();
    entry(s.stored, 'e1', 'rent');
    s.stored.commit();
    const call = s.call;
    const seen: any[] = [];
    const osv = createOsvauld({
      loadLoro: async () => ({ LoroDoc }) as any,
      call: (async (op: string, body: any) => {
        seen.push({ op, body });
        const r = await call(op, body);
        return op === 'open' ? { ...r, write: false } : r;
      }) as any,
      waitMs: 50,
    });
    const doc = await osv.doc('sites:directory');
    expect(seen[0]).toEqual({ op: 'open', body: { doc: 'sites:directory' } });
    expect(doc.toJSON().entries.e1.text).toBe('rent');
    expect(await osv.writable('sites:directory')).toBe(false);
    const refused: any[] = [];
    osv.onRefused((path, why) => refused.push({ path, why }));
    const error = console.error;
    console.error = () => {};
    try {
      entry(doc, 'x', 'y');
      doc.commit();
      await until(() => refused.length === 1, 'onRefused');
    } finally {
      console.error = error;
    }
    expect(refused[0]).toEqual({ path: 'sites:directory', why: 'read_only' });
    expect(s.calls.filter(op => op === 'apply')).toHaveLength(0);
    // The copy is back in line with the stored one, and later stored changes arrive.
    const now = await osv.doc('sites:directory');
    expect(now.toJSON().entries.x).toBeUndefined();
    entry(s.stored, 'e2', 'paint');
    s.stored.commit();
    await until(() => now.toJSON().entries?.e2?.text === 'paint', 'later change followed');
  });
});

describe('Loro in Rust and in the view', () => {
  it('reads a Rust snapshot and a version vector, and Rust reads this side back', () => {
    // Written by the Rust test `loro_js_round_trip` (src-tauri/src/sharing/channel_tests.rs).
    const snapshot = new Uint8Array(readFileSync(fixture('rust-snapshot.bin')));
    const doc = new LoroDoc();
    doc.import(snapshot);
    expect(doc.toJSON()).toEqual({
      entries: { e1: { text: 'rent' } },
      notes: 'hello',
      list: [1, 'two'],
    });
    // The Rust copy's version encoding decodes here and compares equal to ours.
    const vv = new Uint8Array(readFileSync(fixture('rust-vv.bin')));
    expect(doc.oplogVersion().encode()).toEqual(vv);
    // A change made here, as an update since that version, for Rust to import.
    doc.setPeerId('77');
    entry(doc, 'e2', 'paint');
    doc.getText('notes').insert(5, ' world');
    doc.commit();
    writeFileSync(fixture('js-update.bin'), doc.export({ mode: 'update', from: VersionVector.decode(vv) }));
    writeFileSync(fixture('js-vv.bin'), doc.oplogVersion().encode());
    writeFileSync(fixture('js-snapshot.bin'), doc.export({ mode: 'snapshot' }));
  });
});
