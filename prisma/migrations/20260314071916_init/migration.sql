-- CreateEnum
CREATE TYPE "MagazineStatus" AS ENUM ('draft', 'published', 'unpublished');

-- CreateTable
CREATE TABLE "Magazine" (
    "id" TEXT NOT NULL,
    "issueNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "status" "MagazineStatus" NOT NULL DEFAULT 'draft',
    "coverImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Magazine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MagazinePage" (
    "id" TEXT NOT NULL,
    "magazineId" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MagazinePage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Magazine_issueNumber_key" ON "Magazine"("issueNumber");

-- CreateIndex
CREATE INDEX "Magazine_status_publishedAt_idx" ON "Magazine"("status", "publishedAt" DESC);

-- CreateIndex
CREATE INDEX "MagazinePage_magazineId_sortOrder_idx" ON "MagazinePage"("magazineId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "MagazinePage_magazineId_sortOrder_key" ON "MagazinePage"("magazineId", "sortOrder");

-- AddForeignKey
ALTER TABLE "MagazinePage" ADD CONSTRAINT "MagazinePage_magazineId_fkey" FOREIGN KEY ("magazineId") REFERENCES "Magazine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
