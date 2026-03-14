import type { Magazine, MagazinePage } from "@/generated/prisma/client";

export type MagazineWithPages = Magazine & {
  pages: MagazinePage[];
};

export type MagazineListItem = Magazine & {
  _count: { pages: number };
};

export type MagazineStatus = Magazine["status"];

export type { Magazine, MagazinePage };
