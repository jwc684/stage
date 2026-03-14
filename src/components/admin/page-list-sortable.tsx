"use client";

import { useState, useEffect, useId } from "react";
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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { reorderPages, deletePage } from "@/actions/page-actions";
import { toast } from "sonner";
import type { MagazinePage } from "@/types/magazine";

function SortablePageItem({
  page,
  onDelete,
}: {
  page: MagazinePage;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative rounded-lg border bg-white p-2"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded">
          <Image
            src={page.imageUrl}
            alt={`Page ${page.pageNumber}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 200px"
          />
        </div>
        <p className="mt-1 text-center text-xs text-gray-500">
          {page.pageNumber}
        </p>
      </div>
      <button
        onClick={() => onDelete(page.id)}
        className="absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white group-hover:flex"
        type="button"
      >
        &times;
      </button>
    </div>
  );
}

export function PageListSortable({
  pages: serverPages,
  magazineId,
}: {
  pages: MagazinePage[];
  magazineId: string;
}) {
  const [pages, setPages] = useState(serverPages);
  const dndId = useId();

  // Sync with server props when they change (e.g. after upload + router.refresh)
  useEffect(() => {
    setPages(serverPages);
  }, [serverPages]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = pages.findIndex((p) => p.id === active.id);
    const newIndex = pages.findIndex((p) => p.id === over.id);
    const newPages = arrayMove(pages, oldIndex, newIndex).map((p, i) => ({
      ...p,
      sortOrder: i,
      pageNumber: i + 1,
    }));

    setPages(newPages);

    const result = await reorderPages(
      magazineId,
      newPages.map((p) => p.id)
    );

    if (result.success) {
      toast.success("페이지 순서가 변경되었습니다");
    }
  }

  async function handleDelete(pageId: string) {
    const result = await deletePage(pageId, magazineId);
    if (result.success) {
      setPages((prev) =>
        prev
          .filter((p) => p.id !== pageId)
          .map((p, i) => ({ ...p, sortOrder: i, pageNumber: i + 1 }))
      );
      toast.success("페이지가 삭제되었습니다");
    }
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const newPages = arrayMove(pages, index, index - 1).map((p, i) => ({
      ...p,
      sortOrder: i,
      pageNumber: i + 1,
    }));
    setPages(newPages);
    reorderPages(magazineId, newPages.map((p) => p.id));
  }

  function handleMoveDown(index: number) {
    if (index === pages.length - 1) return;
    const newPages = arrayMove(pages, index, index + 1).map((p, i) => ({
      ...p,
      sortOrder: i,
      pageNumber: i + 1,
    }));
    setPages(newPages);
    reorderPages(magazineId, newPages.map((p) => p.id));
  }

  if (pages.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        아직 페이지가 없습니다. 위에서 이미지를 업로드해주세요.
      </p>
    );
  }

  return (
    <>
      {/* Desktop: drag & drop grid */}
      <div className="hidden md:block">
        <DndContext
          id={dndId}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={pages} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-4 gap-4 lg:grid-cols-6">
              {pages.map((page) => (
                <SortablePageItem
                  key={page.id}
                  page={page}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Mobile: list with move buttons */}
      <div className="space-y-2 md:hidden">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className="flex items-center gap-3 rounded-lg border bg-white p-2"
          >
            <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded">
              <Image
                src={page.imageUrl}
                alt={`Page ${page.pageNumber}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <span className="text-sm text-gray-600">P.{page.pageNumber}</span>
            <div className="ml-auto flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
              >
                &uarr;
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleMoveDown(index)}
                disabled={index === pages.length - 1}
              >
                &darr;
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500"
                onClick={() => handleDelete(page.id)}
              >
                &times;
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
