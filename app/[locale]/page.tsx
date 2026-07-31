import Image from "next/image";
import Link from "next/link";
import { CHAPTERS, FACTS, UI, UI2 } from "@/lib/content";
import { EVENTS_UI, START_UI } from "@/lib/extra2";
import { Locale, SITE_DESC, SITE_NAME, SITE_URL, strip } from "@/lib/site";

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const ui = UI[locale];
  const ui2 = UI2[locale];

  const explore = [
    { href: `/${locale}/start-here`, icon: "🌱", title: START_UI[locale].nav, desc: START_UI[locale].lede },
    { href: `/${locale}/events`, icon: "🌠", title: EVENTS_UI[locale].nav, desc: EVENTS_UI[locale].lede },
    { href: `/${locale}/timeline`, icon: "🏛️", title: ui2.navTimeline, desc: ui.tlLede },
    { href: `/${locale}/learn`, icon: "🎯", title: ui2.navLearn, desc: ui.quizLede },
    { href: `/${locale}/star-names`, icon: "⭐", title: ui2.navCards, desc: ui.cardsLede },
    { href: `/${locale}/resources`, icon: "🔭", title: ui2.navResources, desc: UI2[locale].resLede },
    { href: `/${locale}/about`, icon: "🖼️", title: ui2.navAbout, desc: strip(ui.aboutLede) },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME[locale],
    url: `${SITE_URL}/${locale}`,
    description: SITE_DESC[locale],
    inLanguage: locale === "ar" ? "ar" : "en",
  };

  return (
    <main className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="hero">
        <div className="kicker">{ui.kicker}</div>
        <h1 dangerouslySetInnerHTML={{ __html: ui.title }} />
        <p dangerouslySetInnerHTML={{ __html: ui.heroP }} />
        <div className="cta-row">
          <Link href={`/${locale}/start-here`} className="btn-hero">
            🌱 {START_UI[locale].nav}
          </Link>
          <Link href={`/${locale}/chapters/royal`} className="btn-hero ghost">
            {START_UI[locale].ctaChapters}
          </Link>
        </div>
        <div className="rule" />
      </div>

      <h2 className="section-head">{ui2.chaptersHead}</h2>
      <p className="section-sub">{ui2.chaptersSub}</p>
      <div className="chapter-grid">
        {CHAPTERS.map((c: any) => (
          <Link key={c.id} href={`/${locale}/chapters/${c.id}`} className="chapter-card">
            <span className="thumb" style={{ display: "block" }}>
              <Image
                src={c.panels[0].img}
                alt={strip(c.panels[0].cap[locale])}
                fill
                sizes="(max-width: 700px) 92vw, 340px"
              />
            </span>
            <span className="badge">{c.panels.length} × 🖼</span>
            <span className="body" style={{ display: "block" }}>
              <span className="num">{c.num[locale]}</span>
              <h3>{c.title[locale]}</h3>
              <p>{strip(c.lede[locale])}</p>
            </span>
          </Link>
        ))}
      </div>

      <h2 className="section-head">{ui2.exploreHead}</h2>
      <div className="explore-grid">
        {explore.map(e => (
          <Link key={e.href} href={e.href} className="explore-card">
            <span className="icon">{e.icon}</span>
            <h3>{e.title}</h3>
            <p>{e.desc}</p>
          </Link>
        ))}
      </div>

      <div className="facts">
        {FACTS.map((f: any, i: number) => (
          <div className="fact" key={i}>
            <b>{f[locale].t}</b>
            {f[locale].d}
          </div>
        ))}
      </div>

      <div className="cta-band">
        <h2>{START_UI[locale].homeBandTitle}</h2>
        <p>{START_UI[locale].homeBandSub}</p>
        <div className="cta-row">
          <Link href={`/${locale}/chapters/royal`} className="btn-hero">
            {START_UI[locale].ctaChapters}
          </Link>
          <Link href={`/${locale}/events`} className="btn-hero ghost">
            {START_UI[locale].ctaEvents}
          </Link>
        </div>
      </div>
    </main>
  );
}
