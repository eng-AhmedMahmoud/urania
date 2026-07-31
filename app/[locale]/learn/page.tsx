import type { Metadata } from "next";
import GameHub from "@/components/games/GameHub";
import { UI, UI2 } from "@/lib/content";
import { GAMES_UI } from "@/lib/games-ui";
import { Locale, SITE_URL, langAlternates } from "@/lib/site";

type Params = Promise<{ locale: Locale }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: UI2[locale].navLearn,
    description: UI[locale].quizLede,
    alternates: { canonical: `${SITE_URL}/${locale}/learn`, ...langAlternates("/learn") },
  };
}

export default async function LearnPage({ params }: { params: Params }) {
  const { locale } = await params;
  const g = GAMES_UI[locale];

  return (
    <main className="wrap">
      <header className="chapter-hero">
        <h1>{g.hubTitle}</h1>
        <p className="lede">{g.hubLede}</p>
      </header>
      <GameHub locale={locale} />
    </main>
  );
}
