"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  publishMagazine,
  unpublishMagazine,
  deleteMagazine,
} from "@/actions/magazine-actions";
import { toast } from "sonner";
import type { MagazineStatus } from "@/types/magazine";

export function StatusActions({
  magazineId,
  status,
  saveFormId,
}: {
  magazineId: string;
  status: MagazineStatus;
  saveFormId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handlePublish() {
    setLoading(true);
    const result = await publishMagazine(magazineId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("매거진이 발행되었습니다");
    }
    setLoading(false);
  }

  async function handleUnpublish() {
    setLoading(true);
    await unpublishMagazine(magazineId);
    toast.success("매거진이 미발행 처리되었습니다");
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    await deleteMagazine(magazineId);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "published" && (
        <Button onClick={handlePublish} disabled={loading}>
          발행하기
        </Button>
      )}
      {status === "published" && (
        <Button variant="outline" onClick={handleUnpublish} disabled={loading}>
          미발행
        </Button>
      )}
      {saveFormId && (
        <button
          type="submit"
          form={saveFormId}
          disabled={loading}
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
        >
          저장
        </button>
      )}
      <Button
        variant="destructive"
        disabled={loading}
        onClick={() => setDeleteOpen(true)}
      >
        삭제
      </Button>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>매거진 삭제</DialogTitle>
            <DialogDescription>
              이 매거진을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
