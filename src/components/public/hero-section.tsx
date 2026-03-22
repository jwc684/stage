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
      className="relative h-screen bg-black"
    >
      {/* Full-screen cover image */}
      {magazine.coverImageUrl ? (
        <Image
          src={magazine.coverImageUrl}
          alt={magazine.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gray-900" />
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      {/* Content overlay */}
      <div className="relative flex h-full flex-col items-center justify-end pb-20">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-300">
          최신 매거진
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
          {magazine.title}
        </h1>
        <Link
          href={`/magazines/${magazine.id}`}
          className="mt-4 rounded-full border border-white/30 bg-white/10 px-6 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          매거진 보기 &rarr;
        </Link>
      </div>

      {/* Scroll down indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400 transition-colors hover:text-white"
        aria-label="Scroll to next section"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  );
}
