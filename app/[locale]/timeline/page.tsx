import type { Metadata } from "next";
import { TIMELINE, UI } from "@/lib/content";
import { Locale, SITE_URL, langAlternates } from "@/lib/site";

type Params = Promise<{ locale: Locale }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const ui = UI[locale];
  return {
    title: ui.tlTitle,
    description: ui.tlLede,
    alternates: { canonical: `${SITE_URL}/${locale}/timeline`, ...langAlternates("/timeline") },
  };
}

export default async function TimelinePage({ params }: { params: Params }) {
  const { locale } = await params;
  const ui = UI[locale];

  return (
    <main className="wrap">
      <header className="chapter-hero">
        <h1>{ui.tlTitle}</h1>
        <p className="lede">{ui.tlLede}</p>
      </header>
      <div className="tl">
        {TIMELINE.map((e: any, i: number) => (
          <details key={i} open={i === 0}>
            <summary>
              <span className="tl-year">{e.year[locale]}</span>
              <span className="tl-title">{e.title[locale]}</span>
            </summary>
            <div className="tl-body">{e.body[locale]}</div>
          </details>
        ))}
      </div>
    </main>
  );
}
