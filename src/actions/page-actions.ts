"use server";

import { prisma } from "@/lib/prisma";
import { deleteUploadedFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function reorderPages(
  magazineId: string,
  orderedIds: string[]
) {
  // Two-pass to avoid unique constraint on (magazineId, sortOrder):
  // 1. Set all sortOrders to negative (offset) values to clear conflicts
  // 2. Set final sortOrders
  const offset = 100000;

  await prisma.$transaction([
    ...orderedIds.map((id, index) =>
      prisma.magazinePage.update({
        where: { id },
        data: { sortOrder: -(index + offset) },
      })
    ),
    ...orderedIds.map((id, index) =>
      prisma.magazinePage.update({
        where: { id },
        data: {
          sortOrder: index,
          pageNumber: index + 1,
        },
      })
    ),
  ]);

  // Update cover image to first page
  const firstPage = await prisma.magazinePage.findFirst({
    where: { magazineId },
    orderBy: { sortOrder: "asc" },
  });

  if (firstPage) {
    await prisma.magazine.update({
      where: { id: magazineId },
      data: { coverImageUrl: firstPage.imageUrl },
    });
  }

  revalidatePath(`/admin/magazines/${magazineId}/edit`);
  revalidatePath("/");
  return { success: true };
}

export async function deletePage(pageId: string, magazineId: string) {
  const page = await prisma.magazinePage.findUnique({
    where: { id: pageId },
  });

  if (page) {
    await deleteUploadedFile(page.imageUrl);
    await prisma.magazinePage.delete({ where: { id: pageId } });

    // Reorder remaining pages (two-pass for unique constraint)
    const remaining = await prisma.magazinePage.findMany({
      where: { magazineId },
      orderBy: { sortOrder: "asc" },
    });

    if (remaining.length > 0) {
      const offset = 100000;
      await prisma.$transaction([
        ...remaining.map((p, index) =>
          prisma.magazinePage.update({
            where: { id: p.id },
            data: { sortOrder: -(index + offset) },
          })
        ),
        ...remaining.map((p, index) =>
          prisma.magazinePage.update({
            where: { id: p.id },
            data: { sortOrder: index, pageNumber: index + 1 },
          })
        ),
      ]);
    }

    // Update cover
    const firstPage = remaining[0];
    await prisma.magazine.update({
      where: { id: magazineId },
      data: { coverImageUrl: firstPage?.imageUrl ?? null },
    });
  }

  revalidatePath(`/admin/magazines/${magazineId}/edit`);
  revalidatePath("/");
  return { success: true };
}
