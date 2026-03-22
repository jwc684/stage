"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/constants";
import { toast } from "sonner";

const CLIENT_MAX_WIDTH = 2400;
const CLIENT_QUALITY = 0.85;
const CLIENT_MAX_SIZE = 4 * 1024 * 1024; // 4MB (Vercel Hobby limit is 4.5MB)

async function compressImage(file: File): Promise<File> {
  // If already small enough, skip compression
  if (file.size <= CLIENT_MAX_SIZE) return file;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Resize if wider than max
      if (width > CLIENT_MAX_WIDTH) {
        height = Math.round((height * CLIENT_MAX_WIDTH) / width);
        width = CLIENT_MAX_WIDTH;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        CLIENT_QUALITY
      );
    };
    img.onerror = () => reject(new Error("이미지 로드 실패"));
    img.src = URL.createObjectURL(file);
  });
}

export function PageUploadZone({ magazineId }: { magazineId: string }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const router = useRouter();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setUploading(true);
      setProgress({ current: 0, total: acceptedFiles.length });

      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < acceptedFiles.length; i++) {
        setProgress({ current: i + 1, total: acceptedFiles.length });

        try {
          const compressed = await compressImage(acceptedFiles[i]);
          const formData = new FormData();
          formData.append("files", compressed);

          const res = await fetch(
            `/api/admin/magazines/${magazineId}/pages`,
            { method: "POST", body: formData }
          );

          if (!res.ok) {
            let errorMsg = `HTTP ${res.status}`;
            try {
              const data = await res.json();
              if (data.error) errorMsg = data.error;
            } catch { /* response is not JSON */ }
            toast.error(`${acceptedFiles[i].name}: ${errorMsg}`);
            failCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : "네트워크 오류";
          toast.error(`${acceptedFiles[i].name}: ${msg}`);
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount}개 페이지가 추가되었습니다`);
        router.refresh();
      }
      if (failCount > 0 && successCount === 0) {
        toast.error("모든 파일 업로드에 실패했습니다");
      }

      setUploading(false);
      setProgress({ current: 0, total: 0 });
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
        <p className="text-sm text-gray-500">
          업로드 중... ({progress.current}/{progress.total})
        </p>
      ) : isDragActive ? (
        <p className="text-sm text-primary">여기에 이미지를 놓으세요</p>
      ) : (
        <div>
          <p className="text-sm text-gray-500">
            이미지를 드래그하거나 클릭하여 업로드
          </p>
          <p className="mt-1 text-xs text-gray-400">
            JPG, PNG, WebP (자동 최적화 및 WebP 변환)
          </p>
        </div>
      )}
    </div>
  );
}
