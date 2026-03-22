-- CreateTable
CREATE TABLE "MagazineTocEntry" (
    "id" TEXT NOT NULL,
    "magazineId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MagazineTocEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MagazineTocEntry_magazineId_sortOrder_idx" ON "MagazineTocEntry"("magazineId", "sortOrder");

-- AddForeignKey
ALTER TABLE "MagazineTocEntry" ADD CONSTRAINT "MagazineTocEntry_magazineId_fkey" FOREIGN KEY ("magazineId") REFERENCES "Magazine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
