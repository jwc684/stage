import { Skeleton } from "@/components/ui/skeleton";

export default function MagazineLoading() {
  return (
    <div className="flex h-screen flex-col bg-gray-950">
      <div className="flex h-12 items-center justify-between px-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex flex-1 items-center justify-center gap-1 px-4">
        <Skeleton className="h-[70vh] w-[35vw]" />
        <Skeleton className="h-[70vh] w-[35vw]" />
      </div>
      <div className="flex items-center justify-center gap-4 py-4">
        <Skeleton className="h-11 w-11 rounded-md" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-11 w-11 rounded-md" />
      </div>
    </div>
  );
}
