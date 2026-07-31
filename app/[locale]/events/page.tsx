import type { Metadata } from "next";
import { EVENTS_UI, SKY_EVENTS } from "@/lib/extra2";
import { Locale, SITE_URL, langAlternates } from "@/lib/site";

export const revalidate = 3600;

type Params = Promise<{ locale: Locale }>;

type Article = {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
};

// Only sky-event stories pass; routine launch/business news is dropped.
const IMPORTANT =
  /eclipse|meteor shower|meteor storm|fireball|comet|aurora|northern lights|conjunction|supermoon|blood moon|occultation|planet parade|planetary alignment|nova |supernova|asteroid[^.]{0,60}(flyby|close approach|near[- ]earth)/i;

async function getImportantNews(): Promise<Article[]> {
  try {
    const res = await fetch(
      "https://api.spaceflightnewsapi.net/v4/articles/?limit=50&ordering=-published_at",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results as Article[])
      .filter(a => IMPORTANT.test(`${a.title} ${a.summary}`))
      .slice(0, 6);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const ui = EVENTS_UI[locale];
  return {
    title: ui.title,
    description: ui.lede,
    alternates: { canonical: `${SITE_URL}/${locale}/events`, ...langAlternates("/events") },
  };
}

export default async function EventsPage({ params }: { params: Params }) {
  const { locale } = await params;
  const ui = EVENTS_UI[locale];
  const news = await getImportantNews();

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = SKY_EVENTS.filter((e: any) => e.date >= today).slice(0, 8);
  const fmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <main className="wrap">
      <header className="chapter-hero">
        <h1>{ui.title}</h1>
        <p className="lede">{ui.lede}</p>
      </header>

      <h2 className="section-head">{ui.calHead}</h2>
      <div className="facts">
        {upcoming.map((e: any) => (
          <div className="fact" key={e.date + e.t.en} style={e.highlight ? { borderColor: "var(--gold)", boxShadow: "0 0 24px rgba(201,165,74,0.15)" } : undefined}>
            <b>
              {e.icon} {e.t[locale]}
              {e.highlight ? ` — ${ui.highlight} ⭐` : ""}
            </b>
            <span style={{ color: "var(--gold-bright)", display: "block", marginBottom: 6 }}>
              {fmt.format(new Date(e.date + "T12:00:00Z"))}
            </span>
            {e.d[locale]}
          </div>
        ))}
      </div>

      <h2 className="section-head">{ui.newsHead}</h2>
      <p className="section-sub">{ui.newsNote}</p>
      {news.length === 0 ? (
        <div className="tip">{ui.quiet}</div>
      ) : (
        <div className="res-grid">
          {news.map(a => (
            <div className="res-card" key={a.id}>
              <span className="tag">{a.news_site}</span>
              <h3 dir="ltr" style={{ textAlign: "start" }}>{a.title}</h3>
              <p dir="ltr" style={{ textAlign: "start" }}>{a.summary.slice(0, 180)}…</p>
              <a href={a.url} target="_blank" rel="noopener noreferrer">{ui.readMore}</a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
