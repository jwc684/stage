-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create chunks table for RAG embeddings
CREATE TABLE "BlogPostChunk" (
    "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "blogPostId"  TEXT NOT NULL,
    "chunkIndex"  INTEGER NOT NULL,
    "title"       TEXT NOT NULL,
    "content"     TEXT NOT NULL,
    "embedding"   vector(1024),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogPostChunk_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "BlogPostChunk_blogPostId_fkey"
        FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE
);

CREATE INDEX "BlogPostChunk_blogPostId_idx" ON "BlogPostChunk"("blogPostId");

CREATE INDEX "BlogPostChunk_embedding_idx" ON "BlogPostChunk"
    USING hnsw ("embedding" vector_cosine_ops);
