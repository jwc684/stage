"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error.message, error.digest, error.stack);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">오류가 발생했습니다</h1>
      <p className="mt-2 text-gray-500">잠시 후 다시 시도해주세요</p>
      <p className="mt-1 text-xs text-gray-400 max-w-sm text-center">
        {error.digest || error.message}
      </p>
      <Button onClick={reset} className="mt-4">
        다시 시도
      </Button>
    </div>
  );
}
