import type { Metadata } from "next";
import { Aref_Ruqaa, Cairo, Cinzel } from "next/font/google";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Starfield from "@/components/Starfield";
import { UI } from "@/lib/content";
import { LOCALES, Locale, SITE_DESC, SITE_NAME, SITE_URL, langAlternates, ogLocale } from "@/lib/site";
import "../globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-display-ar",
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (LOCALES.includes(raw as Locale) ? raw : "en") as Locale;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME[locale],
      template: locale === "ar" ? "%s · أساطير النجوم" : "%s · Star Myths",
    },
    description: SITE_DESC[locale],
    alternates: { canonical: `${SITE_URL}/${locale}`, ...langAlternates("") },
    openGraph: {
      type: "website",
      siteName: SITE_NAME[locale],
      locale: ogLocale(locale),
      images: [{ url: "/myth/cassiopeia.jpg", width: 1100, height: 1540 }],
    },
    twitter: { card: "summary_large_image" },
    keywords: locale === "ar"
      ? ["كوكبات", "أساطير إغريقية", "علم الفلك", "أسماء النجوم العربية", "مرآة أورانيا", "دائرة البروج", "الصوفي"]
      : ["constellations", "greek mythology", "astronomy", "star names", "Urania's Mirror", "zodiac", "Al-Sufi", "star myths"],
  };
}

export default async function RootLayout(
  { children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }
) {
  const { locale: raw } = await params;
  if (!LOCALES.includes(raw as Locale)) notFound();
  const locale = raw as Locale;

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${cairo.variable} ${cinzel.variable} ${arefRuqaa.variable}`}
    >
      <body>
        <Starfield />
        <Nav locale={locale} />
        {children}
        <footer
          className="site-footer"
          dangerouslySetInnerHTML={{ __html: UI[locale].footer }}
        />
      </body>
    </html>
  );
}
