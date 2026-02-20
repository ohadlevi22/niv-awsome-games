"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { PHOTOS } from "@/lib/photos";

interface PhotoSource {
  id: number;
  src: string;
}

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

function createDeck(photos: PhotoSource[]): Card[] {
  const pairs: Card[] = [];
  photos.forEach((photo, index) => {
    pairs.push({ id: index * 2, photoId: photo.id, src: photo.src, flipped: false, matched: false });
    pairs.push({ id: index * 2 + 1, photoId: photo.id, src: photo.src, flipped: false, matched: false });
  });
  return shuffleArray(pairs);
}

function getGridCols(photoCount: number): number {
  if (photoCount <= 2) return 2;
  if (photoCount <= 3) return 3;
  return 4;
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

/* ===================== SETUP SCREEN ===================== */

function SetupScreen({ onStart }: { onStart: (photos: PhotoSource[]) => void }) {
  const [uploadedPhotos, setUploadedPhotos] = useState<PhotoSource[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const nextIdRef = useRef(100);

  const processFiles = (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const newPhotos: PhotoSource[] = imageFiles.map((file) => ({
      id: nextIdRef.current++,
      src: URL.createObjectURL(file),
    }));
    setUploadedPhotos((prev) => {
      const combined = [...prev, ...newPhotos];
      return combined.slice(0, 8); // max 8
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const removePhoto = (id: number) => {
    setUploadedPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.src);
      return prev.filter((p) => p.id !== id);
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 md:py-10">
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate mb-1">
          🧠 Memory Match
        </h1>
        <p className="text-slate-light font-body text-sm">
          Choose how you want to play!
        </p>
      </div>

      {/* Option 1: Family Photos */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <button
          onClick={() => onStart(shuffleArray(PHOTOS).slice(0, 8))}
          className="game-card w-full text-left group"
        >
          <div className="flex items-center gap-4 p-5">
            <div className="flex -space-x-3 flex-shrink-0">
              {PHOTOS.slice(0, 4).map((photo) => (
                <div
                  key={photo.id}
                  className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm"
                >
                  <img src={photo.src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-lg font-bold text-slate">
                Play with Family Photos
              </h2>
              <p className="text-slate-light text-sm font-body">
                8 pairs from our photo collection
              </p>
            </div>
            <span className="text-coral font-display font-bold text-2xl group-hover:translate-x-1 transition-transform">
              &rarr;
            </span>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="font-display text-sm font-bold text-slate-light">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Option 2: Upload Photos */}
      <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <div className="game-card p-5">
          <h2 className="font-display text-lg font-bold text-slate mb-1">
            Upload Your Own Photos
          </h2>
          <p className="text-slate-light text-sm font-body mb-4">
            Add 2-8 photos to create a custom game
          </p>

          {/* Drop zone - uses <label> for native iOS file picker support */}
          <label
            htmlFor="photo-upload"
            className={`block border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-coral bg-coral/5 scale-[1.01]"
                : "border-gray-200 hover:border-coral/50 hover:bg-coral/5"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              className="absolute w-px h-px overflow-hidden opacity-0"
              style={{ clip: "rect(0,0,0,0)" }}
              onChange={handleFileChange}
            />
            <div className="text-4xl mb-2">📸</div>
            <p className="font-display font-bold text-slate text-sm">
              Tap to choose photos
            </p>
            <p className="text-slate-light text-xs font-body mt-1">
              or drag & drop images here
            </p>
          </label>

          {/* Uploaded photos preview */}
          {uploadedPhotos.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-sm font-bold text-slate">
                  {uploadedPhotos.length} photo{uploadedPhotos.length !== 1 ? "s" : ""} selected
                </span>
                <span className="text-xs text-slate-light font-body">
                  {uploadedPhotos.length < 2 ? `Need at least ${2 - uploadedPhotos.length} more` : `${8 - uploadedPhotos.length} more allowed`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {uploadedPhotos.map((photo) => (
                  <div key={photo.id} className="relative group animate-scale-in">
                    <div className="aspect-square rounded-xl overflow-hidden shadow-sm">
                      <img src={photo.src} alt="" className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removePhoto(photo.id); }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-coral text-white rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>

              {/* Start button */}
              {uploadedPhotos.length >= 2 && (
                <div className="mt-4 text-center animate-fade-in-up">
                  <button
                    onClick={() => onStart(uploadedPhotos)}
                    className="btn-primary text-base"
                  >
                    Start Game with {uploadedPhotos.length} Photos
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===================== GAME SCREEN ===================== */

function GameScreen({
  photos,
  onBack,
}: {
  photos: PhotoSource[];
  onBack: () => void;
}) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalPairs = photos.length;
  const gridCols = getGridCols(totalPairs);

  const startNewGame = useCallback(() => {
    setCards(createDeck(photos));
    setFlippedIds([]);
    setMoves(0);
    setMatchedCount(0);
    setTimer(0);
    setGameStarted(false);
    setGameWon(false);
    setIsChecking(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [photos]);

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
    if (matchedCount === totalPairs && matchedCount > 0) {
      setGameWon(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [matchedCount, totalPairs]);

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
    const threshold = totalPairs * 1.5;
    if (moves <= threshold) return 3;
    if (moves <= threshold * 1.8) return 2;
    return 1;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 md:py-10">
      {gameWon && <Confetti />}

      <div className="text-center mb-6 animate-fade-in-up">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate mb-1">
          🧠 Memory Match
        </h1>
        <p className="text-slate-light font-body text-sm">
          Find all {totalPairs} matching pairs!
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
        <div className="flex gap-2">
          <button
            onClick={startNewGame}
            className="bg-white rounded-full px-3 py-2 shadow-sm text-sm font-bold font-display text-slate-light hover:text-coral transition-colors"
          >
            Shuffle
          </button>
          <button
            onClick={onBack}
            className="bg-white rounded-full px-3 py-2 shadow-sm text-sm font-bold font-display text-slate-light hover:text-teal transition-colors"
          >
            Back
          </button>
        </div>
      </div>

      {/* Card grid */}
      <div
        className="grid gap-2.5 md:gap-3"
        style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
      >
        {cards.map((card) => (
          <div key={card.id} className="memory-card-container">
            <div
              className={`memory-card ${card.flipped || card.matched ? "flipped" : ""} ${card.matched ? "matched" : ""}`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="memory-card-face memory-card-front" />
              <div className="memory-card-face memory-card-back">
                <img
                  src={card.src}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {card.matched && (
                  <div className="absolute inset-0 bg-teal/20 flex items-center justify-center">
                    <span className="text-2xl">&#10003;</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Matched counter */}
      <div className="mt-5 flex justify-center gap-1.5">
        {Array.from({ length: totalPairs }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < matchedCount ? "bg-teal scale-110" : "bg-gray-200"
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
            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={startNewGame} className="btn-primary">
                Play Again
              </button>
              <button onClick={onBack} className="btn-secondary">
                Change Photos
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

/* ===================== MAIN PAGE ===================== */

export default function MemoryPage() {
  const [gamePhotos, setGamePhotos] = useState<PhotoSource[] | null>(null);

  if (gamePhotos) {
    return <GameScreen photos={gamePhotos} onBack={() => setGamePhotos(null)} />;
  }

  return <SetupScreen onStart={setGamePhotos} />;
}
