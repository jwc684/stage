"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { MagazineWithPages } from "@/types/magazine";

export function HeroSection({ magazine }: { magazine: MagazineWithPages }) {
  function scrollToNext() {
    const hero = document.getElementById("hero-section");
    if (!hero) return;
    const nextSection = hero.nextElementSibling as HTMLElement | null;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section
      id="hero-section"
      className="relative flex h-screen flex-col bg-black"
    >
      {/* ── Mobile: fullscreen cover ── */}
      <div className="flex flex-1 md:hidden">
        <Link href={`/magazines/${magazine.id}`} className="relative flex-1">
          {magazine.coverImageUrl ? (
            <img
              src={magazine.coverImageUrl}
              alt={magazine.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-300">
              최신 매거진
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white">
              {magazine.title}
            </h1>
            {magazine.description && (
              <p className="mt-2 max-w-xs text-center text-sm text-gray-300">
                {magazine.description}
              </p>
            )}
            <span className="mt-3 rounded-full border border-white/30 bg-white/10 px-5 py-1.5 text-sm text-white backdrop-blur-sm">
              매거진 보기 &rarr;
            </span>
          </div>
        </Link>
      </div>

      {/* ── Desktop: left title + right thumbnail ── */}
      <div className="hidden flex-1 md:flex items-center">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-16 px-12">
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              최신 매거진
            </p>
            <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">
              {magazine.title}
            </h1>
            {magazine.description && (
              <p className="mt-3 text-base text-gray-300">
                {magazine.description}
              </p>
            )}
            <Link
              href={`/magazines/${magazine.id}`}
              className="mt-6 inline-block rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              매거진 보기 &rarr;
            </Link>
          </div>

          <Link
            href={`/magazines/${magazine.id}`}
            className="group relative flex-shrink-0"
          >
            <div className="relative aspect-[3/4] h-[70vh] overflow-hidden rounded-lg shadow-2xl shadow-white/10">
              {magazine.coverImageUrl ? (
                <img
                  src={magazine.coverImageUrl}
                  alt={magazine.title}
                  className="absolute inset-0 h-full w-full object-contain transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-800">
                  <span className="text-gray-500">No Cover</span>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Scroll down indicator */}
      <button
        onClick={scrollToNext}
        className="flex-shrink-0 flex flex-col items-center gap-1 pb-4 text-gray-400 transition-colors hover:text-white"
        aria-label="Scroll to next section"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  );
}
