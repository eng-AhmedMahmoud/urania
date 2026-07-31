"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UI2 } from "@/lib/content";
import { EVENTS_UI, START_UI } from "@/lib/extra2";

export default function Nav({ locale }: { locale: "en" | "ar" }) {
  const pathname = usePathname() || `/${locale}`;
  const ui = UI2[locale];
  const other = locale === "en" ? "ar" : "en";
  const switched = pathname.replace(/^\/(en|ar)/, `/${other}`);

  const links = [
    { href: `/${locale}/start-here`, label: START_UI[locale].nav },
    { href: `/${locale}/events`, label: EVENTS_UI[locale].nav },
    { href: `/${locale}/timeline`, label: ui.navTimeline },
    { href: `/${locale}/learn`, label: ui.navLearn },
    { href: `/${locale}/star-names`, label: ui.navCards },
    { href: `/${locale}/resources`, label: ui.navResources },
    { href: `/${locale}/about`, label: ui.navAbout },
  ];

  return (
    <nav className="nav">
      <Link href={`/${locale}`} className="brand">{ui.brand}</Link>
      <div className="links">
        {links.map(l => (
          <Link key={l.href} href={l.href} className={pathname.startsWith(l.href) ? "active" : ""}>
            {l.label}
          </Link>
        ))}
        <Link href={switched} className="lang-btn" rel="alternate" hrefLang={other}>
          {locale === "en" ? "العربية" : "English"}
        </Link>
      </div>
    </nav>
  );
}
