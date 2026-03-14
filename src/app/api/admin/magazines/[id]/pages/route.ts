import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/constants";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: magazineId } = await params;

  const magazine = await prisma.magazine.findUnique({
    where: { id: magazineId },
  });

  if (!magazine) {
    return NextResponse.json(
      { error: "매거진을 찾을 수 없습니다" },
      { status: 404 }
    );
  }

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return NextResponse.json(
      { error: "파일을 선택해주세요" },
      { status: 400 }
    );
  }

  // Validate all files first
  for (const file of files) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `지원하지 않는 파일 형식입니다: ${file.name}` },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `파일이 너무 큽니다: ${file.name} (최대 10MB)` },
        { status: 400 }
      );
    }
  }

  // Get current max sort order
  const lastPage = await prisma.magazinePage.findFirst({
    where: { magazineId },
    orderBy: { sortOrder: "desc" },
  });

  let nextSortOrder = (lastPage?.sortOrder ?? -1) + 1;

  const createdPages = [];

  for (const file of files) {
    const imageUrl = await saveUploadedFile(file, magazineId);

    const page = await prisma.magazinePage.create({
      data: {
        magazineId,
        pageNumber: nextSortOrder + 1,
        imageUrl,
        sortOrder: nextSortOrder,
      },
    });

    createdPages.push(page);
    nextSortOrder++;
  }

  // Set cover image if this is the first page
  if (!magazine.coverImageUrl && createdPages.length > 0) {
    await prisma.magazine.update({
      where: { id: magazineId },
      data: { coverImageUrl: createdPages[0].imageUrl },
    });
  }

  return NextResponse.json({ pages: createdPages }, { status: 201 });
}
