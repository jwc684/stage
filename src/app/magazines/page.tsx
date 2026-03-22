export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/public/site-header";
import { Footer } from "@/components/public/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Issues | STAGE",
  description: "Browse all published issues of STAGE Magazine",
};

export default async function MagazinesPage() {
  const magazines = await prisma.magazine.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">All Issues</h1>
        <p className="mt-2 text-gray-500">
          {magazines.length} issue{magazines.length !== 1 && "s"} published
        </p>

        {magazines.length === 0 ? (
          <div className="mt-24 text-center text-gray-400">
            No published magazines yet.
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {magazines.map((magazine) => (
              <Link
                key={magazine.id}
                href={`/magazines/${magazine.id}`}
                className="group"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100">
                  {magazine.coverImageUrl ? (
                    <img
                      src={magazine.coverImageUrl}
                      alt={magazine.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                      No Cover
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                </div>
                <div className="mt-3">
                  <p className="text-sm font-semibold line-clamp-1">
                    {magazine.title}
                  </p>
                  {magazine.publishedAt && (
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(magazine.publishedAt).toLocaleDateString(
                        "ko-KR",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
