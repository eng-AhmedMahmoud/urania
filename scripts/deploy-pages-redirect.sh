#!/usr/bin/env bash
# Turns the old Cloudflare Pages address https://urania-bp7.pages.dev (where the
# site lived 2026-11-15 to 2026-11-27, after it left Vercel) into a permanent
# redirect to the same path on https://urania.devya.dev. The site itself is on
# the Devya VPS (scripts/deploy-vps.sh); this script never touches it.
#   bash scripts/deploy-pages-redirect.sh
# Needs a wrangler login on the Cloudflare account that owns the Pages project
# `urania` (`npx wrangler@4.156.0 whoami`).
set -euo pipefail
cd "$(dirname "$0")/.."

PROJECT="urania"
OUT_DIR="pages-redirect"
OLD="https://urania-bp7.pages.dev"
TARGET="https://urania.devya.dev"
WRANGLER=(npx --yes wrangler@4.156.0)

if [ -n "$(git status --porcelain)" ]; then
  echo "deploy: working tree is dirty; commit or stash first" >&2
  exit 1
fi

"${WRANGLER[@]}" pages deploy "$OUT_DIR" --project-name "$PROJECT" --branch main \
  --commit-hash "$(git rev-parse HEAD)" --commit-message "$(git log -1 --format=%s)"

status=0
for path in / /en /ar/events; do
  res="$(curl -s -o /dev/null -m 15 -w '%{http_code} %{redirect_url}' "$OLD$path" || true)"
  echo "deploy: $OLD$path -> $res"
  [ "$res" = "301 $TARGET$path" ] || status=1
done
exit "$status"
