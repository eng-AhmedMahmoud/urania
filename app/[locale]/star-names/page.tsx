import type { Metadata } from "next";
import Flashcards from "@/components/Flashcards";
import { UI, UI2 } from "@/lib/content";
import { Locale, SITE_URL, langAlternates } from "@/lib/site";

type Params = Promise<{ locale: Locale }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: UI2[locale].navCards,
    description: UI[locale].cardsLede,
    alternates: { canonical: `${SITE_URL}/${locale}/star-names`, ...langAlternates("/star-names") },
  };
}

export default async function StarNamesPage({ params }: { params: Params }) {
  const { locale } = await params;
  const ui = UI[locale];

  return (
    <main className="wrap">
      <header className="chapter-hero">
        <h1>{ui.cardsTitle}</h1>
        <p className="lede">{ui.cardsLede}</p>
      </header>
      <Flashcards locale={locale} />
    </main>
  );
}
