#!/usr/bin/env bash
# Production deploy to Cloudflare Pages: https://urania-bp7.pages.dev
# (the site left Vercel on 2026-11-15; the old Vercel URL now redirects here).
# Builds the static export (`output: 'export'` → out/) from a clean install of
# the committed tree, uploads it, then checks the live URL. "/" → "/en" is in
# public/_redirects; the sky-news feed on /events is fetched at build time, so
# redeploy to refresh it.
#   bash scripts/deploy-pages.sh
# Needs a wrangler login on the Cloudflare account that owns the project
# (`npx wrangler@4.156.0 whoami`).
set -euo pipefail
cd "$(dirname "$0")/.."

PROJECT="urania"
OUT_DIR="out"
URL="https://urania-bp7.pages.dev"
WRANGLER=(npx --yes wrangler@4.156.0)
PNPM=(pnpm)
command -v pnpm >/dev/null 2>&1 || PNPM=(corepack pnpm)

if [ -n "$(git status --porcelain)" ]; then
  echo "deploy: working tree is dirty; commit or stash first" >&2
  exit 1
fi

# Public config only: canonical URL for metadata, hreflang, sitemap and robots.
export NEXT_PUBLIC_SITE_URL="$URL"

"${PNPM[@]}" install --frozen-lockfile
"${PNPM[@]}" run build

"${WRANGLER[@]}" pages deploy "$OUT_DIR" --project-name "$PROJECT" --branch main \
  --commit-hash "$(git rev-parse HEAD)" --commit-message "$(git log -1 --format=%s)"

for path in / /en /ar/events; do
  code="$(curl -s -o /dev/null -m 20 -w '%{http_code}' "$URL$path" || true)"
  echo "deploy: $URL$path -> $code"
  case "$path" in
    /) [ "$code" = 307 ] ;;
    *) [ "$code" = 200 ] ;;
  esac
done
