export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://urania.localhost";

export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const SITE_NAME: Record<Locale, string> = {
  en: "Star Myths — The Constellations & Their Greek Myths",
  ar: "أساطير النجوم — الكوكبات وأساطيرها الإغريقية",
};

export const SITE_DESC: Record<Locale, string> = {
  en: "A complete bilingual (English/Arabic) illustrated guide to the constellations and their Greek myths, told with the hand-coloured 1824 engravings of Urania's Mirror — with quizzes, star-name flashcards and a history timeline from Babylon to the IAU.",
  ar: "دليل مصوَّر شامل ثنائي اللغة (عربي/إنجليزي) للكوكبات وأساطيرها الإغريقية، مرويًّا بلوحات «مرآة أورانيا» الملوّنة يدويًا (1824) — مع اختبارات وبطاقات أسماء النجوم وخط زمني من بابل إلى الاتحاد الفلكي الدولي.",
};

/** Strip HTML tags from content strings for use in meta descriptions. */
export function strip(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

/** hreflang alternates for a subpath like "/chapters/royal" (empty string for home). */
export function langAlternates(subpath: string) {
  return {
    languages: {
      en: `${SITE_URL}/en${subpath}`,
      ar: `${SITE_URL}/ar${subpath}`,
      "x-default": `${SITE_URL}/en${subpath}`,
    },
  };
}

export function ogLocale(locale: Locale) {
  return locale === "ar" ? "ar_EG" : "en_US";
}
