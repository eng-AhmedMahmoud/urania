import type { Metadata } from "next";
import Link from "next/link";
import { START_UI } from "@/lib/extra2";
import { Locale, SITE_URL, langAlternates } from "@/lib/site";

type Params = Promise<{ locale: Locale }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const ui = START_UI[locale];
  return {
    title: ui.title,
    description: ui.lede,
    alternates: { canonical: `${SITE_URL}/${locale}/start-here`, ...langAlternates("/start-here") },
  };
}

export default async function StartHerePage({ params }: { params: Params }) {
  const { locale } = await params;
  const ui = START_UI[locale];

  return (
    <main className="wrap">
      <header className="chapter-hero">
        <h1>{ui.title}</h1>
        <p className="lede">{ui.lede}</p>
      </header>

      <h2 className="section-head">{ui.skyIn5Head}</h2>
      <div className="tips">
        {ui.skyIn5.map((s: string, i: number) => (
          <div className="tip" key={i}>{s}</div>
        ))}
      </div>

      <h2 className="section-head">{ui.glossHead}</h2>
      <div className="facts">
        {ui.gloss.map((g: { t: string; d: string }, i: number) => (
          <div className="fact" key={i}>
            <b>{g.t}</b>
            {g.d}
          </div>
        ))}
      </div>

      <h2 className="section-head">{ui.stepsHead}</h2>
      <div className="facts">
        {ui.steps.map((s: { t: string; d: string }, i: number) => (
          <div className="fact" key={i}>
            <b>{i + 1}. {s.t}</b>
            {s.d}
          </div>
        ))}
      </div>

      <nav className="chapter-nav">
        <Link href={`/${locale}/chapters/royal`}>{ui.ctaChapters}</Link>
        <Link href={`/${locale}/events`}>{ui.ctaEvents}</Link>
      </nav>
    </main>
  );
}
