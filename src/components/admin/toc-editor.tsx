"use client";

import { useState, useTransition, useId } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { saveTocEntries } from "@/actions/toc-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MagazineTocEntry } from "@/types/magazine";

type TocEntry = {
  id: string;
  title: string;
  pageNumber: number;
};

let nextId = 0;
function genId() {
  return `toc-${++nextId}-${Date.now()}`;
}

function SortableTocItem({
  entry,
  totalPages,
  onUpdate,
  onRemove,
}: {
  entry: TocEntry;
  totalPages: number;
  onUpdate: (id: string, field: "title" | "pageNumber", value: string) => void;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <button
        type="button"
        className="cursor-grab touch-none px-1 text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>
      <Input
        value={entry.title}
        onChange={(e) => onUpdate(entry.id, "title", e.target.value)}
        placeholder="제목"
        className="flex-1"
      />
      <Input
        type="number"
        value={entry.pageNumber}
        onChange={(e) => onUpdate(entry.id, "pageNumber", e.target.value)}
        min={1}
        max={totalPages}
        className="w-20"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(entry.id)}
        className="text-destructive hover:text-destructive"
      >
        삭제
      </Button>
    </div>
  );
}

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
    initialEntries.map((e) => ({
      id: e.id,
      title: e.title,
      pageNumber: e.pageNumber,
    }))
  );
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const dndId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setEntries((prev) => {
        const oldIndex = prev.findIndex((e) => e.id === active.id);
        const newIndex = prev.findIndex((e) => e.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  function addEntry() {
    setEntries((prev) => [...prev, { id: genId(), title: "", pageNumber: 1 }]);
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function updateEntry(id: string, field: "title" | "pageNumber", value: string) {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
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
      const result = await saveTocEntries(
        magazineId,
        entries.map((e) => ({ title: e.title, pageNumber: e.pageNumber }))
      );
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

      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={entries.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {entries.map((entry) => (
              <SortableTocItem
                key={entry.id}
                entry={entry}
                totalPages={totalPages}
                onUpdate={updateEntry}
                onRemove={removeEntry}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
