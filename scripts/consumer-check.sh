#!/usr/bin/env bash
# Proves a clean app can use the packed SDK: build, `npm pack`, install the tarball into a
# scratch app that has no loro-crdt of its own and no path into any other repo, compile it
# with `tsc` (SDK types only), and run its vitest test against `@osvauld/sdk/testing`.
# Usage: scripts/consumer-check.sh [scratch-dir]   (default: $CLAUDE_JOB_DIR/tmp or a mktemp dir)
set -euo pipefail
sdk="$(cd "$(dirname "$0")/.." && pwd)"
scratch="${1:-${CLAUDE_JOB_DIR:+$CLAUDE_JOB_DIR/tmp}}"
scratch="${scratch:-$(mktemp -d)}"
work="$scratch/consumer-check"
rm -rf "$work"; mkdir -p "$work/pack" "$work/app"

(cd "$sdk" && npm run build)
tarball="$(cd "$sdk" && npm pack --pack-destination "$work/pack" --silent | tail -1)"
echo "tarball: $work/pack/$tarball ($(wc -c < "$work/pack/$tarball") bytes)"

cp -r "$sdk/scripts/consumer-app/src" "$sdk/scripts/consumer-app/tests" "$sdk/scripts/consumer-app/tsconfig.json" "$work/app/"
cat > "$work/app/package.json" <<J
{ "name": "consumer-scratch", "private": true, "type": "module" }
J
cd "$work/app"
npm install --silent --no-audit --no-fund "$work/pack/$tarball" \
  --save-dev --save-exact typescript@7.0.2 vitest@5.1.0 >/dev/null
# the app must not list loro-crdt itself
if grep -q '"loro-crdt"' package.json; then echo "FAIL: app lists loro-crdt" >&2; exit 1; fi
npx tsc -p tsconfig.json
echo "tsc: ok"
npx vitest run
echo "consumer check: ok"
