import { prisma } from "@/lib/prisma";
import { chunkBlogContent } from "@/lib/chunker";
import { embedDocuments, embedQuery } from "@/lib/voyage";

export interface ChunkResult {
  id: string;
  blogPostId: string;
  title: string;
  content: string;
  similarity: number;
  slug: string;
}

export interface SourceReference {
  title: string;
  slug: string;
}

export async function generateEmbeddings(blogPostId: string): Promise<void> {
  const post = await prisma.blogPost.findUnique({
    where: { id: blogPostId },
    select: { id: true, title: true, content: true },
  });

  if (!post || !post.content) return;

  const chunks = chunkBlogContent(post.content, post.title);

  // Delete existing chunks for this post
  await prisma.$queryRawUnsafe(
    `DELETE FROM "BlogPostChunk" WHERE "blogPostId" = $1`,
    blogPostId
  );

  if (chunks.length === 0) return;

  // Generate embeddings
  const embeddings = await embedDocuments(chunks.map((c) => c.content));

  // Insert chunks with embeddings
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const vec = `[${embeddings[i].join(",")}]`;

    await prisma.$queryRawUnsafe(
      `INSERT INTO "BlogPostChunk" ("id", "blogPostId", "chunkIndex", "title", "content", "embedding")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5::vector)`,
      blogPostId,
      chunk.chunkIndex,
      chunk.title,
      chunk.content,
      vec
    );
  }

  console.log(
    `[RAG] Generated ${chunks.length} chunks for post "${post.title}"`
  );
}

export async function searchChunks(
  query: string,
  topK: number = 5
): Promise<ChunkResult[]> {
  if (!process.env.VOYAGE_API_KEY) return [];

  const queryEmbedding = await embedQuery(query);
  const vec = `[${queryEmbedding.join(",")}]`;

  const results = await prisma.$queryRawUnsafe<ChunkResult[]>(
    `SELECT c."id", c."blogPostId", c."title", c."content",
            1 - (c."embedding" <=> $1::vector) AS similarity,
            p."slug"
     FROM "BlogPostChunk" c
     JOIN "BlogPost" p ON p."id" = c."blogPostId"
     WHERE p."status" = 'published'
     ORDER BY c."embedding" <=> $1::vector
     LIMIT $2`,
    vec,
    topK
  );

  // Filter by minimum similarity threshold
  return results.filter((r) => r.similarity > 0.3);
}

export function buildRagContext(chunks: ChunkResult[]): string {
  if (chunks.length === 0) return "";

  const lines = chunks.map(
    (c) => `---\n출처: ${c.title}\n${c.content.replace(/^\[.*?\]\s*/, "")}`
  );

  return `\n\n다음은 STAGE 블로그에서 검색된 관련 콘텐츠입니다. 이 정보를 바탕으로 답변해 주세요.\n\n${lines.join("\n\n")}`;
}

export function getSourceReferences(chunks: ChunkResult[]): SourceReference[] {
  const seen = new Set<string>();
  return chunks
    .filter((c) => {
      if (seen.has(c.slug)) return false;
      seen.add(c.slug);
      return true;
    })
    .map((c) => ({ title: c.title, slug: c.slug }));
}
