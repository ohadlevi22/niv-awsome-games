"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PHOTOS } from "@/lib/photos";

const GRID = 3;
const TOTAL = GRID * GRID;

interface Tile {
  value: number; // 0-8, where 8 is the empty slot
  row: number;
  col: number;
}

function isSolvable(tiles: number[]): boolean {
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] !== TOTAL - 1 && tiles[j] !== TOTAL - 1 && tiles[i] > tiles[j]) {
        inversions++;
      }
    }
  }
  return inversions % 2 === 0;
}

function createPuzzle(): number[] {
  let tiles: number[];
  do {
    tiles = Array.from({ length: TOTAL }, (_, i) => i);
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  } while (!isSolvable(tiles) || tiles.every((v, i) => v === i));
  return tiles;
}

function isSolved(tiles: number[]): boolean {
  return tiles.every((v, i) => v === i);
}

export default function PuzzlePage() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const startGame = useCallback((photoIdx: number) => {
    setSelectedPhoto(photoIdx);
    setTiles(createPuzzle());
    setMoves(0);
    setWon(false);
  }, []);

  const handleTileClick = (index: number) => {
    if (won) return;
    const emptyIdx = tiles.indexOf(TOTAL - 1);
    const emptyRow = Math.floor(emptyIdx / GRID);
    const emptyCol = emptyIdx % GRID;
    const clickRow = Math.floor(index / GRID);
    const clickCol = index % GRID;

    const isAdjacent =
      (Math.abs(emptyRow - clickRow) === 1 && emptyCol === clickCol) ||
      (Math.abs(emptyCol - clickCol) === 1 && emptyRow === clickRow);

    if (!isAdjacent) return;

    const newTiles = [...tiles];
    [newTiles[index], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[index]];
    setTiles(newTiles);
    setMoves((m) => m + 1);

    if (isSolved(newTiles)) {
      setWon(true);
    }
  };

  // Photo selection screen
  if (selectedPhoto === null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate mb-1">
            🧩 Sliding Puzzle
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
  const tileSize = 100 / GRID;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 md:py-10">
      <div className="text-center mb-5 animate-fade-in-up">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate mb-1">
          🧩 Sliding Puzzle
        </h1>
        <p className="text-slate-light font-body text-sm">
          Click tiles next to the empty space to slide them!
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center mb-5 px-2">
        <div className="bg-white rounded-full px-4 py-2 shadow-sm">
          <span className="text-sm font-bold font-display text-coral">
            Moves: {moves}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => startGame(selectedPhoto)}
            className="bg-white rounded-full px-4 py-2 shadow-sm text-sm font-bold font-display text-slate-light hover:text-coral transition-colors"
          >
            Shuffle
          </button>
          <button
            onClick={() => setSelectedPhoto(null)}
            className="bg-white rounded-full px-4 py-2 shadow-sm text-sm font-bold font-display text-slate-light hover:text-teal transition-colors"
          >
            Change Photo
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
        className="relative mx-auto rounded-2xl overflow-hidden shadow-xl bg-slate/10"
        style={{ maxWidth: "400px", aspectRatio: "1" }}
      >
        {tiles.map((tileValue, index) => {
          const isEmptyTile = tileValue === TOTAL - 1;
          const sourceRow = Math.floor(tileValue / GRID);
          const sourceCol = tileValue % GRID;
          const currentRow = Math.floor(index / GRID);
          const currentCol = index % GRID;

          return (
            <div
              key={tileValue}
              className={`puzzle-tile absolute ${isEmptyTile ? "empty" : ""}`}
              style={{
                width: `${tileSize}%`,
                height: `${tileSize}%`,
                left: `${currentCol * tileSize}%`,
                top: `${currentRow * tileSize}%`,
              }}
              onClick={() => handleTileClick(index)}
            >
              {!isEmptyTile && (
                <div className="w-full h-full overflow-hidden relative border border-white/30">
                  <img
                    src={photo.src}
                    alt=""
                    className="absolute"
                    draggable={false}
                    style={{
                      width: `${GRID * 100}%`,
                      height: `${GRID * 100}%`,
                      left: `-${sourceCol * 100}%`,
                      top: `-${sourceRow * 100}%`,
                    }}
                  />
                  {/* Tile number overlay */}
                  <div className="absolute top-1 left-1 bg-black/30 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {tileValue + 1}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Win overlay */}
      {won && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4 animate-bounce-in shadow-2xl">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="font-display text-3xl font-extrabold text-slate mb-2">
              Solved!
            </h2>
            <p className="font-body text-slate-light mb-6">
              Completed in <span className="font-bold text-coral">{moves} moves</span>
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
