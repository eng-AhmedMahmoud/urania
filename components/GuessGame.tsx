"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { starBurst, shake } from "@/components/games/burst";
import { GUESS_POOL } from "@/lib/content";
import { GAMES_UI } from "@/lib/games-ui";

type Entry = (typeof GUESS_POOL)[number];
const BEST_KEY = "urania_guess_best";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function GuessGame({ locale }: { locale: "en" | "ar" }) {
  const g = GAMES_UI[locale];
  const boxRef = useRef<HTMLDivElement>(null);

  const [answer, setAnswer] = useState<Entry | null>(null);
  const [opts, setOpts] = useState<Entry[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [best, setBest] = useState(0);

  useEffect(() => {
    const b = localStorage.getItem(BEST_KEY);
    if (b) setBest(Number(b));
  }, []);

  const deal = useCallback(() => {
    const pool = shuffle(GUESS_POOL);
    setAnswer(pool[0]);
    setOpts(shuffle(pool.slice(0, 4)));
    setPicked(null);
  }, []);

  useEffect(() => { deal(); }, [deal]);

  if (!answer) return <div className="guess-box game-stage" />;

  const answered = picked !== null;
  const right = picked === answer.name.en;

  return (
    <div className="guess-box game-stage" ref={boxRef}>
      <div className="quiz-meta">
        <span>{g.round} {round}</span>
        <span>🔥 {streak}</span>
        <span>{g.bestStreak}: {best}</span>
      </div>
      <div key={`${round}-${answer.name.en}`} className="g-anim">
      <div className="guess-img">
        <div className="g-wrap">
          <Image src={answer.img} alt="mystery constellation plate" fill sizes="(max-width: 900px) 92vw, 460px" />
        </div>
      </div>
      {opts.map(o => {
        let cls = "quiz-opt";
        if (answered && o.name.en === answer.name.en) cls += " ok";
        else if (answered && o.name.en === picked) cls += " bad";
        return (
          <button
            key={o.name.en}
            className={cls}
            onClick={e => {
              if (answered) return;
              setPicked(o.name.en);
              if (o.name.en === answer.name.en) {
                const s = streak + 1;
                setStreak(s);
                if (s > best) {
                  setBest(s);
                  localStorage.setItem(BEST_KEY, String(s));
                }
                starBurst(e.currentTarget as HTMLElement);
              } else {
                setStreak(0);
                shake(e.currentTarget as HTMLElement);
              }
            }}
          >
            {o.name[locale]}
          </button>
        );
      })}
      </div>
      <div className={`guess-feedback ${answered ? (right ? "ok" : "bad") : ""}`}>
        {answered && (right ? g.right : `${g.wrong} ${answer.name[locale]}`)}
      </div>
      {answered && (
        <button className="btn ghost" onClick={() => { setRound(r => r + 1); deal(); }}>
          {g.another}
        </button>
      )}
    </div>
  );
}
