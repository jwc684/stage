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
      className="relative flex h-screen flex-col items-center justify-center bg-black"
    >
      {/* Magazine title */}
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
        최신 매거진
      </p>
      <h1 className="mt-1 text-lg font-bold text-white">
        {magazine.title}
      </h1>

      {/* Cover thumbnail → links to magazine viewer */}
      <Link
        href={`/magazines/${magazine.id}`}
        className="group mt-6"
      >
        <div className="relative aspect-[3/4] w-56 overflow-hidden rounded-lg shadow-2xl shadow-white/10 sm:w-64">
          {magazine.coverImageUrl ? (
            <Image
              src={magazine.coverImageUrl}
              alt={magazine.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 224px, 256px"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-800">
              <span className="text-gray-500">No Cover</span>
            </div>
          )}
        </div>
        <p className="mt-3 text-center text-sm text-gray-400 transition-colors group-hover:text-white">
          매거진 보기 &rarr;
        </p>
      </Link>

      {/* Scroll down indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-4 flex flex-col items-center gap-1 text-gray-400 transition-colors hover:text-white"
        aria-label="Scroll to next section"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  );
}
