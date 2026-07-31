"use client";

import { useState } from "react";
import { CARDS, UI } from "@/lib/content";

export default function Flashcards({ locale }: { locale: "en" | "ar" }) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  return (
    <div className="cards-grid">
      {CARDS.map(c => (
        <div
          key={c.name}
          className={`fcard ${flipped[c.name] ? "flipped" : ""}`}
          onClick={() => setFlipped(f => ({ ...f, [c.name]: !f[c.name] }))}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped(f => ({ ...f, [c.name]: !f[c.name] }));
            }
          }}
        >
          <div className="fcard-inner">
            <div className="fface front">
              <div className="star-name">{c.name}</div>
              <div className="star-ar">{c.arabic}</div>
            </div>
            <div className="fface back">
              <div className="m">{c.meaning[locale]}</div>
              <div className="h">{UI[locale].cardHome}: {c.home[locale]}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
