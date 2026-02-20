import Link from "next/link";
import { PHOTOS } from "@/lib/photos";

const GAMES = [
  {
    name: "Memory Match",
    href: "/memory",
    emoji: "🧠",
    color: "from-coral to-[#FF8E8E]",
    shadow: "rgba(255, 107, 107, 0.25)",
    description: "Flip cards and find matching pairs!",
    photos: [PHOTOS[0], PHOTOS[2], PHOTOS[4], PHOTOS[6]],
  },
  {
    name: "Sliding Puzzle",
    href: "/puzzle",
    emoji: "🧩",
    color: "from-teal to-[#6FE8DF]",
    shadow: "rgba(78, 205, 196, 0.25)",
    description: "Slide tiles to rebuild the picture!",
    photos: [PHOTOS[1], PHOTOS[3], PHOTOS[5], PHOTOS[7]],
  },
  {
    name: "Puzzle Swap",
    href: "/swap",
    emoji: "🔀",
    color: "from-golden to-[#FFEF99]",
    shadow: "rgba(255, 230, 109, 0.35)",
    description: "Swap scrambled pieces back in place!",
    photos: [PHOTOS[2], PHOTOS[4], PHOTOS[6], PHOTOS[8]],
  },
  {
    name: "Photo Reveal",
    href: "/reveal",
    emoji: "🔍",
    color: "from-[#A78BFA] to-[#C4B5FD]",
    shadow: "rgba(167, 139, 250, 0.25)",
    description: "Uncover the hidden photo and guess!",
    photos: [PHOTOS[0], PHOTOS[1], PHOTOS[3], PHOTOS[5]],
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-14">
      {/* Hero */}
      <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
        <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-tight mb-3">
          <span className="bg-gradient-to-r from-coral via-[#FF8E8E] to-teal bg-clip-text text-transparent">
            Niv&apos;s Awesome
          </span>
          <br />
          <span className="text-slate">Games</span>
        </h1>
        <p className="font-body text-lg md:text-xl text-slate-light max-w-md mx-auto">
          Pick a game and have fun with our family photos!
        </p>
      </div>

      {/* Photo strip decoration */}
      <div className="flex justify-center gap-3 mb-12 md:mb-16 overflow-hidden animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        {PHOTOS.slice(0, 7).map((photo, i) => (
          <div
            key={photo.id}
            className="w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0 animate-float"
            style={{
              animationDelay: `${i * 200}ms`,
              transform: `rotate(${(i - 3) * 5}deg)`,
            }}
          >
            <img
              src={photo.src}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 stagger-children">
        {GAMES.map((game) => (
          <Link key={game.name} href={game.href} className="block">
            <div
              className="game-card group"
              style={{ boxShadow: `0 8px 30px ${game.shadow}` }}
            >
              {/* Photo mosaic header */}
              <div className="grid grid-cols-2 gap-0.5 h-40 md:h-48 overflow-hidden">
                {game.photos.map((photo, i) => (
                  <div
                    key={i}
                    className="overflow-hidden relative"
                  >
                    <img
                      src={photo.src}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${game.color} opacity-20 group-hover:opacity-10 transition-opacity duration-300`} />
              </div>

              {/* Card content */}
              <div className="p-5 md:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{game.emoji}</span>
                  <h2 className="font-display text-xl md:text-2xl font-bold text-slate">
                    {game.name}
                  </h2>
                </div>
                <p className="font-body text-slate-light text-sm md:text-base">
                  {game.description}
                </p>
                <div className="mt-4">
                  <span
                    className={`inline-block bg-gradient-to-r ${game.color} text-white font-display font-bold text-sm px-5 py-2 rounded-full group-hover:scale-105 transition-transform`}
                  >
                    Play Now
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 mb-8 text-slate-light text-sm font-body">
        Made with love for Niv&apos;s family
      </footer>
    </div>
  );
}
