import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { BlogListTable } from "@/components/admin/blog-list-table";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">블로그 관리</h1>
        <Link href="/admin/blog/new">
          <Button>새 글 작성</Button>
        </Link>
      </div>
      <BlogListTable posts={posts} />
    </div>
  );
}
