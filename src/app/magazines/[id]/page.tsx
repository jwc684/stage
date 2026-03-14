import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MagazineViewer } from "@/components/public/magazine-viewer";
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
    include: { pages: { orderBy: { sortOrder: "asc" } } },
  });

  if (!magazine || magazine.status !== "published") {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col bg-gray-950">
      <header className="flex h-12 flex-shrink-0 items-center justify-between px-4">
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
        <MagazineViewer pages={magazine.pages} />
      </div>
    </div>
  );
}
