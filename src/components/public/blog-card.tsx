import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types/blog";

type BlogCardPost = Pick<
  BlogPost,
  "slug" | "title" | "author" | "publishedAt" | "tags" | "thumbnailUrl"
>;

export function BlogCard({ post }: { post: BlogCardPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
        {post.thumbnailUrl ? (
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-950">
            <span className="text-lg font-bold tracking-widest text-white/80">
              STAGE
            </span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-semibold line-clamp-2 group-hover:underline">
          {post.title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          {post.author && <span>{post.author}</span>}
          {post.publishedAt && (
            <>
              {post.author && <span>·</span>}
              <span>
                {new Date(post.publishedAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </>
          )}
        </div>
        {post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
