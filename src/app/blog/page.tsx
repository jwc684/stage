import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/public/blog-card";
import { Footer } from "@/components/public/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | STAGE",
  description: "STAGE 블로그",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      author: true,
      publishedAt: true,
      tags: true,
      thumbnailUrl: true,
      status: true,
      content: false,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-bold tracking-tight">
            STAGE
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/magazines"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Magazines
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-900"
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-gray-500">
          {posts.length}개의 글
        </p>

        {posts.length === 0 ? (
          <div className="mt-24 text-center text-gray-400">
            아직 발행된 글이 없습니다.
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
