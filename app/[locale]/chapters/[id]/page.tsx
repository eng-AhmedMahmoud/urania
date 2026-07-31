import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PlateFigure from "@/components/PlateFigure";
import { CHAPTERS, UI2 } from "@/lib/content";
import { LOCALES, Locale, SITE_URL, langAlternates, ogLocale, strip } from "@/lib/site";

type Params = Promise<{ locale: Locale; id: string }>;

export function generateStaticParams() {
  return LOCALES.flatMap(locale => CHAPTERS.map((c: any) => ({ locale, id: c.id })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, id } = await params;
  const chapter = CHAPTERS.find((c: any) => c.id === id);
  if (!chapter) return {};
  const title = strip(chapter.title[locale]);
  const description = strip(chapter.lede[locale]);
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/chapters/${id}`,
      ...langAlternates(`/chapters/${id}`),
    },
    openGraph: {
      type: "article",
      title,
      description,
      locale: ogLocale(locale),
      images: [{ url: chapter.panels[0].img }],
    },
  };
}

export default async function ChapterPage({ params }: { params: Params }) {
  const { locale, id } = await params;
  const idx = CHAPTERS.findIndex((c: any) => c.id === id);
  if (idx === -1) notFound();
  const chapter = CHAPTERS[idx];
  const prev = CHAPTERS[idx - 1];
  const next = CHAPTERS[idx + 1];
  const ui2 = UI2[locale];
  // "back" points toward the reading start: left in LTR, right in RTL
  const backArrow = locale === "ar" ? "→" : "←";
  const fwdArrow = locale === "ar" ? "←" : "→";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: strip(chapter.title[locale]),
    description: strip(chapter.lede[locale]),
    image: chapter.panels.map((p: any) => `${SITE_URL}${p.img}`),
    inLanguage: locale === "ar" ? "ar" : "en",
    mainEntityOfPage: `${SITE_URL}/${locale}/chapters/${id}`,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: ui2.navHome, item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: strip(chapter.title[locale]), item: `${SITE_URL}/${locale}/chapters/${id}` },
    ],
  };

  return (
    <main className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <header className="chapter-hero">
        <div className="num">{chapter.num[locale]}</div>
        <h1>{chapter.title[locale]}</h1>
        <p className="lede" dangerouslySetInnerHTML={{ __html: chapter.lede[locale] }} />
      </header>

      {chapter.panels.map((p: any, i: number) => (
        <section className={`panel ${i % 2 ? "flip" : ""}`} key={p.img + i}>
          <PlateFigure
            src={p.img}
            caption={strip(p.cap[locale])}
            alt={strip(p.title[locale])}
          />
          <div className="story">
            <h3>{p.title[locale]}</h3>
            <div className="sub" dangerouslySetInnerHTML={{ __html: p.sub[locale] }} />
            {p.paras.map((par: any, j: number) => (
              <p key={j} dangerouslySetInnerHTML={{ __html: par[locale] }} />
            ))}
            <div className="sky" dangerouslySetInnerHTML={{ __html: p.sky[locale] }} />
          </div>
        </section>
      ))}

      <nav className="chapter-nav">
        {prev ? (
          <Link href={`/${locale}/chapters/${prev.id}`}>
            <span className="dir">{backArrow} {ui2.prev}</span>
            {strip(prev.title[locale])}
          </Link>
        ) : <span />}
        <Link href={`/${locale}`}>{ui2.backHome}</Link>
        {next ? (
          <Link href={`/${locale}/chapters/${next.id}`}>
            <span className="dir">{ui2.next} {fwdArrow}</span>
            {strip(next.title[locale])}
          </Link>
        ) : <span />}
      </nav>
    </main>
  );
}
