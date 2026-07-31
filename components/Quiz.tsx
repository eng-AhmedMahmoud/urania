"use client";

import { useEffect, useRef, useState } from "react";
import { starBurst, shake } from "@/components/games/burst";
import { QUIZ, UI } from "@/lib/content";
import { GAMES_UI } from "@/lib/games-ui";

const QUESTION_SECONDS = 20;
const BEST_KEY = "urania_quiz_best";

export default function Quiz({ locale }: { locale: "en" | "ar" }) {
  const ui = UI[locale];
  const g = GAMES_UI[locale];
  const boxRef = useRef<HTMLDivElement>(null);

  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [secs, setSecs] = useState(QUESTION_SECONDS);
  const [best, setBest] = useState<number | null>(null);
  const [savedBest, setSavedBest] = useState(false);

  const done = idx >= QUIZ.length;
  const answered = picked !== null;

  useEffect(() => {
    const b = localStorage.getItem(BEST_KEY);
    if (b) setBest(Number(b));
  }, []);

  // countdown
  useEffect(() => {
    if (done || answered) return;
    if (secs <= 0) return;
    const t = setInterval(() => setSecs(s => Math.max(0, s - 0.1)), 100);
    return () => clearInterval(t);
  }, [idx, answered, done, secs <= 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // persist best at end
  useEffect(() => {
    if (!done || savedBest) return;
    setSavedBest(true);
    if (best === null || points > best) {
      localStorage.setItem(BEST_KEY, String(points));
      setBest(points);
      if (boxRef.current) starBurst(boxRef.current, 24);
    }
  }, [done, savedBest, points, best]);

  if (done) {
    const grade = [...g.grades].reverse().find((gr: { min: number }) => correct >= gr.min);
    const isNewBest = best !== null && points >= best && savedBest;
    return (
      <div className="quiz-box game-stage" ref={boxRef}>
        <div className="end-grade">🏆 {grade?.t}</div>
        <div className="quiz-q">{g.finalTitle}: {correct} / {QUIZ.length} · ✦ {points}</div>
        {isNewBest && <div className="new-best">{g.newBest}</div>}
        {best !== null && <div className="quiz-meta"><span>{g.best}: ✦ {best}</span></div>}
        <button
          className="btn"
          onClick={() => {
            setIdx(0); setCorrect(0); setPoints(0); setStreak(0);
            setPicked(null); setSecs(QUESTION_SECONDS); setSavedBest(false);
          }}
        >
          {ui.restart}
        </button>
      </div>
    );
  }

  const q = QUIZ[idx];
  const timerPct = (secs / QUESTION_SECONDS) * 100;

  return (
    <div className="quiz-box game-stage" ref={boxRef}>
      <div className="quiz-meta">
        <span>{g.qWord} {idx + 1} / {QUIZ.length}</span>
        <span>🔥 {streak}</span>
        <span>✦ {points}</span>
      </div>
      <div className="timer-track" aria-hidden="true">
        <div
          className={`timer-fill ${secs < 5 ? "low" : ""}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>
      {secs <= 0 && !answered && <div className="quiz-why">{g.timeUp}</div>}
      <div key={idx} className="q-anim">
      <div className="quiz-q">{q.q[locale]}</div>
      {q.opts.map((o: { en: string; ar: string }, i: number) => {
        let cls = "quiz-opt";
        if (answered && i === q.correct) cls += " ok";
        else if (answered && i === picked) cls += " bad";
        return (
          <button
            key={i}
            className={cls}
            onClick={e => {
              if (answered) return;
              setPicked(i);
              if (i === q.correct) {
                const bonus = Math.floor(Math.max(0, secs) / 2);
                setCorrect(c => c + 1);
                setStreak(s => s + 1);
                setPoints(p => p + 10 + bonus + streak * 2);
                starBurst(e.currentTarget as HTMLElement);
              } else {
                setStreak(0);
                shake(e.currentTarget as HTMLElement);
              }
            }}
          >
            {o[locale]}
          </button>
        );
      })}
      {answered && (
        <div className="quiz-why">
          {q.why[locale]}
          {picked === q.correct && secs > 0 && (
            <span className="bonus-note"> · +{Math.floor(secs / 2)} {g.timeBonus} ⚡</span>
          )}
        </div>
      )}
      </div>
      <button
        className="btn"
        disabled={!answered}
        onClick={() => { setIdx(i => i + 1); setPicked(null); setSecs(QUESTION_SECONDS); }}
      >
        {g.next}
      </button>
    </div>
  );
}
