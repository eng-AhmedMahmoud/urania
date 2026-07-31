import gsap from "gsap";

/** Gold star burst centered on an element. Cleans itself up. */
export function starBurst(el: HTMLElement, count = 16) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.textContent = Math.random() > 0.5 ? "✦" : "⭐";
    Object.assign(star.style, {
      position: "fixed",
      left: `${cx}px`,
      top: `${cy}px`,
      fontSize: `${10 + Math.random() * 14}px`,
      pointerEvents: "none",
      zIndex: "60",
      color: "#e8c76a",
    } as CSSStyleDeclaration);
    document.body.appendChild(star);

    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist = 60 + Math.random() * 110;
    gsap.to(star, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 30,
      rotation: Math.random() * 260 - 130,
      opacity: 0,
      scale: 0.4,
      duration: 0.9 + Math.random() * 0.5,
      ease: "power2.out",
      onComplete: () => star.remove(),
    });
  }
}

/** Horizontal error shake. */
export function shake(el: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.fromTo(el, { x: 0 }, { x: 9, duration: 0.06, repeat: 5, yoyo: true, clearProps: "x" });
}
