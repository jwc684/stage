"use client";

import Image from "next/image";
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
      <div className="flex flex-1 items-center">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-8 px-6 md:gap-16 md:px-12">
          {/* Left: title + CTA */}
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              최신 매거진
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              {magazine.title}
            </h1>
            <Link
              href={`/magazines/${magazine.id}`}
              className="mt-6 inline-block rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              매거진 보기 &rarr;
            </Link>
          </div>

          {/* Right: cover thumbnail (no crop, max size) */}
          <Link
            href={`/magazines/${magazine.id}`}
            className="group relative flex-shrink-0"
          >
            <div className="relative aspect-[3/4] h-[70vh] overflow-hidden rounded-lg shadow-2xl shadow-white/10">
              {magazine.coverImageUrl ? (
                <Image
                  src={magazine.coverImageUrl}
                  alt={magazine.title}
                  fill
                  className="object-contain transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 40vw, 35vw"
                  priority
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
