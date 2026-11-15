#!/usr/bin/env bash
# The merge gate (this repo is not on Jenkins): clean install, then the
# production static export that scripts/deploy-pages.sh ships.
#   bash scripts/ci-local.sh
set -euo pipefail
cd "$(dirname "$0")/.."

PNPM=(pnpm)
command -v pnpm >/dev/null 2>&1 || PNPM=(corepack pnpm)

export NEXT_PUBLIC_SITE_URL="https://urania-bp7.pages.dev"

"${PNPM[@]}" install --frozen-lockfile
"${PNPM[@]}" run build
test -f out/en.html
echo "ci-local: all steps passed"
