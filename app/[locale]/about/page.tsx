import type { Metadata } from "next";
import { ABOUT, UI } from "@/lib/content";
import { Locale, SITE_URL, langAlternates, strip } from "@/lib/site";

type Params = Promise<{ locale: Locale }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const ui = UI[locale];
  return {
    title: ui.aboutTitle,
    description: strip(ui.aboutLede),
    alternates: { canonical: `${SITE_URL}/${locale}/about`, ...langAlternates("/about") },
  };
}

export default async function AboutPage({ params }: { params: Params }) {
  const { locale } = await params;
  const ui = UI[locale];

  return (
    <main className="wrap">
      <header className="chapter-hero">
        <h1>{ui.aboutTitle}</h1>
        <p className="lede" dangerouslySetInnerHTML={{ __html: ui.aboutLede }} />
      </header>
      <div className="facts">
        {ABOUT.map((f: any, i: number) => (
          <div className="fact" key={i}>
            <b>{f[locale].t}</b>
            {f[locale].d}
          </div>
        ))}
      </div>
    </main>
  );
}
