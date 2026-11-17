// Browser entry of the guest library: sets `osvauld` on the page. Built to one file by
// `npm run build:guest`, which Rust embeds; nothing is loaded from the network.
import init, * as loro from 'loro-crdt/web';
import { createOsvauld, type Failure } from './osvauld.js';

const base = '/.osvauld/';

async function call(op: string, body: Record<string, unknown>) {
  let response: Response;
  try {
    response = await fetch(base + op, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
  } catch {
    throw { code: 'unavailable', message: 'The app data service could not be reached.' } satisfies Failure;
  }
  const reply = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw { code: reply.code ?? 'failed', message: reply.message ?? 'The request failed.' } satisfies Failure;
  }
  return reply;
}

let loading: Promise<typeof loro> | undefined;
(globalThis as any).osvauld = Object.freeze(
  createOsvauld({
    call: call as any,
    loadLoro: () => (loading ??= init({ module_or_path: base + 'loro.wasm' }).then(() => loro)),
  }),
);
