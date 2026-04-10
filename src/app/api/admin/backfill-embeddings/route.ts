import { prisma } from "@/lib/prisma";
import { generateEmbeddings } from "@/lib/rag";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    select: { id: true, title: true },
  });

  const results: { title: string; status: string }[] = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (i > 0) await new Promise((r) => setTimeout(r, 21000)); // 3 RPM rate limit
    try {
      await generateEmbeddings(post.id);
      results.push({ title: post.title, status: "success" });
    } catch (err) {
      results.push({ title: post.title, status: `error: ${err}` });
    }
  }

  return NextResponse.json({ total: posts.length, results });
}
