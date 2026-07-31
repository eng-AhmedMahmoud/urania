"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function PageFx() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Hero entrance (home)
      if (document.querySelector(".hero")) {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from(".hero .kicker", { y: 24, opacity: 0, duration: 0.6 })
          .from(".hero h1", { y: 44, opacity: 0, scale: 0.96, filter: "blur(10px)", duration: 0.9 }, "-=0.3")
          .from(".hero p", { y: 24, opacity: 0, duration: 0.7 }, "-=0.5")
          .from(".hero .btn", { y: 16, opacity: 0, scale: 0.9, duration: 0.5 }, "-=0.4")
          .from(".hero .rule", { scaleX: 0, duration: 0.8 }, "-=0.3");
      }

      // Sub-page headers
      if (document.querySelector(".chapter-hero")) {
        gsap.from(".chapter-hero > *", {
          y: 30, opacity: 0, stagger: 0.12, duration: 0.7, ease: "power3.out",
        });
      }

      // Generic scroll reveals (cards, facts, tips, timeline entries…)
      gsap.utils
        .toArray<HTMLElement>(
          ".chapter-card, .explore-card, .fact, .res-card, .tip, .tl details, .fcard, .section-head, .section-sub"
        )
        .forEach(el => {
          gsap.from(el, {
            y: 36, opacity: 0, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

      // Story panels: plate slides in from its side, text rises
      gsap.utils.toArray<HTMLElement>(".panel").forEach(el => {
        const art = el.querySelector(".art");
        const story = el.querySelector(".story");
        const fromX = el.classList.contains("flip") ? 60 : -60;
        if (art) {
          gsap.from(art, {
            x: fromX, opacity: 0, duration: 0.85, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        }
        if (story) {
          gsap.from(story, {
            y: 44, opacity: 0, duration: 0.85, delay: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        }
      });
    });
    return () => mm.revert();
  });

  return null;
}
