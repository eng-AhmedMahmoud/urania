#!/usr/bin/env bash
# The merge gate, run by Jenkins (Jenkinsfile) and by hand when Jenkins is busy:
# clean install, typecheck, then the production static export that
# scripts/deploy-vps.sh ships, and a check that the nginx site serves every page.
#   bash scripts/ci-local.sh
set -euo pipefail
cd "$(dirname "$0")/.."

PNPM=(pnpm)
command -v pnpm >/dev/null 2>&1 || PNPM=(corepack pnpm)

export NEXT_PUBLIC_SITE_URL="https://urania.devya.dev"
export NEXT_TELEMETRY_DISABLED=1

"${PNPM[@]}" install --frozen-lockfile
"${PNPM[@]}" exec tsc --noEmit
"${PNPM[@]}" run build

# Every page the sitemap lists must exist as a file nginx's try_files finds
# ($uri.html or $uri/index.html), in both locales.
test -f out/en.html && test -f out/ar.html && test -f out/404.html
pages=0
for loc in $(grep -oE '<loc>[^<]+' out/sitemap.xml | sed 's#<loc>https://urania.devya.dev##'); do
  path="${loc%/}"; path="${path:-/}"
  [ "$path" = / ] && continue
  if [ ! -f "out$path.html" ] && [ ! -f "out$path/index.html" ]; then
    echo "ci-local: sitemap page $path has no file in out/" >&2
    exit 1
  fi
  pages=$((pages + 1))
done
[ "$pages" -gt 10 ] || { echo "ci-local: only $pages sitemap pages" >&2; exit 1; }
grep -q 'https://urania.devya.dev/ar' out/en.html \
  || { echo "ci-local: hreflang alternates do not use urania.devya.dev" >&2; exit 1; }
echo "ci-local: $pages sitemap pages present; all steps passed"
