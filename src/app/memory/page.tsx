"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { PHOTOS } from "@/lib/photos";

interface Card {
  id: number;
  photoId: number;
  src: string;
  flipped: boolean;
  matched: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createDeck(): Card[] {
  const selected = shuffleArray(PHOTOS).slice(0, 8);
  const pairs: Card[] = [];
  selected.forEach((photo, index) => {
    pairs.push({ id: index * 2, photoId: photo.id, src: photo.src, flipped: false, matched: false });
    pairs.push({ id: index * 2 + 1, photoId: photo.id, src: photo.src, flipped: false, matched: false });
  });
  return shuffleArray(pairs);
}

function Confetti() {
  const colors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A78BFA", "#FF8E8E", "#6FE8DF"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[i % colors.length],
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            animationDuration: `${2 + Math.random() * 2}s`,
            animationDelay: `${Math.random() * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startNewGame = useCallback(() => {
    setCards(createDeck());
    setFlippedIds([]);
    setMoves(0);
    setMatchedCount(0);
    setTimer(0);
    setGameStarted(false);
    setGameWon(false);
    setIsChecking(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    startNewGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startNewGame]);

  useEffect(() => {
    if (gameStarted && !gameWon) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gameStarted, gameWon]);

  useEffect(() => {
    if (matchedCount === 8 && matchedCount > 0) {
      setGameWon(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [matchedCount]);

  const handleCardClick = (cardId: number) => {
    if (isChecking) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.flipped || card.matched) return;
    if (flippedIds.includes(cardId)) return;

    if (!gameStarted) setGameStarted(true);

    const newFlipped = [...flippedIds, cardId];
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, flipped: true } : c))
    );
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsChecking(true);
      const [firstId, secondId] = newFlipped;
      const first = cards.find((c) => c.id === firstId)!;
      const second = cards.find((c) => c.id === secondId)!;

      if (first.photoId === second.photoId) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, matched: true }
                : c
            )
          );
          setMatchedCount((m) => m + 1);
          setFlippedIds([]);
          setIsChecking(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, flipped: false }
                : c
            )
          );
          setFlippedIds([]);
          setIsChecking(false);
        }, 900);
      }
    }
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStars = () => {
    if (moves <= 10) return 3;
    if (moves <= 16) return 2;
    return 1;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 md:py-10">
      {gameWon && <Confetti />}

      {/* Header */}
      <div className="text-center mb-6 animate-fade-in-up">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate mb-1">
          🧠 Memory Match
        </h1>
        <p className="text-slate-light font-body text-sm">
          Find all matching pairs!
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex justify-between items-center mb-5 px-2">
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
          <span className="text-sm font-bold font-display text-coral">
            Moves: {moves}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
          <span className="text-sm font-bold font-display text-teal">
            {formatTime(timer)}
          </span>
        </div>
        <button
          onClick={startNewGame}
          className="bg-white rounded-full px-4 py-2 shadow-sm text-sm font-bold font-display text-slate-light hover:text-coral transition-colors"
        >
          New Game
        </button>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-4 gap-2.5 md:gap-3">
        {cards.map((card) => (
          <div key={card.id} className="memory-card-container">
            <div
              className={`memory-card ${card.flipped || card.matched ? "flipped" : ""} ${card.matched ? "matched" : ""}`}
              onClick={() => handleCardClick(card.id)}
            >
              {/* Front (question mark) */}
              <div className="memory-card-face memory-card-front" />
              {/* Back (photo) */}
              <div className="memory-card-face memory-card-back">
                <img
                  src={card.src}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {card.matched && (
                  <div className="absolute inset-0 bg-teal/20 flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Matched counter */}
      <div className="mt-5 flex justify-center gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < matchedCount
                ? "bg-teal scale-110"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Win overlay */}
      {gameWon && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-white rounded-3xl p-8 md:p-10 text-center max-w-sm mx-4 animate-bounce-in shadow-2xl">
            <div className="text-5xl mb-3">
              {"⭐".repeat(getStars())}
            </div>
            <h2 className="font-display text-3xl font-extrabold text-slate mb-2">
              You Won!
            </h2>
            <p className="font-body text-slate-light mb-1">
              Completed in <span className="font-bold text-coral">{moves} moves</span>
            </p>
            <p className="font-body text-slate-light mb-6">
              Time: <span className="font-bold text-teal">{formatTime(timer)}</span>
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={startNewGame} className="btn-primary">
                Play Again
              </button>
              <Link href="/" className="btn-secondary">
                Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
