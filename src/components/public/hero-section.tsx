"use client";

import { ChevronDown } from "lucide-react";
import { MagazineViewer } from "@/components/public/magazine-viewer";
import type { MagazineWithPages } from "@/types/magazine";

export function HeroSection({ magazine }: { magazine: MagazineWithPages }) {
  const hasPages = magazine.pages.length > 0;

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
      {/* Magazine title overlay */}
      <div className="flex-shrink-0 px-6 pt-16 pb-2 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
          최신 매거진
        </p>
        <h1 className="mt-1 text-lg font-bold text-white">
          {magazine.title}
        </h1>
      </div>

      {/* Magazine viewer */}
      <div className="min-h-0 flex-1">
        {hasPages ? (
          <MagazineViewer pages={magazine.pages} magazineId={magazine.id} />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No pages available
          </div>
        )}
      </div>

      {/* Scroll down indicator */}
      <button
        onClick={scrollToNext}
        className="flex-shrink-0 flex flex-col items-center gap-1 pb-4 pt-1 text-gray-400 transition-colors hover:text-white"
        aria-label="Scroll to next section"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  );
}
