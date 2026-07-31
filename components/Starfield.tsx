"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; phase: number; speed: number; drift: number };
type Shooter = { x: number; y: number; vx: number; vy: number; life: number };

export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let shooter: Shooter | null = null;
    let raf = 0;
    let nextShooter = performance.now() + 4000;

    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      const count = Math.min(320, Math.floor((window.innerWidth * window.innerHeight) / 3800));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: (Math.random() * 1.3 + 0.3) * devicePixelRatio,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.2,
        drift: (0.008 + Math.random() * 0.02) * devicePixelRatio,
      }));
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const frame = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const tw = reduced ? 0.75 : 0.55 + 0.45 * Math.sin(s.phase + (t / 1000) * s.speed);
        ctx.globalAlpha = tw;
        ctx.fillStyle = "#e9e6db";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (!reduced) {
          s.x += s.drift;
          if (s.x > canvas.width + 4) s.x = -4;
        }
      }
      if (!reduced) {
        if (!shooter && t > nextShooter) {
          const fromLeft = Math.random() > 0.5;
          shooter = {
            x: fromLeft ? -50 : Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.4,
            vx: (7 + Math.random() * 6) * devicePixelRatio,
            vy: (2.5 + Math.random() * 2) * devicePixelRatio,
            life: 1,
          };
          nextShooter = t + 5000 + Math.random() * 9000;
        }
        if (shooter) {
          shooter.x += shooter.vx;
          shooter.y += shooter.vy;
          shooter.life -= 0.016;
          ctx.globalAlpha = Math.max(shooter.life, 0);
          const grad = ctx.createLinearGradient(
            shooter.x, shooter.y,
            shooter.x - shooter.vx * 9, shooter.y - shooter.vy * 9
          );
          grad.addColorStop(0, "#fff");
          grad.addColorStop(1, "transparent");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6 * devicePixelRatio;
          ctx.beginPath();
          ctx.moveTo(shooter.x, shooter.y);
          ctx.lineTo(shooter.x - shooter.vx * 9, shooter.y - shooter.vy * 9);
          ctx.stroke();
          if (shooter.life <= 0 || shooter.x > canvas.width + 200) shooter = null;
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas id="starfield" ref={ref} aria-hidden="true" />;
}
