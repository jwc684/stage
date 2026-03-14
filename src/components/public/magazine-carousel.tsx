"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MagazineCard } from "./magazine-card";
import type { Magazine } from "@/types/magazine";

export function MagazineCarousel({ magazines }: { magazines: Magazine[] }) {
  if (magazines.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">지난 매거진</h2>
        <Link
          href="/magazines"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          더보기 &rarr;
        </Link>
      </div>
      <Carousel
        opts={{ align: "start", loop: false }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {magazines.map((mag) => (
            <CarouselItem
              key={mag.id}
              className="basis-auto pl-4"
            >
              <MagazineCard magazine={mag} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
}
