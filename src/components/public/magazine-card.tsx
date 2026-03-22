import Link from "next/link";
import type { Magazine } from "@/types/magazine";

export function MagazineCard({ magazine }: { magazine: Magazine }) {
  return (
    <Link
      href={`/magazines/${magazine.id}`}
      className="group block flex-shrink-0"
    >
      <div className="relative aspect-[3/4] w-48 overflow-hidden rounded-lg sm:w-56">
        {magazine.coverImageUrl ? (
          <img
            src={magazine.coverImageUrl}
            alt={magazine.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">No Cover</span>
          </div>
        )}
      </div>
      <p className="mt-2 text-sm font-medium">
        {magazine.title}
      </p>
    </Link>
  );
}
