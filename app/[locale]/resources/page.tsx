import type { Metadata } from "next";
import { OBS_TIPS, RESOURCES, UI2 } from "@/lib/content";
import { Locale, SITE_URL, langAlternates } from "@/lib/site";

type Params = Promise<{ locale: Locale }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const ui2 = UI2[locale];
  return {
    title: ui2.resTitle,
    description: ui2.resLede,
    alternates: { canonical: `${SITE_URL}/${locale}/resources`, ...langAlternates("/resources") },
  };
}

export default async function ResourcesPage({ params }: { params: Params }) {
  const { locale } = await params;
  const ui2 = UI2[locale];

  return (
    <main className="wrap">
      <header className="chapter-hero">
        <h1>{ui2.resTitle}</h1>
        <p className="lede">{ui2.resLede}</p>
      </header>

      <div className="res-grid">
        {RESOURCES.map((r: any) => (
          <div className="res-card" key={r.url}>
            <span className="tag">{r.tag[locale]}</span>
            <h3>{r.t[locale]}</h3>
            <p>{r.d[locale]}</p>
            <a href={r.url} target="_blank" rel="noopener noreferrer">{ui2.visit}</a>
          </div>
        ))}
      </div>

      <h2 className="section-head">{ui2.obsTitle}</h2>
      <p className="section-sub">{ui2.obsLede}</p>
      <div className="tips">
        {OBS_TIPS.map((t: any, i: number) => (
          <div className="tip" key={i}>{t[locale]}</div>
        ))}
      </div>
    </main>
  );
}
