"use client";

import { useState, useTransition } from "react";
import { saveTocEntries } from "@/actions/toc-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MagazineTocEntry } from "@/types/magazine";

type TocEntry = {
  title: string;
  pageNumber: number;
};

export function TocEditor({
  magazineId,
  initialEntries,
  totalPages,
}: {
  magazineId: string;
  initialEntries: MagazineTocEntry[];
  totalPages: number;
}) {
  const [entries, setEntries] = useState<TocEntry[]>(
    initialEntries.map((e) => ({ title: e.title, pageNumber: e.pageNumber }))
  );
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function addEntry() {
    setEntries((prev) => [...prev, { title: "", pageNumber: 1 }]);
  }

  function removeEntry(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function updateEntry(index: number, field: keyof TocEntry, value: string) {
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === index
          ? {
              ...entry,
              [field]: field === "pageNumber" ? Number(value) || 0 : value,
            }
          : entry
      )
    );
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveTocEntries(magazineId, entries);
      if ("error" in result && result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "목차가 저장되었습니다" });
      }
      setTimeout(() => setMessage(null), 3000);
    });
  }

  return (
    <div className="space-y-4">
      {entries.length === 0 && (
        <p className="text-sm text-muted-foreground">
          목차 항목이 없습니다. 아래 버튼으로 추가하세요.
        </p>
      )}

      {entries.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={entry.title}
            onChange={(e) => updateEntry(index, "title", e.target.value)}
            placeholder="제목"
            className="flex-1"
          />
          <Input
            type="number"
            value={entry.pageNumber}
            onChange={(e) => updateEntry(index, "pageNumber", e.target.value)}
            min={1}
            max={totalPages}
            className="w-20"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeEntry(index)}
            className="text-destructive hover:text-destructive"
          >
            삭제
          </Button>
        </div>
      ))}

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addEntry}>
          + 항목 추가
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? "저장 중..." : "목차 저장"}
        </Button>
      </div>

      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-green-600" : "text-destructive"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
