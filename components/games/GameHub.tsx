"use client";

import { useState } from "react";
import GuessGame from "@/components/GuessGame";
import Quiz from "@/components/Quiz";
import StarMatch from "@/components/games/StarMatch";
import { GAMES_UI } from "@/lib/games-ui";

type GameId = "quiz" | "guess" | "match";

export default function GameHub({ locale }: { locale: "en" | "ar" }) {
  const g = GAMES_UI[locale];
  const [game, setGame] = useState<GameId>("quiz");

  const tabs: { id: GameId; icon: string; label: string }[] = [
    { id: "quiz", icon: "🎯", label: g.tabQuiz },
    { id: "guess", icon: "🖼️", label: g.tabGuess },
    { id: "match", icon: "🃏", label: g.tabMatch },
  ];

  return (
    <div>
      <div className="game-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`game-tab ${game === t.id ? "active" : ""}`}
            onClick={() => setGame(t.id)}
          >
            <span className="game-tab-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
      <div key={game} className="game-stage-wrap stage-anim">
        {game === "quiz" && <Quiz locale={locale} />}
        {game === "guess" && <GuessGame locale={locale} />}
        {game === "match" && <StarMatch locale={locale} />}
      </div>
    </div>
  );
}
