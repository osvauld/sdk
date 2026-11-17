# @osvauld/sdk

The Osvauld app SDK: the guest library an app's web page gets from its host (`osvauld.doc()`,
`writable()`, `onRefused()`, `me()` over Loro documents), its TypeScript types, and a fake host
for app tests. This repository is the single source of that library. The contract it serves is
`docs/design/app-data.md` in the Osvauld 3 host repository.

## Run-time model

- The **host serves** `osvauld.js` and `loro.wasm` to each app view at `/.osvauld/` of the
  view's own origin. The page loads `/.osvauld/osvauld.js` and gets a frozen global `osvauld`.
- **Apps never bundle the library or Loro.** At run time an app imports nothing from this package.
- The library holds no key and names no workspace. Every call is a POST to `/.osvauld/<op>`
  (`open`, `apply`, `changes`, `me`); Rust takes the workspace and app from the native view and
  decides what is allowed. The page names nothing.
- **Loro version:** the Loro in `loro.wasm` and the document types must equal the host's Rust
  `loro` crate, currently **1.13.9** (pinned exactly here).

## In an app

Use the package for types and tests only.

```ts
import type { LoroDoc, Osv } from '@osvauld/sdk';      // Loro types are re-exported;
                                                        // the app need not list loro-crdt
async function add(osvauld: Osv, text: string) {
  const doc: LoroDoc = await osvauld.doc('review');
  doc.getList('notes').push(text);
  doc.commit();
}
```

Test kit (`@osvauld/sdk/testing`): the real `createOsvauld` over an in-memory fake channel that
answers with the Rust channel's codes (`no_workspace`, `uses_not_declared`, `undeclared_path`).

```ts
import { fakeHost } from '@osvauld/sdk/testing';

const host = fakeHost({
  docs: ['review'],                       // or { review: { writer: false } }
  writer: true,                           // read-only views: false
  me: { name: 'Tester', roles: ['member'] },
  refuse: 'rule_refused',                 // or (path, before, after) => code | undefined
});
const osvauld = host.connect();           // a page's fresh library
host.remote('review', d => d.getList('notes').push('from another device'));
host.stored.get('review');                // the host's copy; host.calls lists the ops made
```

The fake enforces declared documents, the read/write role and the refusal you configure. It does
not evaluate a manifest's rules; pass a `refuse` function to model them.

## Exports

| Path | Contents |
| --- | --- |
| `@osvauld/sdk` | `createOsvauld`, types `Osv`, `Failure`, `Me`, `Deps`, `Loro`, plus all `loro-crdt` types |
| `@osvauld/sdk/testing` | `fakeHost`, `HostOptions`, `DocOptions` |
| `@osvauld/sdk/browser/osvauld.js` | the IIFE a host serves at `/.osvauld/osvauld.js` |
| `@osvauld/sdk/browser/loro.wasm` | the WebAssembly a host serves at `/.osvauld/loro.wasm` |

## How a host takes the browser files

The built files are committed under `browser/` (and `dist/`), so a git dependency or a packed
tarball carries them without a build step. A host copies them from the installed package, e.g.
`node_modules/@osvauld/sdk/browser/{osvauld.js,loro.wasm}` or
`require.resolve('@osvauld/sdk/browser/osvauld.js')`, into the folder it embeds or serves.

## Build and test

```
npm install
npm run build            # vite -> browser/, tsc -> dist/
npm test                 # vitest
npm run check:consumer   # pack, install in a scratch app, tsc + vitest (scripts/consumer-check.sh)
```

`tests/identical.test.ts` compares `browser/` with the host's `services/embedded/` (path in
`OSVAULD_HOST_EMBEDDED`; skipped if absent). Rebuild and commit `browser/` and `dist/` with any
change to `src/`.

## Versioning

Semver. Bump the version when Loro changes or the channel calls (`/.osvauld/<op>`, their bodies
or failure codes) change, since the host's Rust side must match. Loro must move together with the
host's `loro` crate.

## Distribution

Not published to the npm registry. For now it is consumed as a git dependency
(`"@osvauld/sdk": "git+<url>#<tag>"`, needs a commit/tag) or an `npm pack` tarball
(`"@osvauld/sdk": "file:../path/osvauld-sdk-0.1.0.tgz"`).
