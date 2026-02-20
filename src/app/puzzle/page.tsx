"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { PHOTOS } from "@/lib/photos";

const GRID = 3;
const TOTAL = GRID * GRID;

function shufflePieces(): number[] {
  let pieces: number[];
  do {
    pieces = Array.from({ length: TOTAL }, (_, i) => i);
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
  } while (pieces.every((v, i) => v === i));
  return pieces;
}

export default function PuzzlePage() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [pieces, setPieces] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const startGame = useCallback((photoIdx: number) => {
    setSelectedPhoto(photoIdx);
    setPieces(shufflePieces());
    setSelectedPiece(null);
    setMoves(0);
    setWon(false);
  }, []);

  const handlePieceClick = (index: number) => {
    if (won) return;

    if (selectedPiece === null) {
      setSelectedPiece(index);
    } else if (selectedPiece === index) {
      setSelectedPiece(null);
    } else {
      const newPieces = [...pieces];
      [newPieces[selectedPiece], newPieces[index]] = [newPieces[index], newPieces[selectedPiece]];
      setPieces(newPieces);
      setMoves((m) => m + 1);
      setSelectedPiece(null);

      if (newPieces.every((v, i) => v === i)) {
        setWon(true);
      }
    }
  };

  const correctCount = pieces.filter((v, i) => v === i).length;

  // Photo selection screen
  if (selectedPhoto === null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate mb-1">
            🧩 Photo Puzzle
          </h1>
          <p className="text-slate-light font-body text-sm">
            Choose a photo to puzzle!
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-4 stagger-children">
          {PHOTOS.map((photo, i) => (
            <button
              key={photo.id}
              onClick={() => startGame(i)}
              className="animate-scale-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="game-card overflow-hidden group">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photo.src}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const photo = PHOTOS[selectedPhoto];

  return (
    <div className="max-w-lg mx-auto px-4 py-6 md:py-10">
      <div className="text-center mb-5 animate-fade-in-up">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate mb-1">
          🧩 Photo Puzzle
        </h1>
        <p className="text-slate-light font-body text-sm">
          Tap two pieces to swap them!
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center mb-5 px-2">
        <div className="bg-white rounded-full px-4 py-2 shadow-sm">
          <span className="text-sm font-bold font-display text-coral">
            Moves: {moves}
          </span>
        </div>
        <div className="bg-white rounded-full px-4 py-2 shadow-sm">
          <span className="text-sm font-bold font-display text-teal">
            {correctCount}/{TOTAL}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => startGame(selectedPhoto)}
            className="bg-white rounded-full px-3 py-2 shadow-sm text-sm font-bold font-display text-slate-light hover:text-coral transition-colors"
          >
            Shuffle
          </button>
          <button
            onClick={() => setSelectedPhoto(null)}
            className="bg-white rounded-full px-3 py-2 shadow-sm text-sm font-bold font-display text-slate-light hover:text-teal transition-colors"
          >
            Back
          </button>
        </div>
      </div>

      {/* Reference image */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <img
            src={photo.src}
            alt="Reference"
            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shadow-md border-2 border-white"
          />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-[10px] font-bold font-display text-slate-light px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
            Reference
          </span>
        </div>
      </div>

      {/* Puzzle grid */}
      <div
        className="grid gap-1 mx-auto rounded-2xl overflow-hidden p-1 bg-white shadow-xl"
        style={{
          maxWidth: "400px",
          gridTemplateColumns: `repeat(${GRID}, 1fr)`,
        }}
      >
        {pieces.map((pieceValue, index) => {
          const sourceRow = Math.floor(pieceValue / GRID);
          const sourceCol = pieceValue % GRID;
          const isCorrect = pieceValue === index;
          const isSelected = selectedPiece === index;

          return (
            <div
              key={index}
              className="aspect-square relative cursor-pointer rounded-md overflow-hidden transition-all duration-200"
              style={{
                backgroundImage: `url(${photo.src})`,
                backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
                backgroundPosition: `${sourceCol * (100 / (GRID - 1))}% ${sourceRow * (100 / (GRID - 1))}%`,
                outline: isSelected
                  ? "3px solid #FF6B6B"
                  : isCorrect
                  ? "3px solid #4ECDC4"
                  : "1px solid rgba(0,0,0,0.08)",
                outlineOffset: isSelected ? "2px" : "0px",
                transform: isSelected ? "scale(1.06)" : "scale(1)",
                zIndex: isSelected ? 10 : 1,
              }}
              onClick={() => handlePieceClick(index)}
            >
              {isCorrect && (
                <div className="absolute top-1 right-1 bg-teal text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow">
                  &#10003;
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-5 mx-auto max-w-[400px]">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-coral to-teal rounded-full transition-all duration-500"
            style={{ width: `${(correctCount / TOTAL) * 100}%` }}
          />
        </div>
      </div>

      {/* Win overlay */}
      {won && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4 animate-bounce-in shadow-2xl">
            <div className="w-40 h-40 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
              <img src={photo.src} alt="" className="w-full h-full object-cover" />
            </div>
            <h2 className="font-display text-3xl font-extrabold text-slate mb-2">
              Solved!
            </h2>
            <p className="font-body text-slate-light mb-6">
              Completed in <span className="font-bold text-coral">{moves} swaps</span>
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => startGame(selectedPhoto)} className="btn-primary">
                Play Again
              </button>
              <button onClick={() => setSelectedPhoto(null)} className="btn-secondary">
                New Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
