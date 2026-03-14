export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { BlogStatusActions } from "@/components/admin/blog-status-actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { updateBlogPost } from "@/actions/blog-actions";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) notFound();

  async function action(_state: unknown, formData: FormData) {
    "use server";
    return updateBlogPost(id, formData);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">블로그 글 수정</h1>
          <StatusBadge status={post.status} />
        </div>
        <BlogStatusActions
          postId={post.id}
          status={post.status}
          saveFormId="blog-edit-form"
        />
      </div>

      <div className="mx-auto max-w-3xl">
        <BlogPostForm
          action={action}
          defaultValues={{
            title: post.title,
            slug: post.slug,
            author: post.author,
            tags: post.tags,
            content: post.content,
            thumbnailUrl: post.thumbnailUrl,
            publishedAt: post.publishedAt,
          }}
          formId="blog-edit-form"
        />
      </div>
    </div>
  );
}
