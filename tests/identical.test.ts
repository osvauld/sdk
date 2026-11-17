// The browser files this package builds must be the files the host embeds today. Only the
// two `// <path>` banner comments Vite writes (the library moved from guest/ to src/) may differ.
// Set OSVAULD_HOST_EMBEDDED to the host's services/embedded folder; skipped if it is absent.
import { existsSync, readFileSync } from 'node:fs';

const embedded = process.env.OSVAULD_HOST_EMBEDDED
  ?? '/home/abe/osvauld3/.agent/worktrees/android/services/embedded';
const built = (name: string) => readFileSync(new URL(`../browser/${name}`, import.meta.url));
const there = existsSync(`${embedded}/osvauld.js`);

describe.skipIf(!there)('browser files against the host embedded copy', () => {
  it('loro.wasm is byte-identical', () => {
    expect(built('loro.wasm').equals(readFileSync(`${embedded}/loro.wasm`))).toBe(true);
  });

  it('osvauld.js is byte-identical apart from the two source-path banners', () => {
    const mine = built('osvauld.js').toString('utf8').split('\n');
    const theirs = readFileSync(`${embedded}/osvauld.js`, 'utf8').split('\n');
    expect(mine.length).toBe(theirs.length);
    const differing = mine.flatMap((line, i) => (line === theirs[i] ? [] : [[line.trim(), theirs[i].trim()]]));
    expect(differing).toEqual([
      ['// src/osvauld.ts', '// guest/osvauld.ts'],
      ['// src/entry.ts', '// guest/entry.ts'],
    ]);
  });
});
