-- CreateEnum
CREATE TYPE "EmbeddingStatus" AS ENUM ('none', 'processing', 'completed', 'failed');

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN "embeddingStatus" "EmbeddingStatus" NOT NULL DEFAULT 'none';
