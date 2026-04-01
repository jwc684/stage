"use client";

import { useState } from "react";
import Link from "next/link";

interface Magazine {
  id: string;
  issueNumber: number;
  title: string;
  coverImageUrl: string | null;
  publishedAt: Date | null;
}

const ROW_SIZE = { sm: 2, md: 4, lg: 5 };

export function PastMagazines({ magazines }: { magazines: Magazine[] }) {
  const [expanded, setExpanded] = useState(false);

  // Show one row on largest breakpoint (5 items) by default
  const visible = expanded ? magazines : magazines.slice(0, ROW_SIZE.lg);
  const hasMore = magazines.length > ROW_SIZE.lg;

  return (
    <section className="mt-32 pt-24 border-t border-[#c4c7c7]/20">
      <div className="flex justify-between items-end mb-16">
        <div>
          <span className="font-label text-[10px] uppercase tracking-[0.3em] opacity-60 block mb-2">
            Past Issues
          </span>
          <h2 className="font-headline text-4xl">지난 매거진</h2>
        </div>
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="font-label text-[10px] uppercase tracking-widest border-b border-[#1c1b1b]/20 pb-1 hover:text-[#6f5c24] hover:border-[#6f5c24] transition-all"
          >
            {expanded ? "접기" : "전체보기"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {visible.map((mag) => (
          <Link
            key={mag.id}
            href={`/magazines/${mag.id}`}
            className="group cursor-pointer"
          >
            <div className="aspect-[3/4] bg-[#eae7e7] mb-4 overflow-hidden relative">
              {mag.coverImageUrl ? (
                <img
                  src={mag.coverImageUrl}
                  alt={mag.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-headline text-lg opacity-30">
                    STAGE
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
            </div>
            <span className="font-label text-[9px] uppercase tracking-widest opacity-50 block mb-1">
              Issue {String(mag.issueNumber).padStart(2, "0")} /{" "}
              {mag.publishedAt
                ? new Date(mag.publishedAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                  })
                : ""}
            </span>
            <h5 className="font-headline text-lg group-hover:text-[#6f5c24] transition-colors">
              {mag.title}
            </h5>
          </Link>
        ))}
      </div>
    </section>
  );
}
