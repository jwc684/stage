import Image from "next/image";
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
          <Image
            src={magazine.coverImageUrl}
            alt={magazine.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 192px, 224px"
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
