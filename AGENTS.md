# Osvauld SDK

The guest library for Osvauld apps (`src/osvauld.ts`, `src/entry.ts`), its types and a fake-host
test kit (`src/testing.ts`). It is consumed by the host repo (`/home/abe/osvauld3`, which builds
its embedded copy from the browser files here) and by the apps. Read `README.md` first.

## Build and test

- `npm install`, `npm run build` (browser files to `browser/`, types to `dist/`), `npm test`,
  `npm run check:consumer`. Plain npm; there is no Rust here. Do not run cargo.
- `browser/` and `dist/` are committed build output: rebuild after any `src/` change.
- The Loro version is pinned and must equal the host's Rust `loro` (1.13.9). Bump the package
  version when Loro or the channel calls change.

## Boundaries

- The page holds no keys and names no workspace or app. Every call goes to `/.osvauld/<op>`;
  Rust decides. Do not add caller-supplied identity or authorization to the library.
- Apps never bundle this library; the host serves it. Keep `src/osvauld.ts` and `src/entry.ts`
  in step with the host's channel contract (`docs/design/app-data.md` in the host repo).
- The test kit is a test double, not the host: do not present it as proof of isolation or rules.
- Keep changes focused. Do not commit or publish without the user's approval.
