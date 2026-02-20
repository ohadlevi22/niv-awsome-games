"use client";

import { useState, useCallback } from "react";
import { PHOTOS } from "@/lib/photos";

const GRID = 5;
const TOTAL_BLOCKS = GRID * GRID;

function pickRandomPhoto(exclude?: number): number {
  let idx: number;
  do {
    idx = Math.floor(Math.random() * PHOTOS.length);
  } while (idx === exclude);
  return idx;
}

function getChoices(correctIdx: number): number[] {
  const choices = new Set<number>();
  choices.add(correctIdx);
  while (choices.size < 4) {
    choices.add(Math.floor(Math.random() * PHOTOS.length));
  }
  const arr = Array.from(choices);
  // Shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const BLOCK_COLORS = [
  "#FF6B6B", "#4ECDC4", "#FFE66D", "#A78BFA", "#FF8E8E",
  "#6FE8DF", "#FFEF99", "#C4B5FD", "#F87171", "#34D399",
  "#FBBF24", "#818CF8", "#FB923C", "#2DD4BF", "#F472B6",
  "#A3E635", "#60A5FA", "#E879F9", "#FACC15", "#22D3EE",
  "#FB7185", "#4ADE80", "#FCD34D", "#C084FC", "#38BDF8",
];

export default function RevealPage() {
  const [targetPhoto, setTargetPhoto] = useState(() => pickRandomPhoto());
  const [choices, setChoices] = useState(() => getChoices(pickRandomPhoto()));
  const [removedBlocks, setRemovedBlocks] = useState<Set<number>>(new Set());
  const [guessed, setGuessed] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [blockColors] = useState(() => {
    const shuffled = [...BLOCK_COLORS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  const startNewRound = useCallback(() => {
    const newPhoto = pickRandomPhoto(targetPhoto);
    setTargetPhoto(newPhoto);
    setChoices(getChoices(newPhoto));
    setRemovedBlocks(new Set());
    setGuessed(false);
    setCorrect(false);
    setRound((r) => r + 1);
  }, [targetPhoto]);

  const handleBlockClick = (blockIdx: number) => {
    if (guessed) return;
    setRemovedBlocks((prev) => {
      const next = new Set(prev);
      next.add(blockIdx);
      return next;
    });
  };

  const handleGuess = (photoIdx: number) => {
    if (guessed) return;
    setGuessed(true);
    const isCorrect = photoIdx === targetPhoto;
    setCorrect(isCorrect);
    if (isCorrect) {
      const blocksRemaining = TOTAL_BLOCKS - removedBlocks.size;
      const roundScore = Math.max(10, blocksRemaining * 10);
      setScore(roundScore);
      setTotalScore((t) => t + roundScore);
    }
  };

  const revealedPercent = Math.round((removedBlocks.size / TOTAL_BLOCKS) * 100);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 md:py-10">
      <div className="text-center mb-5 animate-fade-in-up">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate mb-1">
          🔍 Photo Reveal
        </h1>
        <p className="text-slate-light font-body text-sm">
          Remove blocks to reveal the photo, then guess which one it is!
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center mb-5 px-2">
        <div className="bg-white rounded-full px-4 py-2 shadow-sm">
          <span className="text-sm font-bold font-display text-coral">
            Round {round}
          </span>
        </div>
        <div className="bg-white rounded-full px-4 py-2 shadow-sm">
          <span className="text-sm font-bold font-display text-teal">
            Score: {totalScore}
          </span>
        </div>
        <div className="bg-white rounded-full px-4 py-2 shadow-sm">
          <span className="text-sm font-bold font-display text-golden">
            {revealedPercent}% revealed
          </span>
        </div>
      </div>

      {/* Photo with blocks */}
      <div
        className="relative mx-auto rounded-2xl overflow-hidden shadow-xl bg-white"
        style={{ maxWidth: "400px", aspectRatio: "1" }}
      >
        {/* The hidden photo */}
        <img
          src={PHOTOS[targetPhoto].src}
          alt=""
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Colored blocks overlay */}
        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
        >
          {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => {
            const isRemoved = removedBlocks.has(i);
            return (
              <div
                key={i}
                className={`reveal-block ${isRemoved ? "removed" : ""}`}
                style={{
                  backgroundColor: isRemoved ? "transparent" : blockColors[i % blockColors.length],
                  border: isRemoved ? "none" : "1px solid rgba(255,255,255,0.3)",
                }}
                onClick={() => handleBlockClick(i)}
              />
            );
          })}
        </div>

        {/* After guess: show full image */}
        {guessed && (
          <div className="absolute inset-0 bg-black/0 pointer-events-none" />
        )}
      </div>

      {/* Guess section */}
      {!guessed ? (
        <div className="mt-6">
          <p className="text-center font-display text-lg font-bold text-slate mb-3">
            Which photo is it?
          </p>
          <div className="grid grid-cols-4 gap-2">
            {choices.map((photoIdx) => (
              <button
                key={photoIdx}
                onClick={() => handleGuess(photoIdx)}
                className="group"
              >
                <div className="aspect-square rounded-xl overflow-hidden shadow-md border-2 border-transparent group-hover:border-coral transition-all group-hover:scale-105">
                  <img
                    src={PHOTOS[photoIdx].src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-slate-light mt-2 font-body">
            Remove more blocks for a better look, or guess now for more points!
          </p>
        </div>
      ) : (
        <div className="mt-6 text-center animate-bounce-in">
          {correct ? (
            <>
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="font-display text-2xl font-extrabold text-teal mb-1">
                Correct!
              </h3>
              <p className="font-body text-slate-light mb-4">
                +{score} points ({TOTAL_BLOCKS - removedBlocks.size} blocks remaining)
              </p>
            </>
          ) : (
            <>
              <div className="text-4xl mb-2">😅</div>
              <h3 className="font-display text-2xl font-extrabold text-coral mb-1">
                Not quite!
              </h3>
              <p className="font-body text-slate-light mb-4">
                The photo was revealed above
              </p>
            </>
          )}
          <button onClick={startNewRound} className="btn-primary">
            Next Round
          </button>
        </div>
      )}
    </div>
  );
}
