import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';

// The library an app's view loads from /.osvauld/ (osvauld.js, loro.wasm), built into the
// folder a host serves. Loro's WebAssembly is emitted as its own file and fetched
// from the view's own origin; the glue's default `new URL(..., import.meta.url)` is removed
// because the library always passes the path itself.
const wasmFile = new URL('./node_modules/loro-crdt/web/loro_wasm_bg.wasm', import.meta.url);

const loroWasm = (): Plugin => ({
  name: 'osvauld-loro-wasm',
  enforce: 'pre',
  buildStart() {
    this.emitFile({ type: 'asset', fileName: 'loro.wasm', source: readFileSync(wasmFile) });
  },
  transform(code, id) {
    if (!id.includes('loro-crdt/web/loro_wasm.js')) return null;
    const out = code.replace("new URL('loro_wasm_bg.wasm', import.meta.url)", 'undefined');
    if (out === code) throw new Error('loro glue changed: the wasm URL default was not found');
    return out;
  },
});

export default defineConfig({
  publicDir: false,
  plugins: [loroWasm()],
  build: {
    outDir: 'browser',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    minify: false,
    lib: { entry: 'src/entry.ts', formats: ['iife'], name: 'osvauldGuest', fileName: () => 'osvauld.js' },
  },
});
