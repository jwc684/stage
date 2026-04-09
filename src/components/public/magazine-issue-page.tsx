import Link from "next/link";
import { SiteHeader } from "./site-header";
import { Footer } from "./footer";
import { ViewTracker } from "./view-tracker";
import type { MagazineArticle } from "@/generated/prisma/client";
import type { Magazine } from "@/types/magazine";

interface Props {
  magazine: Magazine;
  articles: MagazineArticle[];
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function excerpt(html: string, maxLength = 120): string {
  const text = stripHtml(html);
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

export function MagazineIssuePage({ magazine, articles }: Props) {
  const coverStory = articles.find((a) => a.isCoverStory);
  const otherArticles = articles.filter((a) => !a.isCoverStory);

  const sections = otherArticles.reduce<Record<string, MagazineArticle[]>>(
    (acc, article) => {
      const key = article.section || "기타";
      if (!acc[key]) acc[key] = [];
      acc[key].push(article);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b]">
      <SiteHeader />
      <ViewTracker type="magazine" id={magazine.id} />

      <main className="mx-auto max-w-[1200px] px-6 py-12 md:px-12">
        {/* Issue Header */}
        <div className="mb-16 border-b border-[#1c1b1b]/10 pb-8">
          <span className="font-label text-sm font-semibold uppercase tracking-[0.15em] text-[#6f5c24]">
            STAGE Issue {String(magazine.issueNumber).padStart(2, "0")}
            {magazine.publishedAt &&
              ` / ${new Date(magazine.publishedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long" })}`}
          </span>
          <h1 className="font-headline mt-2 text-4xl md:text-5xl tracking-tight">
            {magazine.title}
          </h1>
          {magazine.description && (
            <p className="mt-4 text-lg text-[#444748] leading-relaxed max-w-2xl">
              {magazine.description}
            </p>
          )}
        </div>

        {/* Cover Story */}
        {coverStory && (
          <section className="mb-20">
            <Link
              href={`/magazines/${magazine.id}/${coverStory.slug}`}
              className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
            >
              {coverStory.thumbnailUrl ? (
                <div className="overflow-hidden bg-[#eae7e7]">
                  <img
                    src={coverStory.thumbnailUrl}
                    alt={coverStory.title}
                    className="w-full aspect-[4/3] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-[#eae7e7] flex items-center justify-center">
                  <span className="font-headline text-3xl opacity-20">STAGE</span>
                </div>
              )}
              <div className="flex flex-col justify-center">
                <span className="font-label text-[11px] font-bold uppercase tracking-[0.2em] text-[#6f5c24] mb-3">
                  {coverStory.section || "Cover Story"}
                </span>
                <h2 className="font-headline text-3xl md:text-4xl leading-tight mb-4 group-hover:text-[#6f5c24] transition-colors">
                  {coverStory.title}
                </h2>
                {coverStory.content && (
                  <p className="text-[#444748] leading-relaxed mb-4">
                    {excerpt(coverStory.content, 200)}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#6f5c24] rounded-full flex items-center justify-center text-white text-sm italic font-headline">
                    {coverStory.author?.[0] || "S"}
                  </div>
                  <span className="font-label text-xs font-semibold uppercase tracking-wider">
                    {coverStory.author || "STAGE"}
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Articles by Section */}
        {Object.entries(sections).map(([sectionName, sectionArticles]) => (
          <section key={sectionName} className="mb-16">
            <h3 className="font-label text-xs font-black uppercase tracking-[0.2em] mb-8 border-b border-[#1c1b1b]/10 pb-3">
              {sectionName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sectionArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/magazines/${magazine.id}/${article.slug}`}
                  className="group"
                >
                  {article.thumbnailUrl ? (
                    <div className="overflow-hidden bg-[#eae7e7] mb-4">
                      <img
                        src={article.thumbnailUrl}
                        alt={article.title}
                        className="w-full aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/2] bg-[#eae7e7] mb-4 flex items-center justify-center">
                      <span className="font-headline text-lg opacity-20">STAGE</span>
                    </div>
                  )}
                  <h4 className="font-headline text-xl leading-snug mb-2 group-hover:text-[#6f5c24] transition-colors">
                    {article.title}
                  </h4>
                  {article.content && (
                    <p className="text-sm text-[#444748] opacity-80 leading-relaxed mb-2">
                      {excerpt(article.content)}
                    </p>
                  )}
                  <span className="font-label text-[10px] uppercase tracking-wider opacity-60">
                    {article.author || "STAGE"}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* No sections - flat list */}
        {Object.keys(sections).length === 0 && !coverStory && (
          <div className="text-center text-[#444748] py-24 opacity-60">
            아직 발행된 아티클이 없습니다.
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-[#1c1b1b]/10">
          <Link
            href="/magazines"
            className="font-label text-sm hover:text-[#6f5c24] transition-colors"
          >
            ← 전체 매거진
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
