export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MagazineViewer } from "@/components/public/magazine-viewer";
import { ViewTracker } from "@/components/public/view-tracker";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const magazine = await prisma.magazine.findUnique({ where: { id } });

  if (!magazine || magazine.status !== "published") {
    return { title: "Not Found" };
  }

  return {
    title: `${magazine.title} | STAGE`,
    description: `STAGE Magazine: ${magazine.title}`,
  };
}

export default async function MagazineViewerPage({ params }: Props) {
  const { id } = await params;

  const magazine = await prisma.magazine.findUnique({
    where: { id },
    include: {
      pages: { orderBy: { sortOrder: "asc" } },
      tocEntries: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!magazine || magazine.status !== "published") {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col bg-gray-950">
      <ViewTracker type="magazine" id={magazine.id} />
      {/* Header — hidden on mobile for fullscreen */}
      <header className="hidden md:flex h-12 flex-shrink-0 items-center justify-between px-4">
        <Link
          href="/"
          className="text-sm font-bold tracking-tight text-white"
        >
          STAGE
        </Link>
        <span className="text-sm text-gray-400">
          {magazine.title}
        </span>
      </header>
      <div className="flex-1 overflow-hidden">
        <MagazineViewer pages={magazine.pages} tocEntries={magazine.tocEntries} />
      </div>
      {/* Footer — hidden on mobile for fullscreen */}
      <div className="hidden md:flex flex-shrink-0 items-center justify-center gap-4 border-t border-white/10 py-3 px-4">
        <Link
          href="/"
          className="text-sm text-gray-400 transition-colors hover:text-white"
        >
          &larr; 메인으로
        </Link>
        <span className="text-gray-700">|</span>
        <Link
          href="/magazines"
          className="text-sm text-gray-400 transition-colors hover:text-white"
        >
          매거진 목록
        </Link>
      </div>
    </div>
  );
}
