import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  UPLOAD_DIR,
  BLOG_UPLOAD_DIR,
} from "./constants";

function validateImageType(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}`);
  }
}

async function writeFileToDir(file: File, uploadDir: string): Promise<string> {
  await mkdir(uploadDir, { recursive: true });

  const timestamp = Date.now();
  const ext = path.extname(file.name) || ".jpg";
  const baseName = path.basename(file.name, ext);
  const safeName = baseName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${timestamp}-${safeName}${ext}`;
  const filePath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return filename;
}

export async function saveUploadedFile(
  file: File,
  magazineId: string
): Promise<string> {
  validateImageType(file);

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large: ${file.size} bytes`);
  }

  const uploadDir = path.join(
    process.cwd(),
    "public",
    UPLOAD_DIR,
    magazineId,
    "pages"
  );
  const filename = await writeFileToDir(file, uploadDir);

  return `/${UPLOAD_DIR}/${magazineId}/pages/${filename}`;
}

export async function saveBlogThumbnail(file: File): Promise<string> {
  validateImageType(file);

  const uploadDir = path.join(process.cwd(), "public", BLOG_UPLOAD_DIR);
  const filename = await writeFileToDir(file, uploadDir);

  return `/${BLOG_UPLOAD_DIR}/${filename}`;
}

export async function deleteUploadedFile(imageUrl: string): Promise<void> {
  try {
    const filePath = path.resolve(process.cwd(), "public", imageUrl);
    const uploadsRoot = path.resolve(process.cwd(), "public", "uploads");

    if (!filePath.startsWith(uploadsRoot)) {
      throw new Error("Invalid file path");
    }

    await unlink(filePath);
  } catch {
    // File may not exist or path invalid, ignore
  }
}
