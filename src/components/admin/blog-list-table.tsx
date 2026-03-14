"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./status-badge";
import type { BlogPost } from "@/types/blog";

export function BlogListTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();

  if (posts.length === 0) {
    return (
      <p className="py-12 text-center text-gray-400">
        아직 블로그 글이 없습니다.
      </p>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">썸네일</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-24">작성자</TableHead>
              <TableHead className="w-24">상태</TableHead>
              <TableHead className="w-36">수정일</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  {post.thumbnailUrl ? (
                    <div className="relative h-10 w-14 overflow-hidden rounded">
                      <Image
                        src={post.thumbnailUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-14 items-center justify-center rounded bg-gradient-to-br from-gray-800 to-gray-950">
                      <span className="text-[8px] font-bold tracking-wider text-white/80">STAGE</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell className="text-sm text-gray-500">
                  {post.author || "-"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={post.status} />
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(post.updatedAt).toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-sm font-medium hover:bg-muted">
                      ...
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/blog/${post.id}/edit`)
                        }
                      >
                        수정
                      </DropdownMenuItem>
                      {post.status === "published" && (
                        <DropdownMenuItem
                          onClick={() => router.push(`/blog/${post.slug}`)}
                        >
                          보기
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/admin/blog/${post.id}/edit`}
            className="flex items-center gap-3 rounded-lg border bg-white p-3"
          >
            {post.thumbnailUrl ? (
              <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded">
                <Image
                  src={post.thumbnailUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            ) : (
              <div className="flex h-16 w-20 flex-shrink-0 items-center justify-center rounded bg-gradient-to-br from-gray-800 to-gray-950">
                <span className="text-[10px] font-bold tracking-wider text-white/80">STAGE</span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{post.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <StatusBadge status={post.status} />
                {post.author && (
                  <span className="text-xs text-gray-400">{post.author}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
