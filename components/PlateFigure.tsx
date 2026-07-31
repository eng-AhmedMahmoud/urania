"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function PlateFigure({ src, caption, alt }: { src: string; caption: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" className="art" onClick={() => setOpen(true)} aria-label={alt}>
        <span className="art-img" style={{ display: "block" }}>
          <Image src={src} alt={alt} fill sizes="(max-width: 820px) 92vw, 480px" />
        </span>
        <span className="cap" style={{ display: "block" }}>{caption}</span>
      </button>
      {open && (
        <div className="lightbox" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} />
        </div>
      )}
    </>
  );
}
