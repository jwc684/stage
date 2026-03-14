import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/public/hero-section";
import { MagazineCarousel } from "@/components/public/magazine-carousel";
import { EmptyState } from "@/components/public/empty-state";
import { BlogCard } from "@/components/public/blog-card";
import { Footer } from "@/components/public/footer";
import { MAGAZINES_PER_CAROUSEL, LATEST_BLOG_POSTS_COUNT } from "@/lib/constants";
import Link from "next/link";

export default async function HomePage() {
  const [publishedMagazines, latestPosts] = await Promise.all([
    prisma.magazine.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: MAGAZINES_PER_CAROUSEL + 1,
      include: { pages: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: LATEST_BLOG_POSTS_COUNT,
    }),
  ]);

  if (publishedMagazines.length === 0 && latestPosts.length === 0) {
    return (
      <div className="min-h-screen">
        <header className="flex h-14 items-center justify-between px-6">
          <span className="text-lg font-bold tracking-tight">STAGE</span>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600">
            Admin
          </Link>
        </header>
        <EmptyState />
      </div>
    );
  }

  const [latest, ...previous] = publishedMagazines;

  return (
    <div className="min-h-screen">
      {latest ? (
        <>
          <header className="absolute left-0 right-0 top-0 z-10 flex h-14 items-center justify-between px-6">
            <span className="text-lg font-bold tracking-tight text-white">
              STAGE
            </span>
            <Link href="/admin" className="text-sm text-gray-400 hover:text-white">
              Admin
            </Link>
          </header>
          <HeroSection magazine={latest} />
          <MagazineCarousel magazines={previous} />
        </>
      ) : (
        <header className="flex h-14 items-center justify-between px-6">
          <span className="text-lg font-bold tracking-tight">STAGE</span>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600">
            Admin
          </Link>
        </header>
      )}

      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">최신 블로그</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              더보기 &rarr;
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
