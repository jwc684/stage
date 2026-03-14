"use client";

import { Button } from "@/components/ui/button";

export function ViewerControls({
  onPrev,
  onNext,
  canPrev,
  canNext,
  currentPage,
  totalPages,
}: {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <Button
        variant="outline"
        size="lg"
        onClick={onPrev}
        disabled={!canPrev}
        className="h-11 w-11 min-h-[44px] min-w-[44px] text-lg"
      >
        &larr;
      </Button>
      <span className="min-w-[80px] text-center text-sm text-gray-500">
        {currentPage} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="lg"
        onClick={onNext}
        disabled={!canNext}
        className="h-11 w-11 min-h-[44px] min-w-[44px] text-lg"
      >
        &rarr;
      </Button>
    </div>
  );
}
