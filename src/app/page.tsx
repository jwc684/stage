export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Footer } from "@/components/public/footer";
import Link from "next/link";

export default async function HomePage() {
  const [publishedMagazines, allPosts] = await Promise.all([
    prisma.magazine.findMany({
      where: { status: "published" },
      orderBy: { issueNumber: "desc" },
    }),
    prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
  ]);

  const [latestMagazine, ...previousMagazines] = publishedMagazines;
  const sidebarPosts = allPosts.slice(0, 3);
  const curatedPosts = allPosts.slice(3, 5);

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b]">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-12 py-6 max-w-[1920px] mx-auto bg-[#fcf9f8]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-3xl font-black tracking-tighter font-headline uppercase"
          >
            STAGE
          </Link>
          <nav className="hidden md:flex gap-6 items-baseline">
            <Link
              href="/magazines"
              className="font-label uppercase tracking-[0.05em] text-xs font-semibold opacity-70 hover:text-[#6f5c24] transition-colors duration-300"
            >
              매거진
            </Link>
            <Link
              href="/blog"
              className="font-label uppercase tracking-[0.05em] text-xs font-semibold opacity-70 hover:text-[#6f5c24] transition-colors duration-300"
            >
              블로그
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-24 max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Hero: Latest Magazine */}
        {latestMagazine && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-start">
            <div className="lg:col-span-8">
              <div className="mb-8">
                <span className="font-label text-[11px] font-semibold tracking-[0.2em] text-[#6f5c24] uppercase">
                  최신호 / Issue {String(latestMagazine.issueNumber).padStart(2, "0")}
                  {latestMagazine.publishedAt &&
                    ` / ${new Date(latestMagazine.publishedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long" })}`}
                </span>
              </div>

              <Link href={`/magazines/${latestMagazine.id}`}>
                <div className="relative group overflow-hidden bg-[#f6f3f2] mb-8">
                  {latestMagazine.coverImageUrl ? (
                    <img
                      src={latestMagazine.coverImageUrl}
                      alt={latestMagazine.title}
                      className="w-full aspect-[16/9] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full aspect-[16/9] bg-[#eae7e7] flex items-center justify-center">
                      <span className="font-headline text-4xl opacity-20">STAGE</span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="max-w-2xl">
                <Link href={`/magazines/${latestMagazine.id}`}>
                  <h1 className="font-headline text-5xl md:text-7xl leading-[1.1] mb-6 tracking-tight hover:text-[#6f5c24] transition-colors">
                    {latestMagazine.title}
                  </h1>
                </Link>
                {latestMagazine.description && (
                  <p className="text-lg text-[#444748] leading-relaxed mb-8 opacity-90">
                    {latestMagazine.description}
                  </p>
                )}
                <Link
                  href={`/magazines/${latestMagazine.id}`}
                  className="inline-block bg-[#1c1b1b] text-white px-8 py-3 font-label text-[10px] font-bold uppercase tracking-widest hover:bg-[#6f5c24] transition-colors"
                >
                  매거진 보기
                </Link>
              </div>
            </div>

            {/* Sidebar: Top Stories */}
            <div className="lg:col-span-4 border-l-0 lg:border-l lg:pl-12 border-[#c4c7c7]/20">
              {sidebarPosts.length > 0 && (
                <div className="mb-12">
                  <h3 className="font-label text-[10px] font-black tracking-[0.25em] uppercase mb-8 border-b border-[#1c1b1b]/10 pb-4">
                    최신 글
                  </h3>
                  <div className="space-y-12">
                    {sidebarPosts.map((post) => (
                      <article key={post.id} className="group">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="flex gap-4 mb-4"
                        >
                          {post.thumbnailUrl ? (
                            <img
                              src={post.thumbnailUrl}
                              alt={post.title}
                              className="w-20 h-20 object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-[#eae7e7] flex items-center justify-center shrink-0">
                              <span className="font-headline text-xs opacity-40">
                                STAGE
                              </span>
                            </div>
                          )}
                          <div className="flex flex-col justify-center">
                            {post.tags[0] && (
                              <span className="font-label text-[9px] uppercase tracking-widest text-[#6f5c24] mb-1">
                                {post.tags[0]}
                              </span>
                            )}
                            <h4 className="font-headline text-xl leading-tight group-hover:text-[#6f5c24] transition-colors">
                              {post.title}
                            </h4>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter Callout */}
              <div className="bg-[#f6f3f2] p-8">
                <h4 className="font-headline text-2xl mb-4 italic">
                  STAGE Weekly
                </h4>
                <p className="font-label text-[11px] leading-relaxed mb-6 opacity-70">
                  매주 토요일 아침, 당신의 편지함으로 배달되는 STAGE의 이야기.
                </p>
                <input
                  className="w-full bg-transparent border-b border-[#1c1b1b]/20 py-2 font-label text-xs mb-4 focus:outline-none focus:border-[#6f5c24] transition-colors placeholder:opacity-50"
                  placeholder="이메일 주소"
                  type="email"
                />
                <button className="w-full bg-[#1c1b1b] text-white py-3 font-label text-[10px] font-bold uppercase tracking-widest hover:bg-[#6f5c24] transition-colors">
                  구독하기
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Previous Magazines Section */}
        {previousMagazines.length > 0 && (
          <section className="mt-32 pt-24 border-t border-[#c4c7c7]/20">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="font-label text-[10px] uppercase tracking-[0.3em] opacity-60 block mb-2">
                  Past Issues
                </span>
                <h2 className="font-headline text-4xl">지난 매거진</h2>
              </div>
              <Link
                href="/magazines"
                className="font-label text-[10px] uppercase tracking-widest border-b border-[#1c1b1b]/20 pb-1 hover:text-[#6f5c24] hover:border-[#6f5c24] transition-all"
              >
                전체보기
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {previousMagazines.map((mag) => (
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
                    Issue{" "}
                    {String(mag.issueNumber).padStart(2, "0")} /{" "}
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
        )}

        {/* Curated Grid Section */}
        {curatedPosts.length >= 2 && (
          <section className="mt-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
              <div className="space-y-16">
                <article>
                  <Link href={`/blog/${curatedPosts[0].slug}`}>
                    {curatedPosts[0].thumbnailUrl ? (
                      <img
                        src={curatedPosts[0].thumbnailUrl}
                        alt={curatedPosts[0].title}
                        className="w-full aspect-square object-cover mb-8 grayscale hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-[#eae7e7] mb-8 flex items-center justify-center">
                        <span className="font-headline text-2xl opacity-20">
                          STAGE
                        </span>
                      </div>
                    )}
                  </Link>
                  {curatedPosts[0].tags[0] && (
                    <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#6f5c24] font-bold block mb-4">
                      {curatedPosts[0].tags[0]}
                    </span>
                  )}
                  <Link href={`/blog/${curatedPosts[0].slug}`}>
                    <h3 className="font-headline text-3xl mb-4 hover:text-[#6f5c24] transition-colors">
                      {curatedPosts[0].title}
                    </h3>
                  </Link>
                  <p className="text-[#444748] opacity-80 leading-relaxed">
                    {curatedPosts[0].author} ·{" "}
                    {curatedPosts[0].publishedAt
                      ? new Date(
                          curatedPosts[0].publishedAt
                        ).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""}
                  </p>
                </article>
              </div>

              <div className="space-y-16 mt-24 md:mt-48">
                <article>
                  <Link href={`/blog/${curatedPosts[1].slug}`}>
                    {curatedPosts[1].thumbnailUrl ? (
                      <img
                        src={curatedPosts[1].thumbnailUrl}
                        alt={curatedPosts[1].title}
                        className="w-full aspect-square object-cover mb-8 grayscale hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-[#eae7e7] mb-8 flex items-center justify-center">
                        <span className="font-headline text-2xl opacity-20">
                          STAGE
                        </span>
                      </div>
                    )}
                  </Link>
                  {curatedPosts[1].tags[0] && (
                    <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#6f5c24] font-bold block mb-4">
                      {curatedPosts[1].tags[0]}
                    </span>
                  )}
                  <Link href={`/blog/${curatedPosts[1].slug}`}>
                    <h3 className="font-headline text-3xl mb-4 hover:text-[#6f5c24] transition-colors">
                      {curatedPosts[1].title}
                    </h3>
                  </Link>
                  <p className="text-[#444748] opacity-80 leading-relaxed">
                    {curatedPosts[1].author} ·{" "}
                    {curatedPosts[1].publishedAt
                      ? new Date(
                          curatedPosts[1].publishedAt
                        ).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""}
                  </p>
                </article>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
