"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createComment(
  bookId: string | number,
  userId: string | number,
  content: string
) {
  const createdComment = await prisma.comment.create({
    data: {
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: typeof userId === "string" ? parseInt(userId) : userId,
      bookId: typeof bookId === "string" ? parseInt(bookId) : bookId,
    },
  });

  revalidatePath("/book");
  return createdComment;
}
