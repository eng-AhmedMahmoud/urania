"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { starBurst } from "@/components/games/burst";
import { CARDS } from "@/lib/content";
import { GAMES_UI } from "@/lib/games-ui";

const PAIRS = 8;
const BEST_KEY = "urania_match_best";

type MatchCard = { key: string; pairId: number; label: string; ar: boolean };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildDeck(): MatchCard[] {
  const picks = shuffle(CARDS).slice(0, PAIRS);
  const deck: MatchCard[] = [];
  picks.forEach((c: { name: string; arabic: string }, i: number) => {
    deck.push({ key: `${i}-latin`, pairId: i, label: c.name, ar: false });
    deck.push({ key: `${i}-ar`, pairId: i, label: c.arabic, ar: true });
  });
  return shuffle(deck);
}

export default function StarMatch({ locale }: { locale: "en" | "ar" }) {
  const g = GAMES_UI[locale];
  const boxRef = useRef<HTMLDivElement>(null);

  const [deck, setDeck] = useState<MatchCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [savedBest, setSavedBest] = useState(false);
  const lockRef = useRef(false);

  useEffect(() => {
    setDeck(buildDeck());
    const b = localStorage.getItem(BEST_KEY);
    if (b) setBest(Number(b));
  }, []);

  const reset = useCallback(() => {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setSavedBest(false);
    lockRef.current = false;
  }, []);

  const won = deck.length > 0 && matched.size === PAIRS;

  useEffect(() => {
    if (!won || savedBest) return;
    setSavedBest(true);
    if (boxRef.current) starBurst(boxRef.current, 26);
    if (best === null || moves < best) {
      localStorage.setItem(BEST_KEY, String(moves));
      setBest(moves);
    }
  }, [won, savedBest, moves, best]);

  const flip = (card: MatchCard) => {
    if (lockRef.current || won) return;
    if (matched.has(card.pairId) || flipped.includes(card.key)) return;

    const nowFlipped = [...flipped, card.key];
    setFlipped(nowFlipped);

    if (nowFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = nowFlipped.map(k => deck.find(c => c.key === k)!);
      if (a.pairId === b.pairId) {
        setMatched(prev => new Set(prev).add(a.pairId));
        setFlipped([]);
        const el = boxRef.current?.querySelector<HTMLElement>(`[data-key="${card.key}"]`);
        if (el) starBurst(el, 8);
      } else {
        lockRef.current = true;
        setTimeout(() => {
          setFlipped([]);
          lockRef.current = false;
        }, 750);
      }
    }
  };

  return (
    <div className="quiz-box game-stage" ref={boxRef}>
      <p className="section-sub" style={{ marginBottom: 14 }}>{g.matchLede}</p>
      <div className="quiz-meta">
        <span>{g.moves}: {moves}</span>
        <span>{g.pairs}: {matched.size} / {PAIRS}</span>
        {best !== null && <span>{g.best}: {best}</span>}
      </div>

      {won ? (
        <div>
          <div className="end-grade">🌌 {g.matchWin}</div>
          <div className="quiz-q">{g.moves}: {moves}</div>
          {best !== null && moves <= best && <div className="new-best">{g.newBest}</div>}
          <p className="section-sub">{g.matchWinSub}</p>
          <button className="btn" onClick={reset}>{g.shuffle}</button>
        </div>
      ) : (
        <div className="match-grid">
          {deck.map((card, i) => {
            const isUp = flipped.includes(card.key) || matched.has(card.pairId);
            return (
              <button
                key={card.key}
                data-key={card.key}
                className={`mcard ${isUp ? "up" : ""} ${matched.has(card.pairId) ? "done" : ""}`}
                style={{ animationDelay: `${i * 0.035}s` }}
                onClick={() => flip(card)}
                aria-label={isUp ? card.label : "hidden card"}
              >
                <span className="mcard-inner">
                  <span className="mface mback">✦</span>
                  <span className={`mface mfront ${card.ar ? "is-ar" : "is-latin"}`}>{card.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
