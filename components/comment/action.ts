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

  return createdComment;
}

export async function createReply(
  parentCommentId: number,
  content: string,
  userId: string | number,
  bookId: string | number,
  isReply: boolean
) {
  const createdReply = await prisma.comment.create({
    data: {
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: typeof userId === "string" ? parseInt(userId) : userId,
      bookId: typeof bookId === "string" ? parseInt(bookId) : bookId,
      parentId: parentCommentId,
      isReply: isReply,
    },
  });

  return createdReply;
}
