# Urania — Star Myths ✦ أساطير النجوم

A complete bilingual (English/Arabic) illustrated guide to the constellations and their Greek myths, told through the hand-coloured 1824 engravings of *Urania's Mirror* — with an arcade of learning games, a live sky-events feed, and a history timeline from Babylon to the IAU.

## Features

- **7 story chapters** — the Royal Family (Perseus saga), the Bears, the Labours of Heracles, the summer sky, Orion vs the Scorpion, the full Zodiac wheel, and the Ship & the Southern Sea — each illustrated with original *Urania's Mirror* plates (public domain, Wikimedia Commons)
- **Fully bilingual** — English + Modern Standard Arabic with proper RTL, hreflang alternates, and localized metadata on every route
- **The Arcade** (`/learn`) — timed myth quiz with speed bonuses and ranks, guess-the-plate, and a Star Match memory game pairing Latin star names with their Arabic originals
- **Sky Events** (`/events`) — curated calendar of eclipses & major meteor showers + an hourly-revalidated feed of important astronomy news (Spaceflight News API, importance-filtered)
- **Start Here** (`/start-here`) — beginner path: the sky in five sentences, an 8-term glossary, and a first-week plan
- **Star Names** (`/star-names`) — flashcards for the Arabic origins of famous star names (Aldebaran → الدبران, Deneb → ذنب الدجاجة…)
- SEO: SSG everywhere, per-page metadata, OG images, JSON-LD (WebSite/Article/Breadcrumb), sitemap + robots
- GSAP scroll reveals & page transitions over an animated starfield; Cinzel + Aref Ruqaa display typography

## Stack

Next.js 16 (App Router, SSG/ISR) · TypeScript · GSAP + ScrollTrigger · next/font (Cairo, Cinzel, Aref Ruqaa)

## Develop

```bash
pnpm install
pnpm dev        # or: portless urania -- pnpm dev
```

Set `NEXT_PUBLIC_SITE_URL` to the canonical production URL for correct SEO metadata.

## Credits

Constellation plates: Sidney Hall, *Urania's Mirror* (London, 1824) — public domain, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Urania%27s_Mirror).

## Hosting

Static export (`output: 'export'` → `out/`) on Cloudflare Pages: https://urania-bp7.pages.dev (project `urania`). Deploy with `bash scripts/deploy-pages.sh`; the merge gate is `bash scripts/ci-local.sh`. `/` → `/en` is in `public/_redirects`. The sky-news feed on `/events` is fetched at build time, so a redeploy refreshes it. The old Vercel URL redirects here.
