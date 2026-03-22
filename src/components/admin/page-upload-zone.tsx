"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/constants";
import { toast } from "sonner";

export function PageUploadZone({ magazineId }: { magazineId: string }) {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setUploading(true);
      const formData = new FormData();
      acceptedFiles.forEach((file) => formData.append("files", file));

      try {
        const res = await fetch(
          `/api/admin/magazines/${magazineId}/pages`,
          { method: "POST", body: formData }
        );

        if (!res.ok) {
          const data = await res.json();
          toast.error(data.error || "업로드에 실패했습니다");
          return;
        }

        toast.success(`${acceptedFiles.length}개 페이지가 추가되었습니다`);
        router.refresh();
      } catch {
        toast.error("업로드 중 오류가 발생했습니다");
      } finally {
        setUploading(false);
      }
    },
    [magazineId, router]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: Object.fromEntries(
      ACCEPTED_IMAGE_TYPES.map((type) => [type, []])
    ),
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-gray-300 hover:border-gray-400"
      } ${uploading ? "pointer-events-none opacity-50" : ""}`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <p className="text-sm text-gray-500">업로드 중...</p>
      ) : isDragActive ? (
        <p className="text-sm text-primary">여기에 이미지를 놓으세요</p>
      ) : (
        <div>
          <p className="text-sm text-gray-500">
            이미지를 드래그하거나 클릭하여 업로드
          </p>
          <p className="mt-1 text-xs text-gray-400">
            JPG, PNG, WebP (최대 20MB, 자동 WebP 변환 및 최적화)
          </p>
        </div>
      )}
    </div>
  );
}
