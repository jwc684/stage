import type { Magazine, MagazinePage, MagazineTocEntry, MagazineArticle } from "@/generated/prisma/client";

export type MagazineWithPages = Magazine & {
  pages: MagazinePage[];
  tocEntries?: MagazineTocEntry[];
};

export type MagazineWithArticles = Magazine & {
  articles: MagazineArticle[];
};

export type MagazineListItem = Magazine & {
  _count: { pages: number; articles: number };
};

export type MagazineStatus = Magazine["status"];
export type MagazineContentType = Magazine["contentType"];

export type { Magazine, MagazinePage, MagazineTocEntry, MagazineArticle };
