export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/public/site-header";
import { Footer } from "@/components/public/footer";
import { MagazineGrid } from "@/components/public/magazine-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Issues | STAGE",
  description: "Browse all published issues of STAGE Magazine",
};

export default async function MagazinesPage() {
  const magazines = await prisma.magazine.findMany({
    where: { status: "published" },
    orderBy: { issueNumber: "desc" },
  });

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">All Issues</h1>
        <p className="mt-2 text-gray-500">
          {magazines.length} issue{magazines.length !== 1 && "s"} published
        </p>

        <MagazineGrid magazines={magazines} />
      </main>

      <Footer />
    </div>
  );
}
