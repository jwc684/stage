import { BlogPostForm } from "@/components/admin/blog-post-form";
import { createBlogPost } from "@/actions/blog-actions";

export default function NewBlogPostPage() {
  async function action(_state: unknown, formData: FormData) {
    "use server";
    return createBlogPost(formData);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">새 블로그 글</h1>
      <BlogPostForm action={action} submitLabel="생성" />
    </div>
  );
}
