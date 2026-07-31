import type { MetadataRoute } from "next";
import { CHAPTERS } from "@/lib/content";
import { LOCALES, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const subpaths = [
    "",
    ...CHAPTERS.map((c: { id: string }) => `/chapters/${c.id}`),
    "/start-here",
    "/events",
    "/timeline",
    "/learn",
    "/star-names",
    "/resources",
    "/about",
  ];

  return subpaths.flatMap(sub =>
    LOCALES.map(locale => ({
      url: `${SITE_URL}/${locale}${sub}`,
      changeFrequency: "monthly" as const,
      priority: sub === "" ? 1 : sub.startsWith("/chapters") ? 0.8 : 0.6,
      alternates: {
        languages: {
          en: `${SITE_URL}/en${sub}`,
          ar: `${SITE_URL}/ar${sub}`,
        },
      },
    }))
  );
}
