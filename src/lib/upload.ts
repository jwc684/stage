import path from "path";
import { ACCEPTED_IMAGE_TYPES } from "./constants";
import { getSupabase, STORAGE_BUCKET, getPublicUrl } from "./supabase";

function validateImageType(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`지원하지 않는 파일 형식입니다: ${file.type}`);
  }
}

function generateFilename(file: File): string {
  const timestamp = Date.now();
  const ext = path.extname(file.name) || ".jpg";
  const baseName = path.basename(file.name, ext);
  const safeName = baseName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${timestamp}-${safeName}${ext}`;
}

export async function saveUploadedFile(
  file: File,
  magazineId: string
): Promise<string> {
  validateImageType(file);

  const filename = generateFilename(file);
  const storagePath = `magazines/${magazineId}/pages/${filename}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await getSupabase().storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type,
    });

  if (error) throw new Error(`업로드 실패: ${error.message}`);

  return getPublicUrl(storagePath);
}

export async function saveBlogThumbnail(file: File): Promise<string> {
  validateImageType(file);

  const filename = generateFilename(file);
  const storagePath = `blog/${filename}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await getSupabase().storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type,
    });

  if (error) throw new Error(`업로드 실패: ${error.message}`);

  return getPublicUrl(storagePath);
}

export async function deleteUploadedFile(imageUrl: string): Promise<void> {
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split(`/storage/v1/object/public/${STORAGE_BUCKET}/`);
    if (pathParts.length < 2) return;

    const storagePath = decodeURIComponent(pathParts[1]);
    await getSupabase().storage.from(STORAGE_BUCKET).remove([storagePath]);
  } catch {
    // URL parsing failed or file not found, ignore
  }
}
