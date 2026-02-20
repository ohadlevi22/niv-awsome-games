import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Niv's Awesome Games",
  description: "Fun family photo games - Memory, Puzzles & more!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen relative">
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-cream/80 border-b border-coral/10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link
              href="/"
              className="font-display text-2xl font-bold bg-gradient-to-r from-coral to-teal bg-clip-text text-transparent hover:scale-105 transition-transform"
            >
              Niv&apos;s Games
            </Link>
            <div className="flex gap-5 text-sm font-body">
              <Link href="/memory" className="nav-link">Memory</Link>
              <Link href="/puzzle" className="nav-link">Puzzle</Link>
              <Link href="/swap" className="nav-link">Hard</Link>
              <Link href="/reveal" className="nav-link">Reveal</Link>
            </div>
          </div>
        </nav>
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
