-- CreateEnum
CREATE TYPE "MagazineContentType" AS ENUM ('image', 'web');

-- AlterTable
ALTER TABLE "Magazine" ADD COLUMN     "contentType" "MagazineContentType" NOT NULL DEFAULT 'image';

-- CreateTable
CREATE TABLE "MagazineArticle" (
    "id" TEXT NOT NULL,
    "magazineId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "author" TEXT NOT NULL DEFAULT '',
    "section" TEXT NOT NULL DEFAULT '',
    "thumbnailUrl" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "isCoverStory" BOOLEAN NOT NULL DEFAULT false,
    "status" "BlogPostStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MagazineArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MagazineArticle_magazineId_sortOrder_idx" ON "MagazineArticle"("magazineId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "MagazineArticle_magazineId_slug_key" ON "MagazineArticle"("magazineId", "slug");

-- AddForeignKey
ALTER TABLE "MagazineArticle" ADD CONSTRAINT "MagazineArticle_magazineId_fkey" FOREIGN KEY ("magazineId") REFERENCES "Magazine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
